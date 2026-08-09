const fs = require('fs');
let content = fs.readFileSync('pages/Dashboard.tsx', 'utf-8');

const timeCode = `
  const [attendanceErrorModal, setAttendanceErrorModal] = useState<string | null>(null);

  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(() => {
      const now = new Date();
      return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
      const interval = setInterval(() => {
          const now = new Date();
          setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
      }, 60000);
      return () => clearInterval(interval);
  }, []);

  let isDatangMissed = false;
  let isPulangMissed = false;

  if (staffGeolocations.length > 0) {
      const hasDatangEndTime = staffGeolocations.some((g: any) => g.endTime);
      if (hasDatangEndTime) {
          isDatangMissed = staffGeolocations.every((g: any) => {
              if (!g.endTime) return false;
              const [h, m] = g.endTime.split(':').map(Number);
              return currentTimeMinutes > h * 60 + m;
          });
      }

      const hasPulangEndTime = staffGeolocations.some((g: any) => g.pulangEndTime);
      if (hasPulangEndTime) {
          isPulangMissed = staffGeolocations.every((g: any) => {
              if (!g.pulangEndTime) return false;
              const [h, m] = g.pulangEndTime.split(':').map(Number);
              return currentTimeMinutes > h * 60 + m;
          });
      }
  }
`;

content = content.replace(
    /const \[attendanceErrorModal, setAttendanceErrorModal\] = useState<string \| null>\(null\);/,
    timeCode
);

// Now patch the UI for rendering these states.
content = content.replace(
    /<button\s*onClick=\{([^}]*)\}\s*disabled=\{!!staffAttendanceDatang \|\| savingStaffAttendance\}\s*className=\{`w-full p-4 rounded-2xl flex flex-col justify-center items-center gap-2 font-extrabold transition-all duration-300 shadow-md border \$\{\s*staffAttendanceDatang\s*\? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed'\s*: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-blue-500 hover:shadow-xl hover:-translate-y-1'\s*\}`\}\s*>\s*\{savingStaffAttendance && !staffAttendanceDatang \? \(\s*<><Loader2 size=\{20\} className="animate-spin" \/> Memproses\.\.\.<\/>\s*\) : staffAttendanceDatang \? \(\s*<><CheckCircle2 size=\{20\} \/> Datang \{new Date\(staffAttendanceDatang\.created_at\)\.toLocaleTimeString\('id-ID', \{ hour: '2-digit', minute: '2-digit' \}\)\} WIB<\/>\s*\) : \(\s*<><CheckCircle2 size=\{20\} \/> Presensi Datang<\/>\s*\)\}\s*<\/button>/,
    `<button
                            onClick={() => handleStaffAttendance('DATANG')}
                            disabled={!!staffAttendanceDatang || savingStaffAttendance || (!staffAttendanceDatang && isDatangMissed)}
                            className={\`w-full p-4 rounded-2xl flex flex-col justify-center items-center gap-2 font-extrabold transition-all duration-300 shadow-md border \${
                                staffAttendanceDatang || (!staffAttendanceDatang && isDatangMissed)
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-blue-500 hover:shadow-xl hover:-translate-y-1'
                            }\`}
                        >
                            {savingStaffAttendance && !staffAttendanceDatang ? (
                                <><Loader2 size={20} className="animate-spin" /> Memproses...</>
                            ) : staffAttendanceDatang ? (
                                <><CheckCircle2 size={20} /> Datang {new Date(staffAttendanceDatang.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</>
                            ) : isDatangMissed ? (
                                <><XCircle size={20} /> Anda tidak Presensi Datang</>
                            ) : (
                                <><CheckCircle2 size={20} /> Presensi Datang</>
                            )}
                        </button>`
);

content = content.replace(
    /<button\s*onClick=\{([^}]*)\}\s*disabled=\{!!staffAttendancePulang \|\| savingStaffAttendance \|\| !staffAttendanceDatang\}\s*className=\{`w-full p-4 rounded-2xl flex flex-col justify-center items-center gap-2 font-extrabold transition-all duration-300 shadow-md border \$\{\s*staffAttendancePulang \|\| !staffAttendanceDatang\s*\? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed'\s*: 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white border-emerald-500 hover:shadow-xl hover:-translate-y-1'\s*\}`\}\s*>\s*\{savingStaffAttendance && !!staffAttendanceDatang && !staffAttendancePulang \? \(\s*<><Loader2 size=\{20\} className="animate-spin" \/> Memproses\.\.\.<\/>\s*\) : staffAttendancePulang \? \(\s*<><CheckCircle2 size=\{20\} \/> Pulang \{new Date\(staffAttendancePulang\.created_at\)\.toLocaleTimeString\('id-ID', \{ hour: '2-digit', minute: '2-digit' \}\)\} WIB<\/>\s*\) : \(\s*<><CheckCircle2 size=\{20\} \/> Presensi Pulang<\/>\s*\)\}\s*<\/button>/,
    `<button
                            onClick={() => handleStaffAttendance('PULANG')}
                            disabled={!!staffAttendancePulang || savingStaffAttendance || !staffAttendanceDatang || (!staffAttendancePulang && isPulangMissed)}
                            className={\`w-full p-4 rounded-2xl flex flex-col justify-center items-center gap-2 font-extrabold transition-all duration-300 shadow-md border \${
                                staffAttendancePulang || !staffAttendanceDatang || (!staffAttendancePulang && isPulangMissed)
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white border-emerald-500 hover:shadow-xl hover:-translate-y-1'
                            }\`}
                        >
                            {savingStaffAttendance && !!staffAttendanceDatang && !staffAttendancePulang ? (
                                <><Loader2 size={20} className="animate-spin" /> Memproses...</>
                            ) : staffAttendancePulang ? (
                                <><CheckCircle2 size={20} /> Pulang {new Date(staffAttendancePulang.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</>
                            ) : isPulangMissed ? (
                                <><XCircle size={20} /> Anda tidak Presensi Pulang</>
                            ) : (
                                <><CheckCircle2 size={20} /> Presensi Pulang</>
                            )}
                        </button>`
);

fs.writeFileSync('pages/Dashboard.tsx', content);
console.log("Done patching Dashboard UI and Missed Logic");
