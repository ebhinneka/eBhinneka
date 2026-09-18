
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { Activity, Calendar, Search, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Profile, Schedule, NonEffectiveDay } from '../types';

interface TeacherPerformanceData extends Profile {
    targetJp: number;
    actualJp: number;
    percentage: number;
    statusKinerja: string;
    statusColor: string;
}

const KinerjaGuru: React.FC = () => {
  const { academicYear, semester, activeScheduleVersion, semesterStart, semesterEnd } = useAuth();
  const [loading, setLoading] = useState(true);
  const [teachersData, setTeachersData] = useState<TeacherPerformanceData[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherPerformanceData[]>([]);
  const [hmSearch, setHmSearch] = useState('');
  const [nonEffDaysInRange, setNonEffDaysInRange] = useState<NonEffectiveDay[]>([]);
  
  const todayObj = new Date();
  const firstDayOfMonth = new Date(todayObj.getFullYear(), todayObj.getMonth(), 1).toISOString().split('T')[0];
  const todayStr = todayObj.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(todayStr);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedTeacherSchedule, setSelectedTeacherSchedule] = useState<{teacher: Profile, schedules: Schedule[] } | null>(null);

  const dayName = (num: number) => ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'][num];

  useEffect(() => { fetchHeadmasterData(); }, [startDate, endDate]);

  useEffect(() => {
      if (hmSearch) {
          const lower = hmSearch.toLowerCase();
          setFilteredTeachers(teachersData.filter(t => t.full_name?.toLowerCase().includes(lower) || t.mengajar_mapel?.toLowerCase().includes(lower)));
      } else { setFilteredTeachers(teachersData); }
  }, [hmSearch, teachersData]);

  const fetchHeadmasterData = async () => {
      setLoading(true);
      try {
          const firstDayDate = new Date(startDate);
          const lastDayDate = new Date(endDate);
          const firstDayStr = startDate + 'T00:00:00+07:00';
          const endDayStr = endDate + 'T23:59:59+07:00';
          const today = new Date();
          let calcEndDate = new Date(lastDayDate);
          if (calcEndDate > today) calcEndDate = today;

          const [profilesRes, schedulesRes, journalsRes, nonEffRes] = await Promise.all([
              supabase.from('profiles').select('*').neq('role', 'operator').order('full_name'),
              supabase.from('schedules').select('*').eq('academic_year', academicYear || '2025/2026').eq('semester', semester || 'Ganjil').eq('schedule_version', activeScheduleVersion || 'Utama').then(async (res) => {
                  if (res.error && (res.error.code === '42703' || res.error.message?.includes('academic_year'))) {
                      const fallback = await supabase.from('schedules').select('*');
                      if (fallback.data && fallback.data.length > 0 && fallback.data[0].academic_year !== undefined) {
                          fallback.data = fallback.data.filter(s => s.academic_year === (academicYear || '2025/2026') && s.semester === (semester || 'Ganjil'));
                      }
                      return fallback;
                  }
                  return res;
              }),
              supabase.from('journals').select('teacher_id, hours').eq('academic_year', academicYear || '2025/2026').eq('semester', semester || 'Ganjil').gte('created_at', semesterStart ? `${semesterStart}T00:00:00+07:00` : '2000-01-01T00:00:00+07:00').lte('created_at', semesterEnd ? `${semesterEnd}T23:59:59+07:00` : '2100-01-01T23:59:59+07:00').gte('created_at', firstDayStr).lte('created_at', endDayStr),
              supabase.from('app_settings').select('value').eq('key', 'non_effective_days').maybeSingle()
          ]);

          let nonEffectiveDays: NonEffectiveDay[] = [];
          if (nonEffRes?.data?.value) {
              try {
                  nonEffectiveDays = typeof nonEffRes.data.value === 'string' ? JSON.parse(nonEffRes.data.value) : nonEffRes.data.value;
              } catch (e) {
                  console.error("Error parsing non_effective_days", e);
              }
          }

          // Track non-effective days in the selected range
          const matchedNonEff = nonEffectiveDays.filter(ned => ned.date >= startDate && ned.date <= endDate);
          setNonEffDaysInRange(matchedNonEff);

          const excludedNames = ['Guru Baru', 'Agung Budiartati, M.Pd.', 'Dra.Laily Asriyah, M.Pd.I.'];
          const allTeachers = (profilesRes.data || []).filter(t => !excludedNames.includes(t.full_name));
          const allSchedules = schedulesRes.data || [];
          const allJournals = journalsRes.data || [];

          // Pre-calculate active days and exemptions
          interface DayInfo {
              dateStr: string;
              dbDay: number;
              exemptHours: string[]; // ['Full Day'] or specific hours e.g. ['1', '2']
          }
          const activeDays: DayInfo[] = [];
          let d = new Date(firstDayDate);
          while (d <= calcEndDate) {
              const dateStr = d.toISOString().split('T')[0];
              const jsDay = d.getDay(); 
              const dbDay = jsDay === 0 ? 7 : jsDay; 
              
              const nonEff = nonEffectiveDays.find(ned => ned.date === dateStr);
              if (!nonEff) {
                  activeDays.push({ dateStr, dbDay, exemptHours: [] });
              } else if (nonEff.hours && nonEff.hours !== 'Full Day') {
                  const exempt = nonEff.hours.split(',').map(h => h.trim()).filter(Boolean);
                  activeDays.push({ dateStr, dbDay, exemptHours: exempt });
              } else {
                  activeDays.push({ dateStr, dbDay, exemptHours: ['Full Day'] });
              }
              d.setDate(d.getDate() + 1);
          }

          const processed: TeacherPerformanceData[] = allTeachers.map(t => {
              const mySchedules = allSchedules.filter(s => s.teacher_id === t.id);
              
              // Group teacher's schedules by day_of_week
              const scheduleByDay: Record<number, string[][]> = {};
              mySchedules.forEach(s => {
                  const day = s.day_of_week;
                  if (!scheduleByDay[day]) scheduleByDay[day] = [];
                  const hours = s.hour.split(',').map((h: string) => h.trim()).filter(Boolean);
                  scheduleByDay[day].push(hours);
              });

              // Calculate target JP accounting for non-effective days
              let target = 0;
              activeDays.forEach(dayInfo => {
                  if (dayInfo.exemptHours.includes('Full Day')) {
                      // Hari non-efektif seharian penuh: beban JP = 0
                      return;
                  }
                  const schedules = scheduleByDay[dayInfo.dbDay] || [];
                  schedules.forEach(hours => {
                      if (dayInfo.exemptHours.length > 0) {
                          const effectiveHours = hours.filter(h => !dayInfo.exemptHours.includes(h));
                          target += effectiveHours.length;
                      } else {
                          target += hours.length;
                      }
                  });
              });

              const myJournals = allJournals.filter(j => j.teacher_id === t.id);
              let actual = 0;
              myJournals.forEach(j => {
                  const parts = j.hours.split(',').filter((h: string) => h.trim().length > 0);
                  actual += parts.length;
              });

              const percentage = target > 0 ? (actual / target) * 100 : 0;
              let status = "Di Bawah Ekspektasi"; 
              let color = "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";
              if (target === 0 && actual === 0) { 
                  status = "Tidak Ada Jadwal"; 
                  color = "text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"; 
              } else if (percentage > 85) { 
                  status = "Di Atas Ekspektasi"; 
                  color = "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800"; 
              } else if (percentage >= 70) { 
                  status = "Sesuai Ekspektasi"; 
                  color = "text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"; 
              }

              return { ...t, targetJp: target, actualJp: actual, percentage, statusKinerja: status, statusColor: color };
          });
          setTeachersData(processed);
      } catch(e) { console.error("Headmaster Fetch Error", e); } finally { setLoading(false); }
  };

  const handleViewSchedule = async (teacher: Profile) => {
      setLoading(true);
      try {
          let { data, error } = await supabase.from('schedules').select('*').eq('teacher_id', teacher.id).eq('academic_year', academicYear || '2025/2026').eq('semester', semester || 'Ganjil').eq('schedule_version', activeScheduleVersion || 'Utama').order('day_of_week').order('hour');
          if (error && (error.code === '42703' || error.message?.includes('academic_year'))) {
              const res = await supabase.from('schedules').select('*').eq('teacher_id', teacher.id).order('day_of_week').order('hour');
              if (res.data && res.data.length > 0 && res.data[0].academic_year !== undefined) {
                  data = res.data.filter(s => s.academic_year === (academicYear || '2025/2026') && s.semester === (semester || 'Ganjil'));
              } else {
                  data = res.data;
              }
          }
          setSelectedTeacherSchedule({ teacher, schedules: data || [] });
          setShowScheduleModal(true);
      } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <Layout>
        <div className="space-y-6 animate-fade-in">
            {/* Header section matching Dashboard style */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Activity className="text-blue-600 dark:text-blue-400" /> Monitoring Kinerja Guru
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
                        Evaluasi pemenuhan jam mengajar (JP) guru tersinkron dengan kalender hari non-efektif.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 items-center bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16}/>
                        <input 
                            type="text" 
                            placeholder="Cari Guru / Mapel..." 
                            className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-44" 
                            value={hmSearch} 
                            onChange={(e) => setHmSearch(e.target.value)}
                        />
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="date" 
                            className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 py-2 px-3 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                        />
                        <span className="text-slate-400 text-xs font-bold">s/d</span>
                        <input 
                            type="date" 
                            className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 py-2 px-3 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                        />
                    </div>
                </div>
            </div>

            {/* Non-effective days sync status banner */}
            {nonEffDaysInRange.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-blue-800 dark:text-blue-300 animate-fade-in shadow-sm">
                    <div className="flex items-start sm:items-center gap-3">
                        <CheckCircle2 className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 sm:mt-0" size={20} />
                        <div>
                            <p className="font-bold text-sm">
                                {nonEffDaysInRange.length} Hari Non-Efektif Dikecualikan
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                Target JP pada periode ini telah disesuaikan secara akurat sehingga tidak membebani kinerja guru pada tanggal non-efektif.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 self-start sm:self-center">
                        {nonEffDaysInRange.map(ned => (
                            <span key={ned.date} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-[10px] font-bold" title={ned.reason}>
                                {new Date(ned.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}: {ned.hours === 'Full Day' ? 'Seharian' : `Jam ${ned.hours}`}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={36}/>
                    <p className="text-xs font-bold text-slate-400">Menghitung kinerja tersinkron...</p>
                </div>
            ) : filteredTeachers.length === 0 ? (
                <div className="text-center py-20 text-slate-400 dark:text-slate-500 italic bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    Tidak ada data guru ditemukan.
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Nama Guru</th>
                                    <th className="px-6 py-4">Mata Pelajaran</th>
                                    <th className="px-6 py-4 text-center">Target JP</th>
                                    <th className="px-6 py-4 text-center">Realisasi JP</th>
                                    <th className="px-6 py-4 text-center">Persentase</th>
                                    <th className="px-6 py-4 text-center">Kriteria</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredTeachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm">
                                                    {teacher.full_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap block">{teacher.full_name}</span>
                                                    <span className="text-[11px] text-slate-400 font-mono">{teacher.nip || 'NIPY -'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                                            {teacher.mengajar_mapel || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-200">
                                            {teacher.targetJp}
                                        </td>
                                        <td className="px-6 py-4 text-center font-black text-blue-600 dark:text-blue-400 text-base">
                                            {teacher.actualJp}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className="font-bold text-xs text-slate-700 dark:text-slate-200">{teacher.percentage.toFixed(1)}%</span>
                                                <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            teacher.percentage >= 70 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-rose-500'
                                                        }`} 
                                                        style={{ width: `${Math.min(teacher.percentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border whitespace-nowrap inline-block tracking-wide uppercase ${teacher.statusColor}`}>
                                                {teacher.statusKinerja}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleViewSchedule(teacher)} 
                                                className="text-xs bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3.5 py-1.5 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-all whitespace-nowrap shadow-sm"
                                            >
                                                Jadwal
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Schedule Modal - TOP ALIGNED & MATCHING BLUE PALETTE */}
            {showScheduleModal && selectedTeacherSchedule && (
                <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[calc(env(safe-area-inset-top)+1rem)] sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full md:w-auto md:max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative animate-fade-in flex flex-col max-h-[85vh]">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white flex-shrink-0">
                            <h3 className="font-bold text-base flex items-center gap-2">
                                <Calendar size={18}/> Jadwal Mengajar: {selectedTeacherSchedule.teacher.full_name}
                            </h3>
                            <button 
                                onClick={() => setShowScheduleModal(false)} 
                                className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
                            >
                                <X size={18}/>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50 flex-1">
                            {selectedTeacherSchedule.schedules.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 text-sm">Belum ada jadwal yang diinput.</div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedTeacherSchedule.schedules.map((s) => (
                                        <div key={s.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-black text-sm border border-blue-200 dark:border-blue-800">
                                                    {s.kelas}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{s.subject}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{dayName(s.day_of_week)} • Jam {s.hour}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </Layout>
  );
};

export default KinerjaGuru;
