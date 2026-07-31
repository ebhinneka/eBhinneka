
import React, { useEffect, useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { supabase } from '../services/supabase';
import { createClient } from '@supabase/supabase-js'; 
import { Profile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, Plus, AlertCircle, Search, UserCog, GraduationCap, Shield, Edit, Save, X, Loader2, ChevronDown, Check, UserPlus, KeyRound, Eye, EyeOff, Lock, User, RefreshCw } from 'lucide-react';

const PasswordCell = ({ password }: { password?: string }) => {
  const [show, setShow] = useState(false);
  
  if (!password) return <span className="text-slate-400 italic text-[10px] bg-gray-50 px-2 py-1 rounded border border-slate-100">Terenkripsi</span>;
  
  return (
    <div className="flex items-center gap-2 bg-sky-100 px-2 py-1.5 rounded-lg border border-blue-300 w-fit">
      <span className="font-mono text-xs font-bold text-slate-700 min-w-[70px]">
          {show ? password : '••••••••'}
      </span>
      <button 
        onClick={() => setShow(!show)} 
        className="text-blue-500 hover:text-blue-500 transition-colors p-0.5"
        title={show ? "Sembunyikan" : "Lihat Password"}
      >
        {show ? <EyeOff size={14}/> : <Eye size={14}/>}
      </button>
    </div>
  );
};

const UsersData: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [subjectsList, setSubjectsList] = useState<string[]>([]);

  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editFormData, setEditFormData] = useState({
    mengajar_mapel: '',
    wali_kelas: '',
    jabatan_tambahan: '-'
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
      nip: '',
      fullName: '',
      password: 'bti', 
      role: 'user',
      mapel: '',
      waliKelas: ''
  });

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetData, setResetData] = useState({
      userId: '',
      userName: '',
      newPassword: ''
  });

  const [serviceKey, setServiceKey] = useState(() => localStorage.getItem('supabaseServiceKey') || '');
  useEffect(() => { if(serviceKey) localStorage.setItem('supabaseServiceKey', serviceKey); }, [serviceKey]);
  const [showServiceKey, setShowServiceKey] = useState(false);

  const [saving, setSaving] = useState(false);

  const [isMapelDropdownOpen, setIsMapelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsMapelDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profilesRes, settingsRes] = await Promise.all([
          supabase.from('profiles').select('*').order('full_name', { ascending: true }),
          supabase.from('app_settings').select('value').eq('key', 'subjects_list').single()
      ]);
      if (profilesRes.data) setProfiles(profilesRes.data);
      if (settingsRes.data?.value) {
          try { 
            let parsed = JSON.parse(settingsRes.data.value);
            
            setSubjectsList(parsed); 
        } catch(e) { console.error("Parse subjects error", e); }
      }
    } catch (err: any) { alert('Gagal mengambil data user: ' + err.message); } finally { setLoading(false); }
  };

  const handleEditClick = (user: Profile) => {
    setEditingUser(user);
    setEditFormData({ mengajar_mapel: user.mengajar_mapel || '', wali_kelas: user.wali_kelas || '', jabatan_tambahan: user.jabatan_tambahan || '-' });
    setIsMapelDropdownOpen(false);
  };

  const handleOpenReset = (user: Profile) => {
      setResetData({ userId: user.id, userName: user.full_name, newPassword: '' });
      setResetModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      let finalMapel = editFormData.mengajar_mapel;
      const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()).filter(m => m !== '') : [];
      finalMapel = mapels.join(', ');
      const payload = {
          mengajar_mapel: finalMapel,
          wali_kelas: editFormData.wali_kelas,
          jabatan_tambahan: editFormData.jabatan_tambahan === '-' ? undefined : editFormData.jabatan_tambahan
      };
      
      const { error: profileError } = await supabase.from('profiles').update(payload).eq('id', editingUser.id);
      if (profileError) throw profileError;

      if (editingUser.nip) {
         await supabase.from('tabel_guru').update({ mapel: finalMapel, wali_kelas: editFormData.wali_kelas }).eq('nip', editingUser.nip);
      }

      setProfiles(prev => prev.map(p => p.id === editingUser.id ? { ...p, mengajar_mapel: finalMapel, wali_kelas: editFormData.wali_kelas, jabatan_tambahan: editFormData.jabatan_tambahan === '-' ? undefined : editFormData.jabatan_tambahan } : p));
      setEditingUser(null);
    } catch (err: any) { alert('Gagal menyimpan data: ' + err.message); } finally { setSaving(false); }
  };

  const handleCreateUser = async () => {
      if (!newUser.nip || !newUser.fullName || !newUser.password) { alert("NIPY, Nama Lengkap, dan Password wajib diisi."); return; }
      if (!serviceKey) { alert("Service Role Key wajib diisi untuk membuat akun Login."); return; }
      setSaving(true);
      try {
          let finalMapelNew = newUser.mapel;
          
          const mapelsNew = finalMapelNew ? finalMapelNew.split(',').map(m => m.trim()).filter(m => m !== '') : [];
          finalMapelNew = mapelsNew.join(', ');

          const SUPABASE_URL = 'https://nuxpvdmhclxftbgytrsq.supabase.co'; 
          const adminClient = createClient(SUPABASE_URL, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
          const email = `${newUser.nip}@sekolah.id`;
          const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
              email: email,
              password: newUser.password,
              email_confirm: true,
              user_metadata: { full_name: newUser.fullName }
          });
          if (authError) throw new Error("Gagal membuat Auth User: " + authError.message);
          if (!authData.user) throw new Error("Gagal mendapatkan data user baru.");
          const userId = authData.user.id;
          const { error: profileError } = await adminClient.from('profiles').upsert({
              id: userId, nip: newUser.nip, full_name: newUser.fullName, role: newUser.role,
              mengajar_mapel: finalMapelNew, wali_kelas: newUser.waliKelas, password_info: newUser.password
          });
          if (profileError) throw new Error("Gagal menyimpan Profile: " + profileError.message);
          
          await supabase.from('tabel_guru').upsert({ nip: newUser.nip, nama_lengkap: newUser.fullName, mapel: finalMapelNew, wali_kelas: newUser.waliKelas });
          alert("User berhasil ditambahkan!");
          setIsAddModalOpen(false);
          setNewUser({ nip: '', fullName: '', role: 'user', mapel: '', waliKelas: '', password: 'bti' });
          fetchData();
      } catch (err: any) { alert('Gagal: ' + err.message); } finally { setSaving(false); }
  };

  const handleResetPasswordAction = async () => {
      if(!resetData.newPassword || !serviceKey) { alert("Password baru dan Service Key wajib diisi."); return; }
      setSaving(true);
      try {
          const SUPABASE_URL = 'https://nuxpvdmhclxftbgytrsq.supabase.co'; 
          const adminClient = createClient(SUPABASE_URL, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

          const { error: authError } = await adminClient.auth.admin.updateUserById(resetData.userId, { password: resetData.newPassword });
          if (authError) throw new Error("Gagal update Auth: " + authError.message);

          const { error: profileError } = await supabase.from('profiles').update({ password_info: resetData.newPassword }).eq('id', resetData.userId);
          if (profileError) throw new Error("Gagal update Profile: " + profileError.message);

          alert("Password berhasil direset!");
          setProfiles(prev => prev.map(p => p.id === resetData.userId ? { ...p, password_info: resetData.newPassword } : p));
          setResetModalOpen(false);
          setResetData({ userId: '', userName: '', newPassword: '' });
      } catch(e: any) { alert(e.message); } finally { setSaving(false); }
  };

    const toggleMapelSelection = (subject: string, isEditMode: boolean) => {
      let currentString = isEditMode ? editFormData.mengajar_mapel : newUser.mapel;
      let currentSelection = currentString ? currentString.split(',').map(s => s.trim()) : [];
      if (currentSelection.includes(subject)) currentSelection = currentSelection.filter(s => s !== subject); else currentSelection.push(subject);
      const newString = currentSelection.filter(Boolean).join(', ');
      if (isEditMode) setEditFormData({ ...editFormData, mengajar_mapel: newString }); else setNewUser({ ...newUser, mapel: newString });
  };

  const filteredProfiles = profiles.filter(t => t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || t.nip?.includes(searchTerm));
  const { availableClasses } = useAuth();

  return (
    <Layout>
      <div className="space-y-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><UserCog className="text-blue-600" /> Data User (Profiles)</h2>
            <p className="text-slate-500 text-sm">Kelola data login, password, dan akademik pengguna.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-slate-400" /></div>
                <input type="text" placeholder="Cari User / NIPY..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full border border-slate-300 rounded-xl text-slate-900 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"/>
              </div>
              <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-slate-100 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex-shrink-0"><UserPlus size={18} /> Tambah User</button>
          </div>
        </div>

        <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-slate-600 font-bold uppercase text-xs">
                 <tr>
                   <th className="px-6 py-4">User Info</th>
                   <th className="px-6 py-4">Password Info</th>
                   <th className="px-6 py-4">Role</th>
                   <th className="px-6 py-4">Jabatan Tambahan</th>
                   <th className="px-6 py-4">Mapel (Profil)</th>
                   <th className="px-6 py-4">Wali Kelas</th>
                   
                   <th className="px-6 py-4 text-center">Aksi</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {loading ? <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">Memuat data profiles...</td></tr> : filteredProfiles.length === 0 ? <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">Tidak ada data user ditemukan.</td></tr> : (
                   filteredProfiles.map((p) => (
                     <tr key={p.id} className="hover:bg-blue-50/50 transition-colors group">
                       <td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">{p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">{p.full_name?.charAt(0)}</div>}</div><div><div className="font-bold text-slate-900">{p.full_name}</div><div className="text-xs text-slate-500 font-mono">{p.nip}</div></div></div></td>
                       <td className="px-6 py-3"><PasswordCell password={p.password_info} /></td>
                       <td className="px-6 py-3">{p.role === 'admin' ? <span className="inline-flex items-center gap-1 bg-blue-300 text-blue-600 px-2 py-1 rounded-lg text-xs font-bold"><Shield size={12} /> Admin</span> : <span className="inline-flex items-center gap-1 bg-blue-300 text-blue-500 px-2 py-1 rounded-lg text-xs font-bold">User</span>}</td>
                       <td className="px-6 py-3">{p.jabatan_tambahan ? <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-bold">{p.jabatan_tambahan}</span> : <span className="text-slate-300">-</span>}</td>
                       <td className="px-6 py-3 text-slate-600 max-w-xs truncate" title={p.mengajar_mapel}>{p.mengajar_mapel ? <div className="flex flex-wrap gap-1">{p.mengajar_mapel.split(',').map((m, i) => <span key={i} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100">{m.trim()}</span>)}</div> : <span className="text-slate-300 italic">Belum diisi</span>}</td>
                       <td className="px-6 py-3">{p.wali_kelas ? <span className="inline-flex items-center gap-1 bg-blue-300 text-blue-600 px-2 py-1 rounded-lg text-xs font-bold"><GraduationCap size={12} /> {p.wali_kelas}</span> : <span className="text-slate-300">-</span>}</td>
                       
                       <td className="px-6 py-3 text-center"><div className="flex justify-center gap-2"><button onClick={() => handleOpenReset(p)} className="p-2 bg-sky-100 text-blue-500 rounded-lg hover:bg-blue-300 transition-colors border border-blue-300" title="Reset Password"><KeyRound size={16} /></button><button onClick={() => handleEditClick(p)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100" title="Edit Data Akademik"><Edit size={16} /></button></div></td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
        </div>

        {/* MODAL RESET PASSWORD - TOP ALIGNED */}
        {resetModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[calc(env(safe-area-inset-top)+1rem)] sm:p-4 bg-slate-900/50 backdrop-blur-sm transition-all duration-300">
                <div className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 border border-slate-100 relative animate-fade-in mt-10">
                    <div className="bg-blue-500 p-4 flex justify-between items-center text-slate-100">
                        <h3 className="font-bold flex items-center gap-2"><KeyRound size={20} /> Reset Password</h3>
                        <button onClick={() => setResetModalOpen(false)} className="hover:bg-slate-100/20 p-1 rounded-full transition-colors"><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="text-center mb-2">
                            <div className="w-12 h-12 bg-blue-300 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-2"><RefreshCw size={24} /></div>
                            <p className="text-sm text-slate-500">Anda akan mereset password untuk:</p>
                            <p className="font-bold text-lg text-slate-800">{resetData.userName}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Password Baru</label>
                            <input className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500" placeholder="Masukkan password baru..." value={resetData.newPassword} onChange={e => setResetData({...resetData, newPassword: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Service Role Key (Wajib)</label>
                            <div className="relative">
                                <input type={showServiceKey ? "text" : "password"} className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border border-blue-300 rounded-lg p-2 pr-10 text-xs font-mono focus:ring-2 focus:ring-blue-600 " placeholder="Paste Service Role Key..." value={serviceKey} onChange={e => setServiceKey(e.target.value)}/>
                                <button type="button" onClick={() => setShowServiceKey(!showServiceKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">{showServiceKey ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                            </div>
                            <p className="text-[10px] text-blue-600 mt-1">* Diperlukan untuk update di sistem Auth.</p>
                        </div>
                        <button onClick={handleResetPasswordAction} disabled={saving} className="w-full bg-blue-500 hover:bg-blue-500 text-slate-100 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2">{saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} Simpan Password Baru</button>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL EDIT AKADEMIK - TOP ALIGNED */}
        {editingUser && (
            <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[calc(env(safe-area-inset-top)+1rem)] sm:p-4 bg-slate-900/50 backdrop-blur-sm transition-all duration-300">
                <div className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-slate-100 relative animate-fade-in mt-10">
                    <div className="bg-blue-600 p-4 flex justify-between items-center text-slate-100">
                        <h3 className="font-bold flex items-center gap-2"><UserCog size={20} /> Edit Data Akademik</h3>
                        <button onClick={() => setEditingUser(null)} className="hover:bg-slate-100/20 p-1 rounded-full transition-colors"><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-5">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                            <p className="text-xs text-blue-600 font-bold uppercase">Mengedit User:</p>
                            <p className="font-bold text-slate-900">{editingUser.full_name}</p>
                            <p className="text-xs text-slate-500 font-mono">{editingUser.nip}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                            <div className="space-y-2">
                                {(() => {
                                    const rawMapels = editFormData.mengajar_mapel || "";
                                    const rawArr = rawMapels ? rawMapels.split(',') : [];
                                    const displayMapels = rawArr.map(m => m.trim());
                                    
                                    return (
                                        <>
                                            {displayMapels.length === 0 && <div className="text-sm text-slate-500 italic">Belum ada mata pelajaran.</div>}
                                            {displayMapels.map((mapel, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <select
                                                        className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 flex-1 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 "
                                                        value={mapel}
                                                        onChange={(e) => {
                                                            const newArr = [...displayMapels];
                                                            newArr[idx] = e.target.value;
                                                            setEditFormData({...editFormData, mengajar_mapel: newArr.join(',')});
                                                        }}
                                                    >
                                                        <option value="">-- Pilih Mata Pelajaran --</option>
                                                        {subjectsList.map(subj => <option key={subj} value={subj}>{subj}</option>)}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newArr = displayMapels.filter((_, i) => i !== idx);
                                                            setEditFormData({...editFormData, mengajar_mapel: newArr.join(',')});
                                                        }}
                                                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newArr = [...displayMapels, ' '];
                                                    setEditFormData({...editFormData, mengajar_mapel: newArr.join(',')});
                                                }}
                                                className="mt-2 text-sm text-blue-600 font-bold flex items-center gap-1 hover:text-blue-700"
                                            >
                                                <Plus size={16} /> Tambahkan Mata Pelajaran
                                            </button>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Wali Kelas</label>
                            <select className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " value={editFormData.wali_kelas} onChange={e => setEditFormData({...editFormData, wali_kelas: e.target.value})}>
                                <option value="">-- Bukan Wali Kelas --</option>
                                {availableClasses.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Jabatan Tambahan</label>
                            <select className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " value={editFormData.jabatan_tambahan} onChange={e => setEditFormData({...editFormData, jabatan_tambahan: e.target.value})}>
                                <option value="-">-</option>
                                <option value="Staff">Staff</option>
                            </select>
                        </div>
                        
                        <div className="pt-4 flex gap-3">
                            <button onClick={() => setEditingUser(null)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                            <button onClick={handleSaveEdit} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-slate-100 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">{saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} Simpan</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL ADD USER - TOP ALIGNED */}
        {isAddModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[calc(env(safe-area-inset-top)+1rem)] sm:p-4 bg-slate-900/50 backdrop-blur-sm transition-all duration-300">
                <div className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 border border-slate-100 relative animate-fade-in flex flex-col max-h-[85vh] mt-10">
                    <div className="bg-blue-500 p-4 flex justify-between items-center text-slate-100 flex-shrink-0">
                        <h3 className="font-bold flex items-center gap-2"><UserPlus size={20} /> Tambah User Manual</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-slate-100/20 p-1 rounded-full transition-colors"><X size={20} /></button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 flex gap-3">
                            <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                            <div className="text-sm text-blue-800">
                                <p className="font-bold mb-1">Penting!</p>
                                <p>Pastikan <strong>NIPY</strong> sesuai. Password default adalah <strong>bti</strong>.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">NIPY (Username / Email prefix)</label>
                                <input className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800  w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 " placeholder="Contoh: 123456" value={newUser.nip} onChange={e => setNewUser({...newUser, nip: e.target.value})}/>
                                <p className="text-xs text-slate-500 mt-1">Otomatis menjadi email: <span className="font-mono">{newUser.nip || '...' }@sekolah.id</span></p>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Service Role Key (Wajib)</label>
                                <div className="relative">
                                    <input type={showServiceKey ? "text" : "password"} className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border border-blue-300 rounded-lg p-2 pr-10 text-xs font-mono focus:ring-2 focus:ring-blue-500 " placeholder="Paste Service Role Key..." value={serviceKey} onChange={e => setServiceKey(e.target.value)}/>
                                    <button type="button" onClick={() => setShowServiceKey(!showServiceKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">{showServiceKey ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                </div>
                                <p className="text-[10px] text-blue-500 mt-1">* Diperlukan untuk membuat user di Authentication Supabase.</p>
                            </div>
                        </div>

                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                                <input className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800  w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 " placeholder="Nama Guru..." value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})}/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                                <select className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 " value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                    <option value="user">User (Guru)</option>
                                    <option value="operator">Operator</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                                <div className="space-y-2">
                                    {(() => {
                                        const rawMapels = newUser.mapel || "";
                                        const rawArr = rawMapels ? rawMapels.split(',') : [];
                                        const displayMapels = rawArr.map(m => m.trim());
                                        
                                        return (
                                            <>
                                                {displayMapels.length === 0 && <div className="text-sm text-slate-500 italic">Belum ada mata pelajaran.</div>}
                                                {displayMapels.map((mapel, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <select
                                                            className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 flex-1 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 "
                                                            value={mapel}
                                                            onChange={(e) => {
                                                                const newArr = [...displayMapels];
                                                                newArr[idx] = e.target.value;
                                                                setNewUser({...newUser, mapel: newArr.join(',')});
                                                            }}
                                                        >
                                                            <option value="">-- Pilih Mata Pelajaran --</option>
                                                            {subjectsList.map(subj => <option key={subj} value={subj}>{subj}</option>)}
                                                        </select>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newArr = displayMapels.filter((_, i) => i !== idx);
                                                                setNewUser({...newUser, mapel: newArr.join(',')});
                                                            }}
                                                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newArr = [...displayMapels, ' '];
                                                        setNewUser({...newUser, mapel: newArr.join(',')});
                                                    }}
                                                    className="mt-2 text-sm text-blue-600 font-bold flex items-center gap-1 hover:text-blue-700"
                                                >
                                                    <Plus size={16} /> Tambahkan Mata Pelajaran
                                                </button>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Wali Kelas</label>
                                <select className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 " value={newUser.waliKelas} onChange={e => setNewUser({...newUser, waliKelas: e.target.value})}>
                                    <option value="">-- Bukan Wali Kelas --</option>
                                    {availableClasses.map(k => <option key={k} value={k}>{k}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-gray-50 flex justify-end flex-shrink-0">
                        <button onClick={handleCreateUser} disabled={saving} className="bg-blue-500 hover:bg-blue-500 text-slate-100 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all">{saving ? <Loader2 className="animate-spin" /> : <UserPlus size={20} />} Tambah User</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </Layout>
  );
};
export default UsersData;
