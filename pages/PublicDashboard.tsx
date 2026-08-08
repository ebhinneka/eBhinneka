
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { PublicStats } from '../types';
import { Bell,  LogIn, Loader2, BookOpen, AlertCircle, X, School, ChevronDown, ChevronRight, Bookmark, Lock, User, ArrowRight, ShieldCheck, GraduationCap, MonitorPlay, Shield, ChevronLeft, Eye, EyeOff, Calendar, CheckCircle2, ClipboardList  } from 'lucide-react';
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
          let statsData: any = {
              count7: 0, count8: 0, count9: 0,
              absenceCount: 0, completedJp: 0, totalJpRequired: 360
          };
          
          if (!isSupabaseConfigured) {
              setStats(statsData);
              return;
          }

                    let allStudents: any[] = [];
          let hasMore = true;
          let page = 0;
          const pageSize = 1000;
          while (hasMore) {
              const { data, error } = await supabase
                  .from('students')
                  .select('id, kelas, name').eq('academic_year', academicYear || '2025/2026')
                  .range(page * pageSize, (page + 1) * pageSize - 1);
              
              if (error) {
                  console.error(error);
                  break;
              }
              if (data) {
                  allStudents = [...allStudents, ...data];
                  if (data.length < pageSize) {
                      hasMore = false;
                  } else {
                      page++;
                  }
              } else {
                  hasMore = false;
              }
          }

          if (allStudents.length > 0) {
              statsData.count7 = allStudents.filter((s: any) => s.kelas?.startsWith('7')).length;
              statsData.count8 = allStudents.filter((s: any) => s.kelas?.startsWith('8')).length;
              statsData.count9 = allStudents.filter((s: any) => s.kelas?.startsWith('9')).length;
              
              const cMap: Record<string, string> = {};
              const nMap: Record<string, string> = {};
              allStudents.forEach((s: any) => { cMap[s.id] = s.kelas || ''; nMap[s.id] = s.name || ''; });
              setStudentClassMap(cMap);
              setStudentNameMap(nMap);
          }


          const { data: homeroom } = await supabase.from('homeroom_attendance').select('*').eq('date', date);
          const { data: attendance } = await supabase.from('attendance_logs').select('*').eq('date', date);
          
          let absentStudents: any[] = [];
          if (homeroom) {
              homeroom.forEach((h: any) => {
                  if (h.absent_students) {
                      Object.keys(h.absent_students).forEach((studentId: string) => {
                          absentStudents.push({ id: studentId, status: h.absent_students[studentId], source: 'Wali', kelas: h.kelas });
                      });
                  }
              });
          }
          if (attendance) {
              attendance.forEach((a: any) => {
                  if (a.status !== 'H') {
                      absentStudents.push({ id: a.student_id, status: a.status, source: 'Guru', kelas: a.kelas });
                  }
              });
          }
          setRawAttendance(absentStudents);
          statsData.absenceCount = absentStudents.length;

          const { data: journals } = await supabase.from('journals').select('hours, kelas').eq('date', date);
          if (journals) {
              let completedJp = 0;
              journals.forEach((j: any) => {
                  if (j.kelas !== 'STAFF' && typeof j.hours === 'string') {
                      completedJp += j.hours.split(',').filter((h: string) => h.trim().length > 0).length;
                  }
              });
              statsData.completedJp = completedJp;
          }

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
      setModalContent({ title: `Siswa Kelas ${grade}`, type: 'class', data: Object.entries(clsCounts).sort() });
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

      setModalContent({ title: 'Ketidakhadiran Murid Hari Ini', type: 'absence', data: { absenceDetails, classDetails, absencePerClass, filledClasses: [] } });
      setModalOpen(true);
  };

  const getAbsentStudentsForClass = (cls: string) => {
      return rawAttendance.filter((a: any) => (a.kelas === cls || studentClassMap[a.id] === cls)).map((a: any) => ({ ...a, name: studentNameMap[a.id] || 'Unknown' }));
  };

  const handleRoleSelect = (role: string) => {
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
              else if (selectedRoleLabel === 'Admin') navigate('/admin');
              else navigate('/operator');
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
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-3 sm:p-5 font-sans bg-[#f1f5f9] dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
      <main className="w-full max-w-[420px] space-y-4 m-auto relative z-10">
        
        {/* TOP HEADER CARD */}
        <div className="rounded-[28px] bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgba(37,99,235,0.06)] relative overflow-hidden flex items-center px-4 py-4 min-h-[130px] border border-white">
             {/* Left side soft blue gradient */}
             <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#3b82f6]/90 via-[#60a5fa]/40 to-transparent pointer-events-none"></div>
             
             {/* Logo */}
             <div className="w-[72px] h-[72px] rounded-full p-[2px] bg-gradient-to-br from-white/80 to-white/20 shadow-md flex-shrink-0 flex items-center justify-center relative z-10 border border-white/50 ml-1">
                <div className="w-full h-full bg-white rounded-full p-1.5 border-[2px] border-white flex items-center justify-center overflow-hidden">
                    <img src="https://i.imghippo.com/files/WXB3962h.png" alt="Logo" className="w-[85%] h-[85%] object-contain" />
                </div>
             </div>
             
             {/* Title */}
             <div className="flex-1 flex flex-col justify-center ml-3 relative z-10 text-left">
                 <h1 className="text-[17px] font-black text-[#0f172a] leading-[1.1] tracking-tight">
                   SMP BHINNEKA<br/>TUNGGAL IKA
                 </h1>
                 <p className="text-[14px] font-semibold text-[#2563eb] mt-0.5">eBhinneka</p>
             </div>
             
             {/* Time Card */}
             <div className="bg-white/90 backdrop-blur-md rounded-[16px] px-3 py-2 shadow-sm border border-slate-100 flex flex-col items-center justify-center min-w-[95px] flex-shrink-0 relative z-10">
                 <p className="text-[9px] font-bold text-slate-600 mb-0.5 whitespace-nowrap">{formatDateIndo(time)}</p>
                 <div className="flex flex-col items-center">
                     <span className="text-[28px] font-black text-[#2563eb] font-sans tracking-tighter leading-none">{formatTimeIndo(time)}</span>
                     <span className="bg-[#eef3fa] text-[#2563eb] text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">WIB</span>
                 </div>
             </div>
        </div>

        {loading ? (
            <div className="bg-white/80 rounded-[24px] p-10 flex flex-col items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                <Loader2 className="animate-spin mb-3 text-blue-500" size={32} />
                <p className="text-xs font-bold">Memuat Data...</p>
            </div>
         ) : stats ? (
          <>
            {/* ACADEMIC YEAR PILL */}
            <div className="bg-white/80 backdrop-blur-sm rounded-[16px] px-5 py-3 shadow-[0_4px_20px_rgba(37,99,235,0.04)] border border-white flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#3b82f6]" />
                    <span>Tahun Ajaran: {academicYear}</span>
                </div>
                <div className="h-4 w-[1px] bg-slate-200"></div>
                <div className="flex items-center gap-2">
                    <span>Semester: {semester}</span>
                    <BookOpen size={16} className="text-[#3b82f6]" />
                </div>
            </div>

            {/* TOP 3 CLASS METRIC CARDS */}
            <div className="grid grid-cols-3 gap-3">
               {[
                 { label: "KELAS 7", count: stats.count7, grade: "7", color: "#22c55e" },
                 { label: "KELAS 8", count: stats.count8, grade: "8", color: "#f97316" },
                 { label: "KELAS 9", count: stats.count9, grade: "9", color: "#ef4444" },
               ].map((item) => (
                  <button 
                     key={item.grade}
                     onClick={() => handleClassClick(item.grade)}
                     className="bg-white/90 backdrop-blur-sm rounded-[24px] pt-4 pb-4 flex flex-col items-center shadow-[0_4px_15px_rgba(37,99,235,0.05)] border border-white overflow-hidden relative group hover:-translate-y-0.5 active:translate-y-0 transition-all h-[155px]"
                  >
                      {/* Icon Circle */}
                      <div className="w-[46px] h-[46px] rounded-full border border-slate-100 shadow-sm flex items-center justify-center mb-2 bg-white group-hover:scale-105 transition-transform" style={{ color: item.color }}>
                          <School size={22} strokeWidth={2} />
                      </div>
                      
                      <h2 className="text-[40px] font-black tracking-tighter leading-none mb-1" style={{ color: item.color }}>
                        {item.count}
                      </h2>
                      
                      {/* Dash */}
                      <div className="w-[18px] h-[3px] rounded-full mb-1.5 opacity-80" style={{ backgroundColor: item.color }}></div>
                      
                      <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                        {item.label}
                      </p>
                      
                      {/* Bottom right dots */}
                      <div className="absolute -bottom-2 -right-2 opacity-20 pointer-events-none" style={{ color: item.color }}>
                          <div className="w-12 h-12 bg-[radial-gradient(currentColor_2px,transparent_2px)] [background-size:6px_6px]"></div>
                      </div>
                  </button>
               ))}
            </div>

            {/* MIDDLE 2 METRIC CARDS */}
            <div className="grid grid-cols-2 gap-3">
                {/* KBM TERLAKSANA */}
                <div className="bg-white/90 backdrop-blur-sm rounded-[24px] p-4 shadow-[0_4px_15px_rgba(37,99,235,0.05)] border border-white flex items-center relative overflow-hidden h-[110px]">
                     <div className="w-[45%] flex justify-center items-center relative">
                         {/* Book 3D-like icon representation */}
                         <div className="relative transform group-hover:scale-105 transition-transform">
                            <BookOpen size={50} strokeWidth={1.5} className="text-[#3b82f6] drop-shadow-md" />
                            <div className="absolute -bottom-1 -right-1 w-[26px] h-[26px] bg-[#2563eb] rounded-full border-[3px] border-white flex items-center justify-center text-white shadow-sm">
                                <CheckCircle2 size={16} strokeWidth={3} />
                            </div>
                         </div>
                     </div>
                     <div className="w-[55%] flex flex-col justify-center pl-1">
                         <div className="flex items-baseline gap-1">
                             <span className="text-[34px] font-black text-[#2563eb] leading-none tracking-tighter">{stats.completedJp}</span>
                         </div>
                         <span className="text-[10px] font-semibold text-slate-500 mb-1">/ {stats.totalJpRequired} JP</span>
                         <div className="w-[18px] h-[3px] rounded-full bg-[#2563eb] mb-1.5 opacity-80"></div>
                         <p className="text-[9px] font-bold text-slate-700 leading-[1.2] uppercase tracking-wider">KBM TERLAKSANA</p>
                     </div>
                </div>
                
                {/* KETIDAKHADIRAN MURID */}
                <button onClick={handleAbsenceClick} className="bg-white/90 backdrop-blur-sm rounded-[24px] p-4 shadow-[0_4px_15px_rgba(37,99,235,0.05)] border border-white flex items-center relative overflow-hidden h-[110px] hover:-translate-y-0.5 active:translate-y-0 transition-all text-left group">
                     <div className="w-[45%] flex justify-center items-center relative">
                         <div className="relative transform group-hover:scale-105 transition-transform">
                             <ClipboardList size={50} strokeWidth={1.5} className="text-[#3b82f6] drop-shadow-md" />
                             <div className="absolute -bottom-1 -right-1 w-[26px] h-[26px] bg-[#2563eb] rounded-full border-[3px] border-white flex items-center justify-center text-white shadow-sm font-black text-[14px]">!</div>
                         </div>
                     </div>
                     <div className="w-[55%] flex flex-col justify-center pl-1">
                         <span className="text-[34px] font-black text-[#2563eb] leading-none tracking-tighter block">{stats.absenceCount}</span>
                         <div className="w-[18px] h-[3px] rounded-full bg-[#2563eb] mb-1.5 mt-[18px] opacity-80"></div>
                         <p className="text-[9px] font-bold text-slate-700 leading-[1.2] uppercase tracking-wider">KETIDAKHADIRAN<br/>MURID</p>
                     </div>
                </button>
            </div>

            {/* PROGRESS BAR CARD */}
            <div className="bg-white/90 backdrop-blur-sm rounded-[24px] p-4 pb-5 shadow-[0_4px_15px_rgba(37,99,235,0.05)] border border-white relative overflow-hidden flex flex-col justify-center">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-[11px] font-bold text-slate-800 tracking-wider">
                      PROGRESS KBM HARI INI
                    </h3>
                </div>
                
                <div className="flex flex-col gap-1.5 w-full pr-12 relative">
                    <div className="w-full bg-[#eef2ff] rounded-full h-[24px] shadow-inner relative overflow-hidden">
                        {/* The Bar */}
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] rounded-full transition-all duration-700 flex items-center justify-end pr-3"
                          style={{ width: `${Math.max(progressPercentage, 15)}%` }}
                        >
                           {progressPercentage > 15 && <span className="text-white text-[10px] font-bold">{progressPercentage.toFixed(1)}%</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-[#2563eb] text-[12px] font-black">{progressPercentage.toFixed(1)}%</span>
                        <span className="text-[12px] font-medium text-slate-600">Terlaksana</span>
                    </div>

                    {/* Chart icon on the right absolute */}
                    <div className="absolute right-0 bottom-0 flex items-end gap-[4px] text-[#93c5fd]">
                         <div className="w-[8px] h-[12px] bg-current rounded-sm"></div>
                         <div className="w-[8px] h-[20px] bg-current rounded-sm"></div>
                         <div className="w-[8px] h-[28px] bg-current rounded-sm"></div>
                         <div className="w-[8px] h-[36px] bg-current rounded-sm text-[#60a5fa]"></div>
                     </div>
                </div>
            </div>

            {/* LOGIN BUTTON with Glowing Border Animation */}
            <div className="pt-2">
                <div className="relative group rounded-full p-[2px] overflow-hidden bg-[#1e3a8a] shadow-[0_8px_20px_rgba(37,99,235,0.3)]">
                    {/* Animated gradient border (the light glare) */}
                    <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] animate-[spin_2s_linear_infinite] opacity-100"></div>
                    <div className="absolute inset-[-100%] bg-[conic-gradient(from_180deg,transparent_0_340deg,white_360deg)] animate-[spin_2s_linear_infinite] opacity-100"></div>
                    
                    <button 
                        onClick={() => setShowLoginModal(true)} 
                        className="relative w-full bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:brightness-110 text-white font-bold text-[15px] py-4 rounded-full flex items-center justify-center gap-2 transition-all active:scale-[0.98] z-10"
                    >
                        <div className="w-6 h-6 rounded-full border-[1.5px] border-white/80 flex items-center justify-center">
                            <ArrowRight size={14} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="tracking-wide">Login Sebagai</span>
                    </button>
                </div>
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
                                                                    <span className={absentCount > 0 ? "text-rose-600 dark:text-rose-400" : "text-blue-600 dark:text-blue-400"}>
                                                                        {absentCount} Tidak Hadir
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="text-slate-400 dark:text-slate-500">{presentCount} Hadir</span>
                                                                    <span className="text-slate-300 dark:text-slate-600">|</span>
                                                                    <span className="text-slate-400 dark:text-slate-500">
                                                                        {absentCount} Tidak Hadir
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
