const fs = require('fs');

const replaceInFile = (file, regex, replacement) => {
    let content = fs.readFileSync(file, 'utf-8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
};

let content = fs.readFileSync('pages/Dashboard.tsx', 'utf-8');

// Replace state
content = content.replace(
    /const \[staffAttendanceToday, setStaffAttendanceToday\] = useState<\{ id: string, created_at: string \} \| null>\(null\);/,
    `const [staffAttendanceDatang, setStaffAttendanceDatang] = useState<{ id: string, created_at: string } | null>(null);
  const [staffAttendancePulang, setStaffAttendancePulang] = useState<{ id: string, created_at: string } | null>(null);`
);

// Replace fetch
content = content.replace(
    /supabase\.from\('journals'\)\s*\.select\('id, created_at'\)\s*\.eq\('teacher_id', profile\.id\)\s*\.eq\('kelas', 'STAFF'\)\s*\.eq\('subject', 'KEHADIRAN'\)\s*\.gte\('created_at', todayStart\)\s*\.lte\('created_at', todayEnd\)\s*\.order\('created_at', \{ ascending: false \}\)\s*\.limit\(1\)/,
    `supabase.from('journals')
                    .select('id, created_at, material')
                    .eq('teacher_id', profile.id)
                    .eq('kelas', 'STAFF')
                    .eq('subject', 'KEHADIRAN')
                    .gte('created_at', todayStart)
                    .lte('created_at', todayEnd)
                    .order('created_at', { ascending: false })`
);

content = content.replace(
    /if \(staffJRes\.data && staffJRes\.data\.length > 0\) \{\s*setStaffAttendanceToday\(staffJRes\.data\[0\]\);\s*\} else \{\s*setStaffAttendanceToday\(null\);\s*\}/,
    `if (staffJRes.data && staffJRes.data.length > 0) {
                const datang = staffJRes.data.find(d => d.material === 'Datang' || d.material === 'Hadir');
                const pulang = staffJRes.data.find(d => d.material === 'Pulang');
                setStaffAttendanceDatang(datang || null);
                setStaffAttendancePulang(pulang || null);
            } else {
                setStaffAttendanceDatang(null);
                setStaffAttendancePulang(null);
            }`
);

// We need to change handleStaffAttendance
content = content.replace(
    /const handleStaffAttendance = async \(\) => \{/,
    `const handleStaffAttendance = async (type: 'DATANG' | 'PULANG') => {`
);

content = content.replace(
    /material: 'Hadir',/,
    `material: type === 'DATANG' ? 'Datang' : 'Pulang',`
);

content = content.replace(
    /if \(data\) \{\s*setStaffAttendanceToday\(data\);\s*\}/,
    `if (data) {
                  if (type === 'DATANG') setStaffAttendanceDatang(data);
                  else setStaffAttendancePulang(data);
              }`
);

// UI Buttons
content = content.replace(
    /\{\/\* STAFF ATTENDANCE BUTTON \*\/\}\s*\{profile\?\.jabatan_tambahan === 'Staff' && \([\s\S]*?<\/button>\s*<\/div>\s*\)\}/,
    `{/* STAFF ATTENDANCE BUTTON */}
                {profile?.jabatan_tambahan === 'Staff' && (
                    <div className="mb-6 grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleStaffAttendance('DATANG')}
                            disabled={!!staffAttendanceDatang || savingStaffAttendance}
                            className={\`w-full p-4 rounded-2xl flex flex-col justify-center items-center gap-2 font-extrabold transition-all duration-300 shadow-md border \${
                                staffAttendanceDatang 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-blue-500 hover:shadow-xl hover:-translate-y-1'
                            }\`}
                        >
                            {savingStaffAttendance && !staffAttendanceDatang ? (
                                <><Loader2 size={20} className="animate-spin" /> Memproses...</>
                            ) : staffAttendanceDatang ? (
                                <><CheckCircle2 size={20} /> Datang {new Date(staffAttendanceDatang.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</>
                            ) : (
                                <><CheckCircle2 size={20} /> Presensi Datang</>
                            )}
                        </button>

                        <button
                            onClick={() => handleStaffAttendance('PULANG')}
                            disabled={!!staffAttendancePulang || savingStaffAttendance || !staffAttendanceDatang}
                            className={\`w-full p-4 rounded-2xl flex flex-col justify-center items-center gap-2 font-extrabold transition-all duration-300 shadow-md border \${
                                staffAttendancePulang || !staffAttendanceDatang
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white border-emerald-500 hover:shadow-xl hover:-translate-y-1'
                            }\`}
                        >
                            {savingStaffAttendance && !!staffAttendanceDatang && !staffAttendancePulang ? (
                                <><Loader2 size={20} className="animate-spin" /> Memproses...</>
                            ) : staffAttendancePulang ? (
                                <><CheckCircle2 size={20} /> Pulang {new Date(staffAttendancePulang.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</>
                            ) : (
                                <><CheckCircle2 size={20} /> Presensi Pulang</>
                            )}
                        </button>
                    </div>
                )}`
);

fs.writeFileSync('pages/Dashboard.tsx', content);

console.log("Done patching Dashboard.tsx");
