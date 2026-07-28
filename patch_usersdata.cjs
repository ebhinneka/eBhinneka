const fs = require('fs');
let code = fs.readFileSync('pages/UsersData.tsx', 'utf8');

// Add jabatan_tambahan to state
code = code.replace(
  "const [editFormData, setEditFormData] = useState({ mengajar_mapel: '', wali_kelas: '' });",
  "const [editFormData, setEditFormData] = useState({ mengajar_mapel: '', wali_kelas: '', jabatan_tambahan: '-' });"
);
code = code.replace(
  "setEditFormData({ mengajar_mapel: user.mengajar_mapel || '', wali_kelas: user.wali_kelas || '' });",
  "setEditFormData({ mengajar_mapel: user.mengajar_mapel || '', wali_kelas: user.wali_kelas || '', jabatan_tambahan: user.jabatan_tambahan || '-' });"
);

// Add to payload
code = code.replace(
  "wali_kelas: editFormData.wali_kelas\n      };",
  "wali_kelas: editFormData.wali_kelas,\n          jabatan_tambahan: editFormData.jabatan_tambahan === '-' ? null : editFormData.jabatan_tambahan\n      };"
);

// Add to ui list map
code = code.replace(
  "setProfiles(prev => prev.map(p => p.id === editingUser.id ? { ...p, mengajar_mapel: finalMapel, wali_kelas: editFormData.wali_kelas } : p));",
  "setProfiles(prev => prev.map(p => p.id === editingUser.id ? { ...p, mengajar_mapel: finalMapel, wali_kelas: editFormData.wali_kelas, jabatan_tambahan: editFormData.jabatan_tambahan === '-' ? null : editFormData.jabatan_tambahan } : p));"
);

// Also add to tabel_guru ? Maybe we don't need to add it to tabel_guru, just profiles.
// Wait, the user is modifying 'Data User (Profiles)', the display is fetched from profiles.

// Add the table column Header
code = code.replace(
  "<th className=\"px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider\">Role</th>",
  "<th className=\"px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider\">Role</th>\n                   <th className=\"px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider\">Jabatan</th>"
);
// Also increase colspan for empty/loading
code = code.replace(
  "colSpan={7}",
  "colSpan={8}"
);
code = code.replace(
  "colSpan={7}",
  "colSpan={8}"
);


// Add to Table Cell
code = code.replace(
  "<td className=\"px-6 py-3 text-slate-600 max-w-xs truncate\" title={p.mengajar_mapel}>",
  "<td className=\"px-6 py-3\">{p.jabatan_tambahan ? <span className=\"inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-bold\">{p.jabatan_tambahan}</span> : <span className=\"text-slate-300\">-</span>}</td>\n                       <td className=\"px-6 py-3 text-slate-600 max-w-xs truncate\" title={p.mengajar_mapel}>"
);


// Add the UI for Edit dropdown
const waliKelasInput = `<div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Wali Kelas</label>
                            <select className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-100 text-slate-900   " value={editFormData.wali_kelas} onChange={e => setEditFormData({...editFormData, wali_kelas: e.target.value})}>
                                <option value="">-- Bukan Wali Kelas --</option>
                                {availableClasses.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>`;

const newJabatanInput = `<div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Wali Kelas</label>
                            <select className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-100 text-slate-900   " value={editFormData.wali_kelas} onChange={e => setEditFormData({...editFormData, wali_kelas: e.target.value})}>
                                <option value="">-- Bukan Wali Kelas --</option>
                                {availableClasses.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Jabatan Tambahan</label>
                            <select className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-100 text-slate-900" value={editFormData.jabatan_tambahan} onChange={e => setEditFormData({...editFormData, jabatan_tambahan: e.target.value})}>
                                <option value="-">-</option>
                                <option value="Staff">Staff</option>
                            </select>
                        </div>`;

code = code.replace(waliKelasInput, newJabatanInput);

fs.writeFileSync('pages/UsersData.tsx', code);
console.log("Done");
