const fs = require('fs');
let content = fs.readFileSync('pages/StudentsData.tsx', 'utf8');

const oldDatalist = `<div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Kelas</label>
                                        <input list="class-options" className="w-full border border-slate-200 rounded-xl p-3 bg-slate-100 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-600" value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value.toUpperCase()})} placeholder="Cth: 7A" />
                                        <datalist id="class-options">
                                            {availableClasses.map(c => <option key={c} value={c} />)}
                                        </datalist>
                                    </div>`;

const newSelect = `<div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Kelas</label>
                                        <select className="w-full border border-slate-200 rounded-xl p-3 bg-slate-100 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-600" value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value})}>
                                            <option value="">-- Pilih Kelas --</option>
                                            {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>`;

content = content.replace(oldDatalist, newSelect);

fs.writeFileSync('pages/StudentsData.tsx', content);
