
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { PublicStats } from '../types';
import { Bell,  LogIn, Loader2, BookOpen, AlertCircle, X, School, ChevronDown, ChevronRight, Bookmark, Lock, User, ArrowRight, ShieldCheck, GraduationCap, MonitorPlay, Shield, ChevronLeft, Eye, EyeOff, Calendar  } from 'lucide-react';
import { getWIBDate, getWIBISOString, formatDateIndo, formatTimeIndo } from '../utils/dateUtils';

const PublicDashboard: React.FC = () => {
  const { academicYear, semester , semesterStart, semesterEnd } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginViewMode, setLoginViewMode] = useState<'selection' | 'form'>('selection');
  const [selectedRoleLabel, setSelectedRoleLabel] = useState('');
  const [userId, setUserId] = useState(() => localStorage.getItem('saved_nip') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessSplash, setShowSuccessSplash] = useState(false);
  const { signIn } = useAuth();

  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(getWIBDate());
  
  const [rawAttendance, setRawAttendance] = useState<any[]>([]);
  const [studentClassMap, setStudentClassMap] = useState<Record<string, string>>({});
  const [studentNameMap, setStudentNameMap] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    type: 'class' | 'absence';
    data: any;
  } | null>(null);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(getWIBDate()), 1000);
    fetchData();

    if (isSupabaseConfigured) {
        const channel = supabase
            .channel('public-dashboard-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_logs' }, () => { fetchStatsClientSide(); })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'journals' }, () => { fetchStatsClientSide(); })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'homeroom_attendance' }, () => { fetchStatsClientSide(); })
            .subscribe();
        return () => { clearInterval(timer); supabase.removeChannel(channel); };
    }
    return () => clearInterval(timer);
  }, [academicYear, semester, semesterStart, semesterEnd]);

  const fetchData = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) { useMockData(); setLoading(false); return; }
    await fetchStatsClientSide();
    setLoading(false);
  };

  const useMockData = () => { 
      setStats({
          count7: 0, count8: 0, count9: 0,
          classDetails: {},
          totalJpRequired: 100, completedJp: 0,
          absenceCount: 0, absenceDetails: {S:0, I:0, A:0},
          absencePerClass: {}, unfilledKbm: []
      });
  };

  const fetchStatsClientSide = async () => {
    const todayStr = getWIBISOString();
    const startOfDay = `${todayStr}T00:00:00+07:00`;
    const tempDate = new Date();
    const jsDay = tempDate.getDay();
    const dbDay = jsDay === 0 ? 7 : jsDay;
    const activeScheduleVersion = 'Utama';

    
    const todayObj = new Date(todayStr);
    // removed duplicate jsDay
    let jpPerClass = 0;
    if (jsDay === 6) jpPerClass = 8; // Sabtu
    else if (jsDay === 0) jpPerClass = 6; // Minggu
    else if (jsDay === 1) jpPerClass = 4; // Senin
    else if (jsDay === 2) jpPerClass = 6; // Selasa
    else if (jsDay === 3) jpPerClass = 8; // Rabu
    else if (jsDay === 4) jpPerClass = 4; // Kamis
    else if (jsDay === 5) jpPerClass = 5; // Jumat default
    
    // Removed calculatedTotalJp = jpPerClass * 24

    try {
        const [studentsRes, journalsRes, attendanceRes, homeroomRes, schedulesRes] = await Promise.all([
            
            (async () => {
                let allData: any[] = [];
                let from = 0;
                let step = 1000;
                while (true) {
                    let res = await supabase.from('students').select('id, name, kelas').eq('academic_year', academicYear || '2025/2026').range(from, from + step - 1);
                    if (res.error && (res.error.code === '42703' || res.error.message?.includes('academic_year'))) {
                        res = await supabase.from('students').select('id, name, kelas').eq('academic_year', academicYear || '2025/2026').range(from, from + step - 1);
                    }
                    if (res.error) break;
                    if (!res.data || res.data.length === 0) break;
                    allData = allData.concat(res.data);
                    if (res.data.length < step) break;
                    from += step;
                }
                return { data: allData, error: null };
            })()
,
            supabase.from('journals').select('hours, kelas').eq('academic_year', academicYear || '2025/2026').eq('semester', semester || 'Ganjil').gte('created_at', semesterStart ? `${semesterStart}T00:00:00+07:00` : '2000-01-01T00:00:00+07:00').lte('created_at', semesterEnd ? `${semesterEnd}T23:59:59+07:00` : '2100-01-01T23:59:59+07:00').gte('created_at', startOfDay),
            supabase.from('attendance_logs').select('student_id, student_name, status, created_at, subject').eq('academic_year', academicYear || '2025/2026').eq('semester', semester || 'Ganjil').gte('created_at', semesterStart ? `${semesterStart}T00:00:00+07:00` : '2000-01-01T00:00:00+07:00').lte('created_at', semesterEnd ? `${semesterEnd}T23:59:59+07:00` : '2100-01-01T23:59:59+07:00').gte('created_at', startOfDay),
            supabase.from('homeroom_attendance').select('student_id, status, kelas').gte('date', semesterStart ? `${semesterStart}` : '2000-01-01').lte('date', semesterEnd ? `${semesterEnd}` : '2100-01-01').eq('date', todayStr),
            supabase.from('schedules').select('hour, academic_year, semester').eq('day_of_week', dbDay).eq('academic_year', academicYear || '2025/2026').eq('semester', semester || 'Ganjil').eq('schedule_version', activeScheduleVersion || 'Utama').then(async (res) => {
                if (res.error && (res.error.code === '42703' || res.error.message?.includes('academic_year'))) {
                    return await supabase.from('schedules').select('hour, academic_year, semester').eq('day_of_week', dbDay);
                }
                return res;
            })
        ]);

        const classCounts: Record<string, number> = {};
        const sClassMap: Record<string, string> = {};
        const sNameMap: Record<string, string> = {}; 
        let c7 = 0, c8 = 0, c9 = 0;
        let calculatedTotalJp = 0;
        if (schedulesRes && schedulesRes.data) {
            let scheds = schedulesRes.data;
            if (scheds.length > 0 && scheds[0].academic_year !== undefined) {
                scheds = scheds.filter(s => s.academic_year === (academicYear || '2025/2026') && s.semester === (semester || 'Ganjil'));
            }
            scheds.forEach((s: any) => {
                calculatedTotalJp += s.hour.split(',').filter((h: string) => h.trim() !== '').length;
            });
        }
        if (calculatedTotalJp === 0) calculatedTotalJp = jpPerClass * (Object.keys(classCounts).length || 45); // fallback
        
        if (studentsRes.data) {
            studentsRes.data.forEach((s: any) => {
                const rawKelas = s.kelas ? s.kelas.toUpperCase().trim() : '';
                sClassMap[s.id] = rawKelas;
                if (s.name) sNameMap[s.id] = s.name;
                if (rawKelas) {
                    classCounts[rawKelas] = (classCounts[rawKelas] || 0) + 1;
                    if (rawKelas.startsWith('7')) c7++; else if (rawKelas.startsWith('8')) c8++; else if (rawKelas.startsWith('9')) c9++;
                }
            });
        }
        setStudentClassMap(sClassMap);
        setStudentNameMap(sNameMap);

        const filledClassesSet = new Set<string>();

        let completedJp = 0;
        if (journalsRes.data) {
            journalsRes.data.forEach((j: any) => {
                if (typeof j.hours === 'string') {
                    const parts = j.hours.split(',').filter((h: string) => h.trim().length > 0);
                    completedJp += parts.length;
                }
                if (j.kelas) {
                    filledClassesSet.add(j.kelas.toUpperCase().trim());
                }
            });
        }

        // --- MERGE ATTENDANCE LOGIC (Homeroom Priority) ---
        const combinedAttendance: Record<string, {name: string, status: string, source: 'Wali' | 'Guru'}> = {};

        // 1. Homeroom Attendance (Absensi Wali Kelas - Mutlak)
        if (homeroomRes.data) {
            homeroomRes.data.forEach((h: any) => {
                if (h.kelas) {
                    filledClassesSet.add(h.kelas.toUpperCase().trim());
                } else if (h.student_id && sClassMap[h.student_id]) {
                    filledClassesSet.add(sClassMap[h.student_id]);
                }
                if (['S', 'I', 'A'].includes(h.status)) {
                    // We need name, but homeroom_attendance might not have it joined. 
                    // However, we have student ID. We can map it if needed, or rely on logic below.
                    combinedAttendance[h.student_id] = { 
                        name: 'Loading...', // Name might be missing here if not joined, but handled in detail list
                        status: h.status, 
                        source: 'Wali' 
                    };
                }
            });
        }

        // 2. Teacher Logs ( Guru Mapel) - Only if not already set by Homeroom
        // FILTER: Exclude Salat Dhuha
        const validTeacherLogs = (attendanceRes.data || []).filter((log: any) => {
            const subject = log.subject ? log.subject.toLowerCase() : '';
            return !subject.includes('dhuha');
        });

        validTeacherLogs.forEach((log: any) => {
            if (log.student_id && sClassMap[log.student_id]) {
                filledClassesSet.add(sClassMap[log.student_id]);
            }
            if (!combinedAttendance[log.student_id]) {
                if (['S', 'I', 'A'].includes(log.status)) {
                    combinedAttendance[log.student_id] = { 
                        name: log.student_name, 
                        status: log.status, 
                        source: 'Guru' 
                    };
                }
            }
        });

        // Convert back to Array for processing
        const finalAttendanceList = Object.entries(combinedAttendance).map(([id, val]) => ({
            student_id: id,
            ...val
        }));

        setRawAttendance(finalAttendanceList);

        let sCount = 0, iCount = 0, aCount = 0;
        const absencePerClass: Record<string, number> = {};
        Object.keys(classCounts).forEach(cls => absencePerClass[cls] = 0);

        finalAttendanceList.forEach((log) => {
            if (log.status === 'S') sCount++;
            else if (log.status === 'I') iCount++;
            else if (log.status === 'A') aCount++;
            
            const cls = sClassMap[log.student_id];
            if (cls) absencePerClass[cls] = (absencePerClass[cls] || 0) + 1;
        });

        setStats({
            count7: c7, count8: c8, count9: c9,
            classDetails: classCounts,
            totalJpRequired: calculatedTotalJp, 
            completedJp: completedJp,
            absenceCount: sCount + iCount + aCount,
            absenceDetails: { S: sCount, I: iCount, A: aCount },
            absencePerClass: absencePerClass,
            unfilledKbm: [],
            filledClasses: Array.from(filledClassesSet)
        });
    } catch (err) { console.error(err); }
  };

  
  const handleRoleSelect = (role: 'guru' | 'operator' | 'admin') => {
      if (role === 'operator') {
          navigate('/operator-dashboard');
      } else {
          setSelectedRoleLabel(role === 'admin' ? 'Administrator' : 'Guru / Staf');
          setLoginViewMode('form');
      }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    try {
      const { error } = await signIn(userId, password);
      if (error) {
        if (error.message === 'Failed to fetch') {
           setLoginError('Gagal terhubung ke Database.');
        } else if (error.message.includes('Invalid login')) {
           setLoginError('NIPY atau Password salah.');
        } else {
           setLoginError(error.message);
        }
      } else {
        localStorage.setItem('saved_nip', userId);
        setShowSuccessSplash(true);
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      setLoginError('Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClassClick = (grade: string) => {
      if (!stats) return;
      const details = Object.entries(stats.classDetails).filter(([cls]) => cls.startsWith(grade)).sort(); 
      setModalContent({ title: `Rincian Murid Kelas ${grade}`, type: 'class', data: details });
      setModalOpen(true);
  };

  const handleAbsenceClick = () => {
      if (!stats) return;
      setExpandedClass(null);
      setModalContent({ title: 'Rincian Ketidakhadiran Hari Ini', type: 'absence', data: stats });
      setModalOpen(true);
  };

  const getAbsentStudentsForClass = (cls: string) => {
      // Find students in rawAttendance that belong to this class
      // Note: rawAttendance now contains merged data
      const absentStudents = rawAttendance.filter(log => studentClassMap[log.student_id] === cls);
      
      // Need to fetch real names if missing from Homeroom source
      // In a real app, I'd pre-fetch names map. For now, rely on teacher logs or generic.
      return absentStudents.map(s => ({
          name: (s.name === 'Loading...' || s.name === 'Unknown') ? (studentNameMap[s.student_id] || 'Siswa (Data Wali)') : s.name, 
          status: s.status,
          source: s.source
      }));
  };

  const progressPercentage = stats && stats.totalJpRequired > 0 
    ? Math.min((stats.completedJp / stats.totalJpRequired) * 100, 100) 
    : 0;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-3 sm:p-5 font-sans bg-[#f1f5f9] dark:bg-slate-900 transition-colors duration-300">
      <main className="w-full max-w-[430px] space-y-3.5 m-auto">
        
        {/* TOP HEADER CARD */}
        <div className="bg-gradient-to-r from-[#0d47a1] via-[#1565c0] to-[#1976d2] rounded-[28px] p-5 shadow-[0_12px_30px_rgba(21,101,192,0.35)] border border-blue-400/20 text-white relative overflow-hidden flex items-center justify-between">
             {/* Decorative Background Pattern */}
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"></div>
             <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
             
             {/* Curved Light Stroke Watermark */}
             <svg className="absolute right-0 bottom-0 w-36 h-36 opacity-20 pointer-events-none" viewBox="0 0 100 100" fill="none">
               <circle cx="80" cy="80" r="60" stroke="white" strokeWidth="2" />
               <circle cx="80" cy="80" r="45" stroke="white" strokeWidth="1" />
             </svg>

             {/* Left Section (Logo + School Title) */}
             <div className="flex items-center gap-3 relative z-10">
                 <div className="w-14 h-14 rounded-full bg-white/10 p-1 border-2 border-amber-300/80 shadow-[0_0_15px_rgba(252,211,77,0.3)] flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                    <img src="https://i.imghippo.com/files/WXB3962h.png" alt="Logo" className="w-full h-full object-contain" />
                 </div>
                 <div>
                    <h1 className="text-[16px] font-extrabold text-white leading-[1.25] tracking-tight drop-shadow-sm uppercase">
                      SMP BHINNEKA <br/> TUNGGAL IKA
                    </h1>
                    <p className="text-xs font-semibold text-blue-100/90 mt-1">eBhinneka</p>
                 </div>
             </div>

             {/* Vertical Divider */}
             <div className="w-[1px] h-11 bg-white/20 mx-2 flex-shrink-0 relative z-10"></div>

             {/* Right Section (Date & Clock) */}
             <div className="text-right relative z-10 flex flex-col items-end justify-center">
                <p className="text-[11px] font-medium text-blue-100/90 mb-0.5 whitespace-nowrap">{formatDateIndo(time)}</p>
                <div className="flex items-center gap-1.5">
                   <span className="text-3xl font-extrabold text-white font-sans tracking-tight leading-none drop-shadow-sm">
                     {formatTimeIndo(time)}
                   </span>
                   <span className="bg-white/20 border border-white/30 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg backdrop-blur-md shadow-sm">
                     WIB
                   </span>
                </div>
             </div>
        </div>

        {loading ? (
            <div className="bg-white dark:bg-slate-800 rounded-[24px] p-10 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60">
                <Loader2 className="animate-spin mb-3 text-blue-500" size={32} />
                <p className="text-xs font-bold">Memuat Data...</p>
            </div> 
        ) : stats ? (
          <>
            {/* ACADEMIC YEAR PILL */}
            <div className="flex justify-center">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] text-xs font-extrabold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-700/60">
                    <Calendar size={16} className="text-blue-600 dark:text-blue-400"/> 
                    Tahun Ajaran: {academicYear} <span className="text-slate-300 dark:text-slate-600">|</span> Semester: {semester}
                </div>
            </div>

            {/* TOP 3 CLASS METRIC CARDS */}
            <div className="grid grid-cols-3 gap-3">
               {[
                 { label: "KELAS 7", count: stats.count7, grade: '7' },
                 { label: "KELAS 8", count: stats.count8, grade: '8' },
                 { label: "KELAS 9", count: stats.count9, grade: '9' },
               ].map((item) => (
                  <button 
                    key={item.grade}
                    onClick={() => handleClassClick(item.grade)}
                    className="bg-white dark:bg-slate-800/90 rounded-[22px] p-3.5 flex flex-col items-center justify-center text-center shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 relative overflow-hidden h-[148px] hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer group"
                  >
                      {/* Watermark dots */}
                      <div className="absolute -bottom-1 -right-1 opacity-20 pointer-events-none">
                         <div className="w-8 h-8 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:4px_4px]"></div>
                      </div>

                      <div className="w-11 h-11 rounded-full bg-gradient-to-b from-blue-100 to-sky-50 dark:from-blue-900/40 dark:to-slate-800 border border-blue-200/60 dark:border-blue-700/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner mb-2 group-hover:scale-105 transition-transform">
                          <School size={22} strokeWidth={2} />
                      </div>
                      <h2 className="text-3xl sm:text-[34px] font-extrabold text-[#0d47a1] dark:text-blue-400 tracking-tight leading-none mb-1">
                        {item.count}
                      </h2>
                      <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        {item.label}
                      </p>
                      <span className="w-7 h-[3px] bg-blue-500 rounded-full"></span>
                  </button>
               ))}
            </div>

            {/* MIDDLE 2 METRIC CARDS */}
            <div className="grid grid-cols-2 gap-3">
                {/* KBM TERLAKSANA */}
                <div className="bg-white dark:bg-slate-800/90 rounded-[24px] p-5 flex flex-col items-center justify-center text-center shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 relative overflow-hidden h-[160px]">
                     {/* Watermark open book line art */}
                     <BookOpen className="absolute -bottom-2 -left-2 size-24 opacity-10 text-blue-900 dark:text-blue-400 pointer-events-none stroke-[1]" />

                     <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#1565c0] to-[#0d47a1] text-white flex items-center justify-center shadow-md shadow-blue-600/30 mb-2 relative z-10">
                        <BookOpen size={22} strokeWidth={2.2} />
                     </div>
                     <div className="flex items-baseline gap-1 mb-1 relative z-10">
                        <span className="text-3xl sm:text-[34px] font-extrabold text-[#0d47a1] dark:text-blue-400 tracking-tight leading-none">
                          {stats.completedJp}
                        </span>
                        <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500">
                          / {stats.totalJpRequired} JP
                        </span>
                     </div>
                     <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 relative z-10">
                       KBM TERLAKSANA
                     </p>
                     <span className="w-7 h-[3px] bg-blue-500 rounded-full relative z-10"></span>
                </div>

                {/* KETIDAKHADIRAN MURID */}
                <button 
                    onClick={handleAbsenceClick}
                    className="bg-white dark:bg-slate-800/90 rounded-[24px] p-5 flex flex-col items-center justify-center text-center shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 relative overflow-hidden h-[160px] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group"
                >
                     {/* Watermark people line art */}
                     <div className="absolute -bottom-2 -right-2 opacity-10 text-blue-900 dark:text-blue-400 pointer-events-none">
                        <div className="flex items-end gap-1">
                          <div className="w-6 h-10 rounded-t-full bg-current"></div>
                          <div className="w-8 h-12 rounded-t-full bg-current"></div>
                          <div className="w-6 h-8 rounded-t-full bg-current"></div>
                        </div>
                     </div>

                     <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#1565c0] to-[#0d47a1] text-white flex items-center justify-center shadow-md shadow-blue-600/30 mb-2 group-hover:scale-105 transition-transform relative z-10">
                        <span className="text-xl font-extrabold leading-none">!</span>
                     </div>
                     <span className="text-3xl sm:text-[34px] font-extrabold text-[#0d47a1] dark:text-blue-400 tracking-tight leading-none mb-1 relative z-10">
                       {stats.absenceCount}
                     </span>
                     <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 text-center leading-tight relative z-10">
                       KETIDAKHADIRAN<br/>MURID
                     </p>
                     <span className="w-7 h-[3px] bg-blue-500 rounded-full relative z-10"></span>
                </button>
            </div>

            {/* PROGRESS BAR CARD */}
            <div className="bg-white dark:bg-slate-800/90 rounded-[24px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 relative overflow-hidden">
                {/* Header title with diamond accents */}
                <div className="flex items-center justify-center gap-2 mb-3.5 text-center">
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-700 to-transparent"></div>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">◇</span>
                    <h3 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      PROGRESS KBM HARI INI
                    </h3>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">◇</span>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-700 to-transparent"></div>
                </div>

                {/* Progress bar track & bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700/80 rounded-full h-7 p-1 shadow-inner relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#0d47a1] via-[#1565c0] to-[#2563eb] h-5 rounded-full flex items-center justify-end pr-3 transition-all duration-700 ease-out shadow-sm relative z-10"
                      style={{ width: `${Math.max(progressPercentage, 12)}%` }}
                    >
                        <span className="text-[11px] font-extrabold text-white leading-none">
                          {progressPercentage.toFixed(1)}%
                        </span>
                    </div>
                </div>

                {/* Bottom status & chart watermark */}
                <div className="mt-3 flex justify-between items-end relative z-10">
                    <div>
                        <span className="text-sm font-extrabold text-[#0d47a1] dark:text-blue-400">
                            {progressPercentage.toFixed(1)}%
                        </span> 
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-1.5">
                            Terlaksana
                        </span>
                    </div>
                </div>

                {/* Rising Bar Chart Graphic Watermark */}
                <div className="absolute bottom-2.5 right-4 opacity-15 text-blue-900 dark:text-blue-300 pointer-events-none flex items-end gap-1">
                    <div className="w-2.5 h-3 bg-current rounded-t-sm"></div>
                    <div className="w-2.5 h-5 bg-current rounded-t-sm"></div>
                    <div className="w-2.5 h-7 bg-current rounded-t-sm"></div>
                    <div className="w-2.5 h-10 bg-current rounded-t-sm"></div>
                </div>
            </div>

            {/* LOGIN BUTTON */}
            <div className="pt-1">
                <button 
                    onClick={() => setShowLoginModal(true)} 
                    className="w-full bg-gradient-to-r from-[#0d47a1] via-[#1565c0] to-[#1d4ed8] hover:from-[#0c3b85] hover:to-[#1e40af] text-white font-extrabold text-base py-4 px-6 rounded-[22px] flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(21,101,192,0.35)] transition-all active:scale-[0.98] border border-blue-400/30 relative overflow-hidden group"
                >
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:10px_10px]"></div>
                    
                    <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:scale-105 transition-transform relative z-10">
                        <LogIn size={18} className="stroke-[2.5]" />
                    </div>
                    <span className="text-base font-extrabold text-white tracking-wide relative z-10">Login Sebagai</span>
                </button>
            </div>
          </>
        ) : <p className="text-center text-slate-400 text-sm mt-10">Gagal memuat data.</p>}
      </main>

      {/* MODAL - FIXED VIEWPORT (Z-9999) */}
      {modalOpen && modalContent && (
          <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in w-screen h-[100dvh]" onClick={() => setModalOpen(false)}>
              <div className="app-card w-full md:w-full md:max-w-sm flex flex-col max-h-[85vh] overflow-hidden bg-slate-100 dark:bg-slate-900 rounded-t-3xl md:rounded-3xl shadow-2xl mb-0 md:mb-auto transition-transform transform scale-100" onClick={e => e.stopPropagation()}>
                  
                  {/* Modal Header */}
                  <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
                      <h3 className="font-extrabold text-slate-800 dark:text-white text-lg leading-tight">{modalContent.title}</h3>
                      <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 bg-gray-50 dark:bg-slate-700 rounded-full">
                          <X size={20} />
                      </button>
                  </div>

                  {/* Modal Body */}
                  <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-100 dark:bg-slate-900 pb-10 md:pb-6">
                      
                      {modalContent.type === 'class' ? (
                          <div className="grid grid-cols-3 gap-3">
                              {modalContent.data.map(([cls, count]: any) => (
                                  <div key={cls} className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-2xl text-center border border-slate-100 dark:border-slate-600 shadow-sm hover:border-blue-200 transition-colors">
                                      <div className="font-extrabold text-slate-700 dark:text-white text-xl">{cls}</div>
                                      <div className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase mt-1">{count} Murid</div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                        <>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col items-center justify-center p-3 bg-sky-100 dark:bg-blue-500/30 rounded-2xl border border-blue-300 dark:border-blue-500/50">
                                    <span className="text-blue-500 dark:text-blue-500 font-bold text-[10px] uppercase mb-1">Sakit</span>
                                    <span className="text-3xl font-extrabold text-blue-500 dark:text-blue-500">{modalContent.data.absenceDetails.S}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                                    <span className="text-blue-700 dark:text-blue-400 font-bold text-[10px] uppercase mb-1">Izin</span>
                                    <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{modalContent.data.absenceDetails.I}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 bg-sky-100 dark:bg-blue-600/30 rounded-2xl border border-blue-300 dark:border-blue-600/50">
                                    <span className="text-blue-600 dark:text-blue-500 font-bold text-[10px] uppercase mb-1">Alpa</span>
                                    <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-500">{modalContent.data.absenceDetails.A}</span>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600 rounded-xl text-center">
                                <span className="text-[10px] text-blue-100/70 font-bold uppercase">*Termasuk input dari Wali Kelas & Guru Mapel.</span>
                            </div>

                            <hr className="border-slate-100 dark:border-slate-700" />

                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Bookmark size={16} className="text-blue-500 fill-blue-500"/>
                                    <h4 className="font-bold text-slate-700 dark:text-white text-sm">Rincian Per Kelas</h4>
                                </div>
                                
                                <div className="space-y-3">
                                    {Object.keys(modalContent.data.classDetails).sort().map(cls => {
                                        const totalStudents = modalContent.data.classDetails[cls] || 0;
                                        const absentCount = modalContent.data.absencePerClass[cls] || 0;
                                        const presentCount = totalStudents - absentCount;
                                        const isExpanded = expandedClass === cls;
                                        const isFilled = modalContent.data.filledClasses?.includes(cls) ?? false;

                                        return (
                                            <div key={cls} className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden transition-all hover:shadow-sm">
                                                <button 
                                                    onClick={() => setExpandedClass(isExpanded ? null : cls)} 
                                                    className="w-full flex items-center p-3 bg-slate-100 dark:bg-slate-700/30"
                                                >
                                                    <div className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-600 rounded-xl font-bold text-slate-700 dark:text-white text-sm shadow-sm">
                                                        {cls}
                                                    </div>
                                                    <div className="flex-1 px-4 text-left">
                                                        <div className="flex items-center gap-2 text-xs font-bold">
                                                            {isFilled ? (
                                                                <>
                                                                    <span className="text-blue-600 dark:text-blue-400">{presentCount} Hadir</span>
                                                                    <span className="text-slate-300 dark:text-slate-600">|</span>
                                                                    <span className={absentCount > 0 ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}>
                                                                        {absentCount} Tidak Hadir
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="text-slate-400 dark:text-slate-500">{presentCount} Hadir</span>
                                                                    <span className="text-slate-300 dark:text-slate-600">|</span>
                                                                    <span className="text-slate-400 dark:text-slate-500">
                                                                        0 Tidak Hadir
                                                                    </span>
                                                                    <span className="text-[10px] bg-slate-200/60 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-normal ml-1">
                                                                        Belum diisi
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-slate-300 dark:text-slate-600">
                                                        {isExpanded ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
                                                    </div>
                                                </button>

                                                {isExpanded && absentCount > 0 && (
                                                    <div className="bg-gray-50 dark:bg-slate-900 p-3 border-t border-slate-100 dark:border-slate-700 space-y-2 animate-fade-in">
                                                        {getAbsentStudentsForClass(cls).map((s: any, idx: number) => (
                                                            <div key={idx} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700 p-3 rounded-xl border border-slate-100 dark:border-slate-600 text-xs shadow-sm">
                                                                <span className="font-bold text-slate-700 dark:text-white">{s.name}</span>
                                                                <div className="flex items-center gap-2">
                                                                    {s.source === 'Wali' && <span className="text-[9px] bg-sky-100 text-blue-600 px-1 rounded border border-blue-300">Wali</span>}
                                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${s.status === 'S' ? 'bg-blue-300 text-blue-500 dark:bg-blue-500 dark:text-white/70' : s.status === 'I' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100' : 'bg-blue-300 text-blue-600 dark:bg-blue-600 dark:text-white/70'}`}>
                                                                        {s.status === 'S' ? 'Sakit' : s.status === 'I' ? 'Izin' : 'Alpa'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {isExpanded && absentCount === 0 && (
                                                    <div className={`p-3 text-center text-xs font-bold border-t ${
                                                        isFilled 
                                                            ? "bg-sky-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-500/30"
                                                            : "bg-slate-100/80 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700"
                                                    }`}>
                                                        {isFilled ? "Semua murid hadir." : "Belum ada jurnal/absensi diisi hari ini."}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                      )}
                  </div>
              </div>
          </div>
      )}
    
      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[99999] flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setShowLoginModal(false)}>
           <div className="bg-transparent w-full max-w-lg flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
               {loginViewMode === 'selection' ? (
                  <div className="w-full grid gap-4 animate-fade-in bg-[#2563eb] p-8 rounded-[2rem] shadow-2xl border border-blue-400">
                      <div className="flex justify-between items-center mb-2">
                          <h2 className="text-xl font-extrabold text-white">Masuk Sebagai</h2>
                          <button onClick={() => setShowLoginModal(false)} className="text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={24}/></button>
                      </div>
                      
                      <button 
                        onClick={() => handleRoleSelect('guru')}
                        className="bg-slate-100/10 hover:bg-slate-100/20 backdrop-blur-xl border border-slate-100/30 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"
                      >
                          <div className="w-16 h-16 rounded-full bg-slate-100/20 text-white shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <GraduationCap size={32} />
                          </div>
                          <div className="text-left">
                              <h3 className="text-lg font-extrabold text-white">Guru / Tenaga Pendidik</h3>
                              <p className="text-xs text-white/90 font-bold opacity-90">Masuk untuk mengisi jurnal & absensi.</p>
                          </div>
                          <div className="ml-auto text-white/70 group-hover:text-white">
                              <ArrowRight size={24} />
                          </div>
                      </button>

                      <button 
                        onClick={() => handleRoleSelect('operator')}
                        className="bg-slate-100/10 hover:bg-slate-100/20 backdrop-blur-xl border border-slate-100/30 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"
                      >
                          <div className="w-16 h-16 rounded-full bg-slate-100/20 text-white shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <MonitorPlay size={32} />
                          </div>
                          <div className="text-left">
                              <h3 className="text-lg font-extrabold text-white">Operator Monitor</h3>
                              <p className="text-xs text-white/90 font-bold opacity-90">Dashboard monitoring jadwal real-time.</p>
                          </div>
                          <div className="ml-auto text-white/70 group-hover:text-white">
                              <ArrowRight size={24} />
                          </div>
                      </button>

                      <button 
                        onClick={() => handleRoleSelect('admin')}
                        className="bg-slate-100/10 hover:bg-slate-100/20 backdrop-blur-xl border border-slate-100/30 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"
                      >
                          <div className="w-16 h-16 rounded-full bg-slate-100/20 text-white shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <Shield size={32} />
                          </div>
                          <div className="text-left">
                              <h3 className="text-lg font-extrabold text-white">Administrator</h3>
                              <p className="text-xs text-white/90 font-bold opacity-90">Pengaturan sistem dan data master.</p>
                          </div>
                          <div className="ml-auto text-white/70 group-hover:text-white">
                              <ArrowRight size={24} />
                          </div>
                      </button>
                  </div>
               ) : (
                  <div className="w-full max-w-sm bg-[#2563eb] rounded-[2rem] shadow-2xl border border-blue-400 overflow-hidden relative animate-fade-in transition-colors">
                      <div className="p-8">
                          <div className="flex justify-between items-start mb-6">
                              <button 
                                onClick={() => setLoginViewMode('selection')}
                                className="text-white/90 hover:text-white dark:hover:text-slate-200 hover:bg-slate-100/20 p-2 rounded-full transition-colors -ml-2"
                                title="Kembali"
                              >
                                  <ChevronLeft size={24} />
                              </button>
                              <button onClick={() => setShowLoginModal(false)} className="text-white/90 hover:text-white p-2 rounded-full hover:bg-slate-100/20 transition-colors -mr-2"><X size={24}/></button>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center gap-1 mb-6 -mt-4">
                              <div className="p-3 bg-slate-100/20 text-white shadow-inner rounded-full mb-2">
                                  <ShieldCheck size={28} />
                              </div>
                              <h2 className="text-lg font-bold text-white">Login {selectedRoleLabel}</h2>
                              <p className="text-xs text-white/90 font-bold">Silakan masukkan kredensial Anda.</p>
                          </div>

                          <form onSubmit={handleLoginSubmit} className="space-y-5">
                            <div>
                              <label className="block text-sm font-bold text-white mb-2">User ID (NIPY)</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                  name="nip"
                                  id="nip"
                                  autoComplete="username"
                                  type="text"
                                  value={userId}
                                  onChange={(e) => setUserId(e.target.value)}
                                  className="pl-12 block w-full bg-slate-100/10 backdrop-blur-md border border-slate-100/30 rounded-xl focus:ring-2 focus:ring-slate-100 focus:border-slate-100 p-3.5 text-white text-sm font-bold transition-all placeholder:text-white/70/70 placeholder:font-normal"
                                  placeholder="Contoh: 19870101..."
                                  required
                                  autoFocus
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-bold text-white mb-2">Password</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                  name="password"
                                  id="password"
                                  autoComplete="current-password"
                                  type={showPassword ? "text" : "password"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="pl-12 pr-12 block w-full bg-slate-100/10 backdrop-blur-md border border-slate-100/30 rounded-xl focus:ring-2 focus:ring-slate-100 focus:border-slate-100 p-3.5 text-white text-sm font-bold transition-all placeholder:text-white/70/70 placeholder:font-normal"
                                  placeholder="Masukkan Password"
                                  required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer z-10"
                                    tabIndex={-1}
                                    title={showPassword ? "Sembunyikan" : "Lihat Password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                              </div>
                            </div>

                            {loginError && (
                              <div className="flex items-center gap-3 text-blue-600 dark:text-blue-500 text-xs font-bold bg-sky-100 dark:bg-blue-600/20 p-3 rounded-xl border border-blue-300 dark:border-blue-600/50">
                                <AlertCircle size={18} className="flex-shrink-0" />
                                <span>{loginError}</span>
                              </div>
                            )}

                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full bg-white hover:bg-slate-100 text-[#2563eb] font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg border border-white mt-4 active:scale-95"
                            >
                              {isSubmitting ? 'Memproses...' : (
                                <>
                                  Masuk Aplikasi <ArrowRight size={20} />
                                </>
                              )}
                            </button>
                          </form>
                      </div>
                  </div>
               )}
           </div>
        </div>
      )}

    
      {showSuccessSplash && (
        <div className="fixed inset-0 z-[999999] bg-slate-900 flex items-center justify-center">
            <div className="relative animate-shrink-to-top-right">
                <Bell size={120} className="text-[#fb923c] animate-pulse drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]" />
                <span className="absolute top-0 right-2 z-20 min-w-[36px] h-[36px] flex items-center justify-center text-[18px] font-bold text-white border-4 border-slate-900 rounded-full px-[3px] bg-[#fb923c]">
                    3
                </span>
            </div>
        </div>
      )}
    </div>
  );
};

export default PublicDashboard;
