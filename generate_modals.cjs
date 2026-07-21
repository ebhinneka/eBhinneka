const fs = require('fs');
const content = fs.readFileSync('pages/UsersData.tsx', 'utf8');

const modalStart = content.indexOf('{/* MODAL RESET PASSWORD');
if (modalStart === -1) {
    console.log("Could not find start of modals");
    process.exit(1);
}

const beforeModals = content.substring(0, modalStart);
const endWrapper = `
      </div>
    </Layout>
  );
};
export default UsersData;
`;

const newModals = `{/* MODAL RESET PASSWORD - TOP ALIGNED */}
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
                            <input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500" placeholder="Masukkan password baru..." value={resetData.newPassword} onChange={e => setResetData({...resetData, newPassword: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Service Role Key (Wajib)</label>
                            <div className="relative">
                                <input type={showServiceKey ? "text" : "password"} className="w-full border border-blue-300 rounded-lg p-2 pr-10 text-xs font-mono focus:ring-2 focus:ring-blue-600 bg-slate-100 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-600" placeholder="Paste Service Role Key..." value={serviceKey} onChange={e => setServiceKey(e.target.value)}/>
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
                        
                        <div className="relative">
                            <label className="block text-sm font-bold text-slate-700 mb-1">Mata Pelajaran (Multi-Select)</label>
                            <button onClick={() => setIsMapelDropdownOpen(!isMapelDropdownOpen)} className="w-full text-left border border-slate-300 rounded-xl p-3 bg-slate-100 focus:ring-2 focus:ring-blue-500 flex justify-between items-center"><span className={\`truncate \${!editFormData.mengajar_mapel ? 'text-slate-400' : 'text-slate-900'}\`}>{editFormData.mengajar_mapel || "-- Pilih Mata Pelajaran --"}</span><ChevronDown size={16} className="text-slate-400" /></button>
                            {isMapelDropdownOpen && (
                                <div className="absolute z-20 w-full mt-2 bg-slate-100 border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto p-1 custom-scrollbar">
                                    {subjectsList.length === 0 ? <div className="p-3 text-center text-slate-400 text-xs">Belum ada data Master Mapel.</div> : subjectsList.map((subj, idx) => { const isSelected = editFormData.mengajar_mapel.includes(subj); return (<div key={idx} onClick={() => toggleMapelSelection(subj, true)} className={\`flex items-center justify-between p-3 rounded-lg cursor-pointer text-sm mb-1 transition-colors \${isSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-slate-700'}\`}><span>{subj}</span>{isSelected && <Check size={16} className="text-blue-600"/>}</div>); })}
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Wali Kelas</label>
                            <select className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-100 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-600" value={editFormData.wali_kelas} onChange={e => {
    const val = e.target.value;
    let newMapel = editFormData.mengajar_mapel;
    if (val) {
        const mapels = newMapel ? newMapel.split(',').map(m => m.trim()) : [];
        if (!mapels.includes('Sabtu bersama Wali Kelas')) {
            mapels.push('Sabtu bersama Wali Kelas');
            newMapel = mapels.join(', ');
        }
    }
    setEditFormData({...editFormData, wali_kelas: val, mengajar_mapel: newMapel});
}}>
                                <option value="">-- Bukan Wali Kelas --</option>
                                {availableClasses.map(k => <option key={k} value={k}>{k}</option>)}
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
                                <input className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100" placeholder="Contoh: 123456" value={newUser.nip} onChange={e => setNewUser({...newUser, nip: e.target.value})}/>
                                <p className="text-xs text-slate-500 mt-1">Otomatis menjadi email: <span className="font-mono">{newUser.nip || '...' }@sekolah.id</span></p>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Service Role Key (Wajib)</label>
                                <div className="relative">
                                    <input type={showServiceKey ? "text" : "password"} className="w-full border border-blue-300 rounded-lg p-2 pr-10 text-xs font-mono focus:ring-2 focus:ring-blue-500 bg-slate-100 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-600" placeholder="Paste Service Role Key..." value={serviceKey} onChange={e => setServiceKey(e.target.value)}/>
                                    <button type="button" onClick={() => setShowServiceKey(!showServiceKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">{showServiceKey ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                </div>
                                <p className="text-[10px] text-blue-500 mt-1">* Diperlukan untuk membuat user di Authentication Supabase.</p>
                            </div>
                        </div>

                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                                <input className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100" placeholder="Nama Guru..." value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})}/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                                <select className="w-full border border-slate-300 rounded-xl p-3 bg-slate-100 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-600" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                    <option value="user">User (Guru)</option>
                                    <option value="operator">Operator</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Mata Pelajaran (Multi-Select)</label>
                                <button onClick={() => setIsMapelDropdownOpen(!isMapelDropdownOpen)} className="w-full text-left border border-slate-300 rounded-xl p-3 bg-slate-100 focus:ring-2 focus:ring-blue-500 flex justify-between items-center"><span className={\`truncate \${!newUser.mapel ? 'text-slate-400' : 'text-slate-900'}\`}>{newUser.mapel || "-- Pilih Mata Pelajaran --"}</span><ChevronDown size={16} className="text-slate-400" /></button>
                                {isMapelDropdownOpen && (
                                    <div className="absolute z-20 w-full mt-2 bg-slate-100 border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto p-1 custom-scrollbar">
                                        {subjectsList.length === 0 ? <div className="p-3 text-center text-slate-400 text-xs">Belum ada data Master Mapel.</div> : subjectsList.map((subj, idx) => { const isSelected = newUser.mapel.includes(subj); return (<div key={idx} onClick={() => toggleMapelSelection(subj, false)} className={\`flex items-center justify-between p-3 rounded-lg cursor-pointer text-sm mb-1 transition-colors \${isSelected ? 'bg-sky-100 text-blue-500 font-bold' : 'hover:bg-gray-50 text-slate-700'}\`}><span>{subj}</span>{isSelected && <Check size={16} className="text-blue-500"/>}</div>); })}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Wali Kelas</label>
                                <select className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-slate-100 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-600" value={newUser.waliKelas} onChange={e => {
    const val = e.target.value;
    let newMapel = newUser.mapel;
    if (val) {
        const mapels = newMapel ? newMapel.split(',').map(m => m.trim()) : [];
        if (!mapels.includes('Sabtu bersama Wali Kelas')) {
            mapels.push('Sabtu bersama Wali Kelas');
            newMapel = mapels.join(', ');
        }
    }
    setNewUser({...newUser, waliKelas: val, mapel: newMapel});
}}>
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
        )}`;

fs.writeFileSync('pages/UsersData.tsx', beforeModals + newModals + endWrapper);
console.log("Successfully recreated modals");
