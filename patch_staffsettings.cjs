const fs = require('fs');

let content = fs.readFileSync('pages/StaffSettings.tsx', 'utf-8');

// 1. Add fields to GeoLocation interface
content = content.replace(
    /endTime\?: string;/,
    `endTime?: string;
    pulangStartTime?: string;
    pulangEndTime?: string;`
);

// 2. Add state
content = content.replace(
    /const \[newEndTime, setNewEndTime\] = useState\(''\);/,
    `const [newEndTime, setNewEndTime] = useState('');
    const [newPulangStartTime, setNewPulangStartTime] = useState('');
    const [newPulangEndTime, setNewPulangEndTime] = useState('');`
);

// 3. Add to newLoc object
content = content.replace(
    /endTime: newEndTime \|\| undefined\s*\};/,
    `endTime: newEndTime || undefined,
            pulangStartTime: newPulangStartTime || undefined,
            pulangEndTime: newPulangEndTime || undefined
        };`
);

// 4. Reset state
content = content.replace(
    /setNewEndTime\(''\);\s*\}\s*const handleDeleteLocation/,
    `setNewEndTime('');
        setNewPulangStartTime('');
        setNewPulangEndTime('');
    }

    const handleDeleteLocation`
);

// 5. Update UI for the list items
content = content.replace(
    /\{loc\.startTime && loc\.endTime && \(\s*<div className="text-xs text-slate-500 mt-1">\s*Waktu: \{loc\.startTime\} - \{loc\.endTime\}\s*<\/div>\s*\)\}/,
    `{(loc.startTime || loc.endTime) && (
                                            <div className="text-xs text-slate-500 mt-1">
                                                Jam Kehadiran: {loc.startTime || '...'} - {loc.endTime || '...'}
                                            </div>
                                        )}
                                        {(loc.pulangStartTime || loc.pulangEndTime) && (
                                            <div className="text-xs text-slate-500 mt-1">
                                                Jam Pulang: {loc.pulangStartTime || '...'} - {loc.pulangEndTime || '...'}
                                            </div>
                                        )}`
);

// 6. Update UI for the inputs
const replacementInputs = `                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2 mt-4">Jam Kehadiran (Presensi Datang)</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Waktu Mulai (Opsional)</label>
                                        <input 
                                            type="time" 
                                            value={newStartTime} 
                                            onChange={e => setNewStartTime(e.target.value)} 
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Waktu Selesai (Opsional)</label>
                                        <input 
                                            type="time" 
                                            value={newEndTime} 
                                            onChange={e => setNewEndTime(e.target.value)} 
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2 mt-4">Jam Pulang (Presensi Pulang)</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Waktu Mulai (Opsional)</label>
                                        <input 
                                            type="time" 
                                            value={newPulangStartTime} 
                                            onChange={e => setNewPulangStartTime(e.target.value)} 
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Waktu Selesai (Opsional)</label>
                                        <input 
                                            type="time" 
                                            value={newPulangEndTime} 
                                            onChange={e => setNewPulangEndTime(e.target.value)} 
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>`;

content = content.replace(
    /<div>\s*<label className="block text-xs font-bold text-slate-500 mb-1">Waktu Mulai \(Opsional\)<\/label>[\s\S]*?onChange=\{e => setNewEndTime\(e\.target\.value\)\}[\s\S]*?<\/div>\s*<\/div>/,
    replacementInputs
);


fs.writeFileSync('pages/StaffSettings.tsx', content);
console.log("Done patching StaffSettings.tsx");
