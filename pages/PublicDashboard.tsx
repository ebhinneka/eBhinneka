import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured, fetchAllStudents } from '../services/supabase';
import { PublicStats } from '../types';
import { Bell, LogIn, Loader2, BookOpen, AlertCircle, X, School, ChevronDown, ChevronRight, Bookmark, Lock, User, ArrowRight, ShieldCheck, GraduationCap, MonitorPlay, Shield, ChevronLeft, Eye, EyeOff, Calendar, CheckCircle2, ClipboardList } from 'lucide-react';
import { getWIBDate, getWIBISOString, formatDateIndo, formatTimeIndo } from '../utils/dateUtils';

const PublicDashboard: React.FC = () => {
  const { academicYear, semester, activeScheduleVersion, signIn } = useAuth();
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
            
        return () => {
            supabase.removeChannel(channel);
            clearInterval(timer);
        };
    }
    return () => clearInterval(timer);
  }, [academicYear, semester]);

  const fetchData = async () => {
      setLoading(true);
      await fetchStatsClientSide();
      setLoading(false);
  }

  const fetchStatsClientSide = async () => {
      try {
          const date = getWIBISOString().split('T')[0];
          const startOfDay = `${date}T00:00:00+07:00`;
          const endOfDay = `${date}T23:59:59+07:00`;
          
          let statsData: any = {
              count7: 0, count8: 0, count9: 0,
              absenceCount: 0, completedJp: 0, totalJpRequired: 360,
              filledClasses: []
          };
          
          if (!isSupabaseConfigured) {
              setStats(statsData);
              return;
          }

          let allStudents = await fetchAllStudents(academicYear || '2025/2026');
          let cMap: Record<string, string> = {};
          let nMap: Record<string, string> = {};
          
          if (allStudents.length > 0) {
              statsData.count7 = allStudents.filter((s: any) => s.kelas?.startsWith('7')).length;
              statsData.count8 = allStudents.filter((s: any) => s.kelas?.startsWith('8')).length;
              statsData.count9 = allStudents.filter((s: any) => s.kelas?.startsWith('9')).length;
              
              allStudents.forEach((s: any) => { cMap[s.id] = s.kelas || ''; nMap[s.id] = s.name || ''; });
              setStudentClassMap(cMap);
              setStudentNameMap(nMap);
          }

          const { data: homeroom } = await supabase.from('homeroom_attendance').select('student_id, status, kelas').eq('date', date);
          const { data: attendance } = await supabase.from('attendance_logs').select('student_id, student_name, status, created_at').gte('created_at', startOfDay).lte('created_at', endOfDay).neq('status', 'D');
           
          const uniqueAbsences: Record<string, any> = {};
          if (homeroom) {
              homeroom.forEach((h: any) => {
                  if (['S', 'I', 'A'].includes(h.status)) {
                      uniqueAbsences[h.student_id] = { id: h.student_id, name: nMap[h.student_id] || 'Murid', status: h.status, source: 'Wali Kelas', kelas: h.kelas || cMap[h.student_id] || '?' };
                  }
              });
          }
          if (attendance) {
              attendance.forEach((a: any) => {
                  if (!uniqueAbsences[a.student_id]) {
                      if (['S', 'I', 'A'].includes(a.status)) {
                          uniqueAbsences[a.student_id] = { id: a.student_id, name: a.student_name || nMap[a.student_id] || 'Murid', status: a.status, source: 'Guru', kelas: cMap[a.student_id] || '?' };
                      }
                  }
              });
          }
          
          let absentStudents = Object.values(uniqueAbsences);
          setRawAttendance(absentStudents);
          statsData.absenceCount = absentStudents.length;
          
          const dateObj = new Date(date);
          const jsDay = dateObj.getDay();
          const dbDay = jsDay === 0 ? 7 : jsDay;
          
          const [schedulesRes, journalsRes] = await Promise.all([
              supabase.from('schedules').select('*').eq('day_of_week', dbDay).eq('schedule_version', activeScheduleVersion || 'Utama').then(async (res) => {
                  if (res.error && (res.error.code === '42703' || res.error.message?.includes('academic_year') || res.error.message?.includes('schedule_version'))) {
                      const fallback = await supabase.from('schedules').select('*').eq('day_of_week', dbDay).eq('academic_year', academicYear || '2025/2026').eq('semester', semester || 'Genap');
                      if (fallback.error) {
                          const ultraFallback = await supabase.from('schedules').select('*').eq('day_of_week', dbDay);
                          if (ultraFallback.data) {
                              ultraFallback.data = ultraFallback.data.filter(s => s.academic_year === academicYear && s.semester === semester);
                          }
                          return ultraFallback;
                      }
                      return fallback;
                  }
                  return res;
              }),
              supabase.from('journals').select('teacher_id, kelas, subject, hours').gte('created_at', startOfDay).lte('created_at', endOfDay)
          ]);

          let schedules = schedulesRes.data || [];
          const validHoursMap: Record<number, number[]> = {
              1: [3, 4, 5, 6],
              2: [1, 2, 3, 4, 5, 6],
              3: [1, 2, 3, 4, 5, 6, 7, 8],
              4: [3, 4, 5, 6],
              6: [1, 2, 3, 4, 5, 6, 7, 8],
              7: [1, 2, 3, 4, 5, 6]
          };
          if (validHoursMap[dbDay]) {
              const validHours = validHoursMap[dbDay];
              schedules = schedules.filter(sch => {
                  const schHours = sch.hour.split(',').map((h: any) => parseInt(h.trim())).filter((h: number) => !isNaN(h));
                  return schHours.some((h: number) => validHours.includes(h));
              });
          }
          const journals = journalsRes.data || [];
          let totalSchedules = 0;
          let filledSchedules = 0;
          
          const processed = schedules.map(sch => {
              const schHours = sch.hour.split(',').map((h: string) => h.trim());
              const jp = schHours.length;
              totalSchedules += jp;
              const isFilled = journals.some(j => {
                  if (j.kelas !== sch.kelas || j.subject !== sch.subject) return false;
                  if (j.teacher_id && j.teacher_id === sch.teacher_id) return true;
                  const jHours = j.hours.split(',').map((h: string) => h.trim());
                  return schHours.some((h: string) => jHours.includes(h));
              });
              
              if (isFilled) filledSchedules += jp;
              return { isFilled };
          });
          
          const filledClasses = [...new Set(journals.map((j: any) => j.kelas))];
          statsData.completedJp = filledSchedules;
          statsData.totalJpRequired = totalSchedules;
          statsData.filledClasses = filledClasses;
          
          setStats(statsData);
      } catch (err) {
          console.error(err);
      }
  };

  const handleClassClick = (grade: string) => {
      const clsCounts: Record<string, number> = {};
      Object.keys(studentClassMap).forEach(id => {
          const cls = studentClassMap[id];
          if (cls.startsWith(grade)) {
              clsCounts[cls] = (clsCounts[cls] || 0) + 1;
          }
      });
      setModalContent({ title: `Murid Kelas ${grade}`, type: 'class', data: Object.entries(clsCounts).sort() });
      setModalOpen(true);
  };

  const handleAbsenceClick = () => {
      const absenceDetails = { S: 0, I: 0, A: 0 };
      const classDetails: Record<string, number> = {};
      const absencePerClass: Record<string, number> = {};
      
      Object.keys(studentClassMap).forEach(id => {
          const cls = studentClassMap[id];
          classDetails[cls] = (classDetails[cls] || 0) + 1;
      });
      
      rawAttendance.forEach(a => {
          if (a.status === 'S') absenceDetails.S++;
          if (a.status === 'I') absenceDetails.I++;
          if (a.status === 'A') absenceDetails.A++;
          if (a.kelas) absencePerClass[a.kelas] = (absencePerClass[a.kelas] || 0) + 1;
      });
      
      setModalContent({ title: 'Ketidakhadiran Murid Hari Ini', type: 'absence', data: { absenceDetails, classDetails, absencePerClass, filledClasses: stats?.filledClasses || [], rawAttendance } });
      setModalOpen(true);
  };

  const getAbsentStudentsForClass = (cls: string) => {
      return rawAttendance.filter((a: any) => (a.kelas === cls || studentClassMap[a.id] === cls)).map((a: any) => ({ ...a, name: studentNameMap[a.id] || 'Unknown' }));
  };

  const handleRoleSelect = (role: string) => {
      if (role === 'operator') { navigate('/operator-dashboard'); return; }
      setSelectedRoleLabel(role === 'guru' ? 'Guru' : role === 'admin' ? 'Admin' : 'Operator');
      setLoginViewMode('form');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError('');
      setIsSubmitting(true);
      try {
          const { error } = await signIn(userId, password);
          if (error) throw error;
          
          localStorage.setItem('saved_nip', userId);
          setShowLoginModal(false);
          setShowSuccessSplash(true);
          
          setTimeout(() => {
              if (selectedRoleLabel === 'Guru') navigate('/dashboard');
              else if (selectedRoleLabel === 'Admin') navigate('/dashboard');
              else navigate('/operator-dashboard');
          }, 1500);
      } catch (err: any) {
          setLoginError(err.message || 'Login failed');
      } finally {
          setIsSubmitting(false);
      }
  };

  const progressPercentage = stats && stats.totalJpRequired > 0 
    ? Math.min((stats.completedJp / stats.totalJpRequired) * 100, 100) 
    : 0;

  return (
    <div className="min-h-[100dvh] relative overflow-hidden bg-[#eaf4fc] font-sans flex flex-col items-center pb-10 transition-colors duration-300">
      {/* Background SVG Waves */}
      <div className="absolute top-0 left-0 w-full h-[500px] z-0 pointer-events-none overflow-hidden">
        {/* Deep blue base */}
        <div className="absolute top-0 left-0 w-full h-full bg-[#0c4a9a]"></div>
        
        {/* Top curved wave */}
        <svg viewBox="0 0 1440 320" className="absolute top-0 w-full h-auto" preserveAspectRatio="none">
           <path fill="#1662c2" fillOpacity="0.8" d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,64C1120,43,1280,21,1360,10.7L1440,0L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
        </svg>

        {/* Highlight wave */}
        <svg viewBox="0 0 1440 320" className="absolute top-[20px] w-full h-auto" preserveAspectRatio="none">
          <path fill="#2c81e3" fillOpacity="0.5" d="M0,192L80,181.3C160,171,320,149,480,160C640,171,800,213,960,208C1120,203,1280,149,1360,122.7L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
        </svg>

        {/* Bottom wave cutting into white */}
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto" preserveAspectRatio="none" style={{ transform: 'translateY(1px)' }}>
          <path fill="#eaf4fc" fillOpacity="1" d="M0,192L80,202.7C160,213,320,235,480,229.3C640,224,800,192,960,165.3C1120,139,1280,117,1360,106.7L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>

        {/* Thin golden accent line */}
        <svg viewBox="0 0 1440 320" className="absolute bottom-[-10px] w-full h-auto z-10" preserveAspectRatio="none">
          <path fill="none" stroke="#facc15" strokeWidth="4" strokeOpacity="0.6" d="M0,192L80,202.7C160,213,320,235,480,229.3C640,224,800,192,960,165.3C1120,139,1280,117,1360,106.7L1440,96"></path>
        </svg>
      </div>
      
      {/* Main Container */}
      <main className="w-full max-w-[420px] px-4 mx-auto mt-6 relative z-10 space-y-4">
        
        {/* HEADER */}
        <div className="flex items-start justify-between mb-1">
            {/* Logo & School Name */}
            <div className="flex items-center gap-2">
                <div className="w-[68px] h-[68px] rounded-full p-[2px] bg-gradient-to-b from-[#eaf4fc] to-[#a5d0f5] shadow-lg flex-shrink-0 flex items-center justify-center bg-white relative overflow-hidden">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-1.5 border-[2px] border-[#0c4a9a]">
                        <img src="https://i.imghippo.com/files/WXB3962h.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                </div>
                <div>
                    <h1 className="text-[16px] font-black text-white leading-[1.15] tracking-tight">
                        SMP BHINNEKA<br/>TUNGGAL IKA
                    </h1>
                    <p className="text-[15px] font-medium text-blue-200 mt-0.5">eBhinneka</p>
                </div>
            </div>

            {/* Time Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl px-3 py-2 shadow-sm border border-white/40 flex flex-col items-center justify-center min-w-[115px]">
                <div className="flex items-center gap-1.5 mb-1 text-slate-700">
                    <Calendar size={11} />
                    <p className="text-[9px] font-semibold whitespace-nowrap">{formatDateIndo(time)}</p>
                </div>
                <span className="text-[26px] font-black text-[#0c4a9a] font-sans tracking-tight leading-none mt-0 mb-1.5">{formatTimeIndo(time)}</span>
                <span className="bg-[#dcfce7] text-[#166534] text-[10px] font-bold px-4 py-0.5 rounded-full">WIB</span>
            </div>
        </div>

        {/* Mottos */}
        <div className="flex items-center justify-center mb-6 w-full">
            <div className="text-[9px] text-white/95 font-medium tracking-[0.2em] flex items-center gap-2 mt-1 uppercase justify-center text-center">
                <span className="relative">
                    BELAJAR
                    <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#fde047]"></span>
                </span>
                <span>•</span>
                <span>BERIMAN</span>
                <span>•</span>
                <span>BERTAKWA</span>
                <span>•</span>
                <span>BERPRESTASI</span>
            </div>
        </div>

        {loading ? (
            <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-slate-400 shadow-sm border border-white">
                <Loader2 className="animate-spin mb-3 text-blue-500" size={32} />
                <p className="text-xs font-bold">Memuat Data...</p>
            </div>
        ) : stats ? (
            <>
                {/* ACADEMIC YEAR PILL */}
                <div className="relative rounded-[18px] p-[2.5px] overflow-hidden shadow-sm mt-1">
                    <div className="absolute inset-[-300%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_60%,#fef08a_80%,#eab308_100%)] opacity-90"></div>
                    <div className="relative bg-white rounded-2xl px-5 py-4 flex items-center justify-between w-full h-full">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-blue-600">
                            <Calendar size={22} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[11px] text-slate-500 font-medium leading-tight">Tahun Ajaran</span>
                            <span className="text-[14px] font-black text-[#1e293b] leading-tight">{academicYear}</span>
                        </div>
                    </div>
                    <div className="w-[1px] h-10 bg-slate-200"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                        </div>
                        <div className="flex flex-col text-left mr-2">
                            <span className="text-[11px] text-slate-500 font-medium leading-tight">Semester:</span>
                            <span className="text-[14px] font-black text-[#1e293b] leading-tight capitalize">{semester}</span>
                        </div>
                    </div>
                    </div>
                </div>

                {/* 3 CLASS METRICS */}
                <div className="grid grid-cols-3 gap-2.5">
                    {[
                        { label: "KELAS 7", count: stats.count7, grade: "7", color: "#16a34a", accent: "#22c55e", lightBg: "bg-[#dcfce7]/60", gradient: "from-[#dcfce7]/30 to-white", topWave: "#bbf7d0", bottomWave: "#dcfce7" },
                        { label: "KELAS 8", count: stats.count8, grade: "8", color: "#ea580c", accent: "#f97316", lightBg: "bg-[#ffedd5]/60", gradient: "from-[#ffedd5]/30 to-white", topWave: "#fed7aa", bottomWave: "#ffedd5" },
                        { label: "KELAS 9", count: stats.count9, grade: "9", color: "#dc2626", accent: "#ef4444", lightBg: "bg-[#fee2e2]/60", gradient: "from-[#fee2e2]/30 to-white", topWave: "#fecaca", bottomWave: "#fee2e2" },
                    ].map((item) => (
                        <button
                            key={item.grade}
                            onClick={() => handleClassClick(item.grade)}
                            className={`bg-white rounded-[20px] flex flex-col shadow-sm border border-slate-100 overflow-hidden relative group hover:-translate-y-0.5 active:translate-y-0 transition-all h-[180px] bg-gradient-to-br ${item.gradient}`}
                        >
                            {/* Decorative Top Right Wave */}
                            <svg className="absolute top-0 right-0 w-full h-12 pointer-events-none opacity-40" viewBox="0 0 100 50" preserveAspectRatio="none">
                                <path fill={item.topWave} d="M100,0 L100,50 C80,30 50,40 30,10 C15,-5 0,0 0,0 Z" />
                            </svg>
                            {/* Decorative Bottom Left Wave */}
                            <svg className="absolute bottom-8 left-0 w-full h-16 pointer-events-none opacity-40" viewBox="0 0 100 50" preserveAspectRatio="none">
                                <path fill={item.bottomWave} d="M0,50 L0,0 C30,30 60,10 80,40 C90,55 100,50 100,50 Z" />
                            </svg>

                            <div className="w-full flex-1 flex flex-col items-center justify-center pt-3 relative z-10">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1" style={{ color: item.accent }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                </div>
                                <h2 className="text-[36px] font-black tracking-tighter leading-none" style={{ color: item.color }}>
                                    {item.count}
                                </h2>
                                <div className="w-[30px] h-[3px] rounded-full mt-1.5 mb-1.5" style={{ backgroundColor: item.color }}></div>
                                <p className="text-[12px] font-black text-slate-800 tracking-tight">
                                    {item.label}
                                </p>
                            </div>
                            <div className={`w-full ${item.lightBg} p-2.5 flex items-center justify-between mt-auto border-t border-white/50 relative z-10`}>
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-700 leading-[1.2] text-left ml-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: item.color }} className="flex-shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    <span>Peserta Didik<br/>Aktif</span>
                                </div>
                                <ChevronRight size={14} className="text-slate-500 mr-0.5" />
                            </div>
                        </button>
                    ))}
                </div>

                {/* MIDDLE ROW METRICS */}
                <div className="grid grid-cols-2 gap-3">
                    {/* KBM Card */}
                    <div className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[120px] relative group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-12 h-12 rounded-[14px] bg-[#e8f1fb] text-[#3b82f6] flex items-center justify-center border-2 border-[#bfdbfe]">
                                <BookOpen size={24} strokeWidth={2} />
                            </div>
                            <button onClick={() => navigate('/login')} className="w-6 h-6 rounded-full border border-blue-200 text-blue-500 flex items-center justify-center hover:bg-blue-50 transition-colors">
                                <ChevronRight size={14} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-[36px] font-black text-[#0c4a9a] leading-none tracking-tighter">{stats.completedJp}</span>
                            <span className="text-xs font-semibold text-slate-400">/ {stats.totalJpRequired} JP</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 mb-2 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-[#0c4a9a] tracking-wide mt-1">KBM TERLAKSANA</span>
                    </div>

                    {/* Absence Card */}
                    <div className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[120px] relative group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-12 h-12 rounded-[14px] bg-[#eef2ff] text-[#6366f1] flex items-center justify-center border-2 border-[#c7d2fe]">
                                <ClipboardList size={24} strokeWidth={2} />
                                <div className="absolute bottom-4 left-9 bg-white rounded-full">
                                    <User size={14} className="text-[#6366f1]" />
                                </div>
                            </div>
                            <button onClick={handleAbsenceClick} className="w-6 h-6 rounded-full border border-indigo-200 text-indigo-500 flex items-center justify-center hover:bg-indigo-50 transition-colors">
                                <ChevronRight size={14} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-[36px] font-black text-[#0c4a9a] leading-none tracking-tighter">{stats.absenceCount}</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#0c4a9a] tracking-wide mt-auto leading-tight">KETIDAKHADIRAN<br/>MURID</span>
                    </div>
                </div>

                {/* PROGRESS KBM SECTION */}
                <div className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 mt-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[12px] font-black text-[#0c4a9a] tracking-wide">PROGRESS KBM HARI INI</h3>
                        <div className="bg-[#e8f1fb] text-[#2563eb] px-2.5 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                            Tetap Semangat!
                        </div>
                    </div>
                    
                    <div className="w-full h-8 bg-[#f1f5f9] rounded-full overflow-hidden flex items-center p-1 shadow-inner mb-3 relative">
                        <div className="h-full bg-[#2563eb] rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.max(15, progressPercentage)}%` }}></div>
                    </div>
                    
                    <div className="flex justify-between items-end mt-2">
                        <p className="text-[22px] font-black text-[#0c4a9a] flex items-baseline gap-1.5">
                            {progressPercentage.toFixed(1)}% <span className="text-[13px] font-semibold text-slate-500">Terlaksana</span>
                        </p>
                        <div className="flex items-end gap-1.5 h-8">
                            <div className="w-3 bg-[#bfdbfe] rounded-t-sm h-[30%]"></div>
                            <div className="w-3 bg-[#93c5fd] rounded-t-sm h-[50%]"></div>
                            <div className="w-3 bg-[#60a5fa] rounded-t-sm h-[70%]"></div>
                            <div className="w-3 bg-[#3b82f6] rounded-t-sm h-[100%]"></div>
                        </div>
                    </div>
                </div>

                {/* LOGIN BUTTON */}
                <button 
                    onClick={() => setShowLoginModal(true)}
                    className="relative w-full mt-5 rounded-full p-[3px] overflow-hidden group active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)]"
                >
                    {/* Spinning glow effect */}
                    <div className="absolute inset-[-300%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_60%,#60a5fa_80%,#ffffff_100%)] opacity-100"></div>
                    
                    {/* Actual button surface */}
                    <div className="relative bg-gradient-to-r from-[#0c4a9a] to-[#1d4ed8] group-hover:from-[#0a3a7a] group-hover:to-[#153a99] text-white p-4 rounded-full flex items-center justify-between transition-all w-full h-full">
                    <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors ml-2">
                        <ArrowRight size={18} strokeWidth={2} />
                    </div>
                    <span className="text-[16px] font-bold tracking-wide">Login Sebagai</span>
                        <ChevronRight size={22} className="text-white mr-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
            </>
        ) : null}

        {/* Footer Text */}
        <div className="w-full mt-10 flex flex-col items-center">
            <p className="text-[#0c4a9a] text-[15px]" style={{ fontFamily: '"Brush Script MT", "Cedarville Cursive", cursive' }}>
                Pendidikan Melangkah Lebih Baik Setiap Hari
            </p>
            <div className="w-16 h-[2px] bg-[#facc15] mt-2 rounded-full"></div>
        </div>
      </main>

      {/* MODALS */}
      {/* Detail Modal */}
      {modalOpen && modalContent && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
           <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-100 flex flex-col max-h-[85vh] animate-slide-up sm:animate-fade-in">
               <div className="p-5 flex justify-between items-center border-b border-slate-100">
                   <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                       {modalContent.type === 'class' ? <School className="text-blue-500" /> : <ClipboardList className="text-orange-500" />}
                       {modalContent.title}
                   </h3>
                   <button onClick={() => setModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-full transition-colors">
                       <X size={20} />
                   </button>
               </div>
               <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
                   {modalContent.type === 'class' ? (
                       <div className="space-y-3">
                           {(modalContent.data as [string, number][]).map(([cls, count]) => {
                               const isFilled = stats?.filledClasses?.includes(cls);
                               const teacherName = isFilled ? 'Sedang KBM' : 'Belum ada guru';
                               return (
                                   <div key={cls} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 bg-slate-50">
                                       <div>
                                           <span className="font-bold text-slate-700">{cls}</span>
                                           <p className="text-xs text-slate-500 mt-0.5">{teacherName}</p>
                                       </div>
                                       <div className="flex items-center gap-3">
                                           <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isFilled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                               {isFilled ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                               {isFilled ? 'Terisi' : 'Kosong'}
                                           </div>
                                           <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-lg">{String(count)} Murid</span>
                                       </div>
                                   </div>
                               );
                           })}
                       </div>
                   ) : (
                       <div className="space-y-4">
                           <div className="grid grid-cols-3 gap-2">
                               <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                                   <p className="text-xs font-bold text-red-500 mb-1">ALFA (A)</p>
                                   <p className="text-xl font-black text-red-700">{modalContent.data.absenceDetails.A}</p>
                               </div>
                               <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                                   <p className="text-xs font-bold text-amber-500 mb-1">IZIN (I)</p>
                                   <p className="text-xl font-black text-amber-700">{modalContent.data.absenceDetails.I}</p>
                               </div>
                               <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                                   <p className="text-xs font-bold text-blue-500 mb-1">SAKIT (S)</p>
                                   <p className="text-xl font-black text-blue-700">{modalContent.data.absenceDetails.S}</p>
                               </div>
                           </div>
                           <div className="mt-4">
                               <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center justify-between">
                                   Daftar per Kelas
                                   <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                        Total: {String(Object.values(modalContent.data.absencePerClass).reduce((a, b) => (a as number) + (b as number), 0))} Murid
                                   </span>
                               </h4>
                               <div className="space-y-2">
                                   {Object.entries(modalContent.data.absencePerClass).sort(([a], [b]) => a.localeCompare(b)).map(([cls, count]) => (
                                       <div key={cls} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                                           <button 
                                               onClick={() => setExpandedClass(expandedClass === cls ? null : cls)}
                                               className="w-full flex justify-between items-center p-3 hover:bg-slate-50 transition-colors"
                                           >
                                               <span className="font-bold text-slate-700">Kelas {cls}</span>
                                               <div className="flex items-center gap-3">
                                                   <span className="text-sm font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-lg">{String(count)} Murid</span>
                                                   <ChevronDown size={18} className={`text-slate-400 transition-transform ${expandedClass === cls ? 'rotate-180' : ''}`} />
                                               </div>
                                           </button>
                                           {expandedClass === cls && (
                                               <div className="bg-slate-50 p-3 border-t border-slate-100 divide-y divide-slate-100">
                                                   {getAbsentStudentsForClass(cls).map((student: any, i: number) => (
                                                       <div key={i} className="py-2 flex justify-between items-center first:pt-0 last:pb-0">
                                                           <span className="text-sm text-slate-600">{student.name}</span>
                                                           <span className={`text-xs font-bold px-2 py-1 rounded-md ${student.status === 'S' ? 'bg-blue-100 text-blue-700' : student.status === 'I' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                               {student.status === 'S' ? 'Sakit' : student.status === 'I' ? 'Izin' : 'Alfa'}
                                                           </span>
                                                       </div>
                                                   ))}
                                               </div>
                                           )}
                                       </div>
                                   ))}
                                   {Object.keys(modalContent.data.absencePerClass).length === 0 && (
                                       <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                                           <p className="text-sm text-slate-500 font-medium">Semua murid hadir hari ini! 🎉</p>
                                       </div>
                                   )}
                               </div>
                           </div>
                       </div>
                   )}
               </div>
           </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0c4a9a]/70 backdrop-blur-md animate-fade-in">
           <div className="relative w-full max-w-sm">
               {loginViewMode === 'selection' ? (
                  <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 overflow-hidden relative animate-fade-in p-6">
                      <div className="flex justify-between items-start mb-6">
                          <div>
                              <h2 className="text-xl font-black text-white leading-tight">Pilih Akses<br/>Login</h2>
                              <p className="text-xs text-white/80 font-medium mt-1">Masuk menggunakan peran Anda.</p>
                          </div>
                          <button onClick={() => setShowLoginModal(false)} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors backdrop-blur-sm border border-white/10">
                              <X size={20} />
                          </button>
                      </div>
                      
                      <button 
                        onClick={() => handleRoleSelect('guru')}
                        className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group mb-4"
                      >
                          <div className="w-16 h-16 rounded-full bg-white/20 text-white shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <GraduationCap size={32} />
                          </div>
                          <div className="text-left">
                              <h3 className="text-lg font-extrabold text-white">Guru / Pegawai</h3>
                              <p className="text-xs text-white/80 font-medium">Akses jurnal KBM & presensi.</p>
                          </div>
                          <div className="ml-auto text-white/50 group-hover:text-white transition-colors">
                              <ArrowRight size={24} />
                          </div>
                      </button>

                      <button 
                        onClick={() => handleRoleSelect('operator')}
                        className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group mb-4"
                      >
                          <div className="w-16 h-16 rounded-full bg-white/20 text-white shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <MonitorPlay size={32} />
                          </div>
                          <div className="text-left">
                              <h3 className="text-lg font-extrabold text-white">Operator Piket</h3>
                              <p className="text-xs text-white/80 font-medium">Akses panel piket real-time.</p>
                          </div>
                          <div className="ml-auto text-white/50 group-hover:text-white transition-colors">
                              <ArrowRight size={24} />
                          </div>
                      </button>

                      <button 
                        onClick={() => handleRoleSelect('admin')}
                        className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"
                      >
                          <div className="w-16 h-16 rounded-full bg-white/20 text-white shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <Shield size={32} />
                          </div>
                          <div className="text-left">
                              <h3 className="text-lg font-extrabold text-white">Administrator</h3>
                              <p className="text-xs text-white/80 font-medium">Pengaturan sistem & data.</p>
                          </div>
                          <div className="ml-auto text-white/50 group-hover:text-white transition-colors">
                              <ArrowRight size={24} />
                          </div>
                      </button>
                  </div>
               ) : (
                  <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden relative animate-fade-in transition-colors">
                      <div className="p-8">
                          <div className="flex justify-between items-start mb-6">
                              <button 
                                onClick={() => setLoginViewMode('selection')}
                                className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-full transition-colors -ml-2"
                                title="Kembali"
                              >
                                  <ChevronLeft size={24} />
                              </button>
                              <button onClick={() => setShowLoginModal(false)} className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors -mr-2"><X size={24}/></button>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center gap-1 mb-6 -mt-4">
                              <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-3">
                                  <ShieldCheck size={32} />
                              </div>
                              <h2 className="text-xl font-black text-slate-800">Login {selectedRoleLabel}</h2>
                              <p className="text-sm text-slate-500 font-medium">Silakan masukkan kredensial Anda.</p>
                          </div>

                          <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">User ID (NIPY)</label>
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
                                  className="pl-11 block w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3.5 text-slate-800 text-sm font-bold transition-all placeholder:text-slate-400 placeholder:font-normal"
                                  placeholder="Contoh: 19870101..."
                                  required
                                  autoFocus
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
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
                                  className="pl-11 pr-12 block w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3.5 text-slate-800 text-sm font-bold transition-all placeholder:text-slate-400 placeholder:font-normal"
                                  placeholder="Masukkan Password"
                                  required
                                />
                                <button
                                     type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer z-10"
                                    tabIndex={-1}
                                    title={showPassword ? "Sembunyikan" : "Lihat Password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                              </div>
                            </div>

                            {loginError && (
                              <div className="flex items-center gap-3 text-red-600 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">
                                <AlertCircle size={18} className="flex-shrink-0" />
                                <span>{loginError}</span>
                              </div>
                            )}

                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full bg-[#0c4a9a] hover:bg-[#1d4ed8] text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg mt-6 active:scale-95"
                            >
                              {isSubmitting ? 'Memproses...' : (
                                <>
                                  Masuk Aplikasi <ArrowRight size={18} />
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
                <CheckCircle2 size={120} className="text-[#22c55e] animate-pulse drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
            </div>
        </div>
      )}
    </div>
  );
};
export default PublicDashboard;
