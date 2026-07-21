
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User, ArrowRight, AlertCircle, ShieldCheck, GraduationCap, MonitorPlay, Shield, ChevronLeft, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [viewMode, setViewMode] = useState<'selection' | 'form'>('selection');
  const [selectedRoleLabel, setSelectedRoleLabel] = useState('');
  
  const [userId, setUserId] = useState(() => localStorage.getItem('saved_nip') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, academicYear, semester } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'guru' | 'operator' | 'admin') => {
      if (role === 'operator') {
          navigate('/operator-dashboard');
      } else {
          setSelectedRoleLabel(role === 'admin' ? 'Administrator' : 'Guru / Staf');
          setViewMode('form');
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { error } = await signIn(userId, password);
      
      if (error) {
        if (error.message === 'Failed to fetch') {
           setError('Gagal terhubung ke Database.');
        } else if (error.message.includes('Invalid login')) {
           setError('NIPY atau Password salah.');
        } else {
           setError(error.message);
        }
      } else {
        localStorage.setItem('saved_nip', userId);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-transparent transition-colors duration-300"> 
      <div className="text-center mb-8">
           <img 
             src="https://www.smpbhinnekatunggalika.sch.id/upload/imagecache/24871901smp-100x100.png" 
             alt="Logo Sekolah" 
             className="h-24 w-auto mx-auto mb-4 drop-shadow-sm" 
           />
           <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 tracking-tight uppercase leading-tight">
             SMP BHINNEKA TUNGGAL IKA
           </h1>
           <p className="text-blue-100 font-medium text-sm mt-1">
             eBhinneka
           </p>
      </div>

      {viewMode === 'selection' ? (
          <div className="w-full max-w-lg grid gap-4 animate-fade-in">
              
              <div className="flex justify-center mb-6">
                  <div className="bg-slate-100/10 backdrop-blur-md border border-slate-100/20 px-6 py-2 rounded-full shadow-sm text-sm font-bold text-slate-100">
                      Tahun Ajaran: {academicYear} | Semester: {semester}
                  </div>
              </div>
              <p className="text-center text-blue-100 font-bold text-sm mb-2 uppercase tracking-widest">Masuk Sebagai</p>

              
              <button 
                onClick={() => handleRoleSelect('guru')}
                className="bg-slate-100 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-700 border-2 border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500/50 p-5 rounded-2xl shadow-sm hover:shadow-md flex items-center gap-5 transition-all group"
              >
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <GraduationCap size={32} />
                  </div>
                  <div className="text-left">
                      <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400">Guru / Tenaga Pendidik</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Masuk untuk mengisi jurnal & absensi.</p>
                  </div>
                  <div className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-blue-400">
                      <ArrowRight size={24} />
                  </div>
              </button>

              <button 
                onClick={() => handleRoleSelect('operator')}
                className="bg-slate-100 dark:bg-slate-900 hover:bg-sky-100 dark:hover:bg-slate-700 border-2 border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600/50 p-5 rounded-2xl shadow-sm hover:shadow-md flex items-center gap-5 transition-all group"
              >
                  <div className="w-16 h-16 rounded-full bg-blue-300 dark:bg-slate-900/50 text-blue-600 dark:text-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MonitorPlay size={32} />
                  </div>
                  <div className="text-left">
                      <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-500">Operator Monitor</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Dashboard monitoring jadwal real-time.</p>
                  </div>
                  <div className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-blue-500">
                      <ArrowRight size={24} />
                  </div>
              </button>

              <button 
                onClick={() => handleRoleSelect('admin')}
                className="bg-slate-100 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 p-5 rounded-2xl shadow-sm hover:shadow-md flex items-center gap-5 transition-all group"
              >
                  <div className="w-16 h-16 rounded-full bg-slate-900 dark:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Shield size={32} />
                  </div>
                  <div className="text-left">
                      <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Administrator</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Pengaturan sistem dan data master.</p>
                  </div>
                  <div className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-slate-800 dark:group-hover:text-slate-800 dark:text-slate-100">
                      <ArrowRight size={24} />
                  </div>
              </button>
          </div>
      ) : (
          <main className="w-full max-w-sm app-card rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative animate-fade-in transition-colors">
            
            <div className="p-8">
              <button 
                onClick={() => setViewMode('selection')}
                className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-full transition-colors"
                title="Kembali"
              >
                  <ChevronLeft size={24} />
              </button>

              <div className="flex flex-col items-center justify-center gap-1 mb-6 mt-2">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full mb-2">
                      <ShieldCheck size={28} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Login {selectedRoleLabel}</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Silakan masukkan kredensial Anda.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">User ID (NIPY)</label>
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
                      className="pl-12 block w-full bg-slate-100  border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3.5 text-slate-800 dark:text-slate-100 text-sm font-bold transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 placeholder:font-normal"
                      placeholder="Contoh: 19870101..."
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Password</label>
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
                      className="pl-12 pr-12 block w-full bg-slate-100  border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3.5 text-slate-800 dark:text-slate-100 text-sm font-bold transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 placeholder:font-normal"
                      placeholder="Masukkan Password"
                      required
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 transition-colors cursor-pointer z-10"
                        tabIndex={-1}
                        title={showPassword ? "Sembunyikan" : "Lihat Password"}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-3 text-blue-600 dark:text-blue-500 text-xs font-bold bg-sky-100 dark:bg-blue-600/20 p-3 rounded-xl border border-blue-300 dark:border-blue-600/50">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-600 text-slate-100 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/30 mt-4 active:translate-y-0.5"
                >
                  {isSubmitting ? 'Memproses...' : (
                    <>
                      Masuk Aplikasi <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </main>
      )}

      <div className="mt-8 text-center text-blue-200/60 text-xs font-medium">
          &copy; Tim IT SMP Bhinneka Tunggal Ika
      </div>
    </div>
  );
};

export default Login;
