const fs = require('fs');
let content = fs.readFileSync('pages/UsersData.tsx', 'utf8');

// Replace Edit Modal Mapel UI
const editModalOld = `<div className="relative">
                            <label className="block text-sm font-bold text-slate-700 mb-1">Mata Pelajaran (Multi-Select)</label>
                            <button onClick={() => setIsMapelDropdownOpen(!isMapelDropdownOpen)} className="w-full text-left border border-slate-300 rounded-xl p-3 bg-slate-100 focus:ring-2 focus:ring-blue-500 flex justify-between items-center"><span className={\`truncate \${!editFormData.mengajar_mapel ? 'text-slate-400' : 'text-slate-900'}\`}>{editFormData.mengajar_mapel || "-- Pilih Mata Pelajaran --"}</span><ChevronDown size={16} className="text-slate-400" /></button>
                            {isMapelDropdownOpen && (
                                <div className="absolute z-20 w-full mt-2 bg-slate-100 border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto p-1 custom-scrollbar">
                                    {subjectsList.length === 0 ? <div className="p-3 text-center text-slate-400 text-xs">Belum ada data Master Mapel.</div> : subjectsList.map((subj, idx) => { const isSelected = editFormData.mengajar_mapel.includes(subj); return (<div key={idx} onClick={() => toggleMapelSelection(subj, true)} className={\`flex items-center justify-between p-3 rounded-lg cursor-pointer text-sm mb-1 transition-colors \${isSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-slate-700'}\`}><span>{subj}</span>{isSelected && <Check size={16} className="text-blue-600"/>}</div>); })}
                                </div>
                            )}
                        </div>`;

const editModalNew = `<div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                            <div className="space-y-2">
                                {(() => {
                                    const rawMapels = editFormData.mengajar_mapel || "";
                                    const mapelsArr = rawMapels.split(',').map(m => m.trim());
                                    const displayMapels = mapelsArr.filter(m => m !== 'Sabtu bersama Wali Kelas' && m !== '');
                                    
                                    return (
                                        <>
                                            {displayMapels.length === 0 && <div className="text-sm text-slate-500 italic">Belum ada mata pelajaran.</div>}
                                            {displayMapels.map((mapel, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <select
                                                        className="flex-1 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-slate-100 text-slate-900"
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
                        </div>`;


const addModalOld = `<div className="relative">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Mata Pelajaran (Multi-Select)</label>
                                <button onClick={() => setIsMapelDropdownOpen(!isMapelDropdownOpen)} className="w-full text-left border border-slate-300 rounded-xl p-3 bg-slate-100 focus:ring-2 focus:ring-blue-500 flex justify-between items-center"><span className={\`truncate \${!newUser.mapel ? 'text-slate-400' : 'text-slate-900'}\`}>{newUser.mapel || "-- Pilih Mata Pelajaran --"}</span><ChevronDown size={16} className="text-slate-400" /></button>
                                {isMapelDropdownOpen && (
                                    <div className="absolute z-20 w-full mt-2 bg-slate-100 border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto p-1 custom-scrollbar">
                                        {subjectsList.length === 0 ? <div className="p-3 text-center text-slate-400 text-xs">Belum ada data Master Mapel.</div> : subjectsList.map((subj, idx) => { const isSelected = newUser.mapel.includes(subj); return (<div key={idx} onClick={() => toggleMapelSelection(subj, false)} className={\`flex items-center justify-between p-3 rounded-lg cursor-pointer text-sm mb-1 transition-colors \${isSelected ? 'bg-sky-100 text-blue-500 font-bold' : 'hover:bg-gray-50 text-slate-700'}\`}><span>{subj}</span>{isSelected && <Check size={16} className="text-blue-500"/>}</div>); })}
                                    </div>
                                )}
                            </div>`;

const addModalNew = `<div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                                <div className="space-y-2">
                                    {(() => {
                                        const rawMapels = newUser.mapel || "";
                                        const mapelsArr = rawMapels.split(',').map(m => m.trim());
                                        const displayMapels = mapelsArr.filter(m => m !== 'Sabtu bersama Wali Kelas' && m !== '');
                                        
                                        return (
                                            <>
                                                {displayMapels.length === 0 && <div className="text-sm text-slate-500 italic">Belum ada mata pelajaran.</div>}
                                                {displayMapels.map((mapel, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <select
                                                            className="flex-1 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-slate-100 text-slate-900"
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
                            </div>`;

content = content.replace(editModalOld, editModalNew);
content = content.replace(addModalOld, addModalNew);

// Make sure to clean up final mapels to filter out empty strings on save
// In handleSaveEdit: 
// const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()).filter(m => m !== '') : [];
// In handleCreateUser:
// const mapelsNew = finalMapelNew ? finalMapelNew.split(',').map(m => m.trim()).filter(m => m !== '') : [];

content = content.replace(
    /const mapels = finalMapel \? finalMapel\.split\(\',\/\)\.map\(m => m\.trim\(\)\) : \[\];/g, 
    "const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()).filter(m => m !== '') : [];"
);

content = content.replace(
    /const mapelsNew = finalMapelNew \? finalMapelNew\.split\(\',\/\)\.map\(m => m\.trim\(\)\) : \[\];/g, 
    "const mapelsNew = finalMapelNew ? finalMapelNew.split(',').map(m => m.trim()).filter(m => m !== '') : [];"
);

fs.writeFileSync('pages/UsersData.tsx', content);
console.log("Successfully replaced mapel UI");
