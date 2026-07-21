const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Performance status logic
code = code.replace(
    '  let performanceColor = "text-red-200";\n  if (percentage > 85) { performanceStatus = "Di Atas Ekspektasi"; performanceColor = "text-emerald-200"; } \n  else if (percentage >= 70) { performanceStatus = "Sesuai Ekspektasi"; performanceColor = "text-blue-200"; }',
    '  let performanceColor = "text-red-500 bg-red-500/20 border-red-500/30";\n  if (percentage > 85) { performanceStatus = "Di Atas Ekspektasi"; performanceColor = "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"; } \n  else if (percentage >= 70) { performanceStatus = "Sesuai Ekspektasi"; performanceColor = "text-amber-400 bg-amber-500/20 border-amber-500/30"; }'
);

// 2. Container
code = code.replace(
    '<div className="bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-[2rem] p-6 md:p-8 text-white shadow-xl relative overflow-hidden">',
    '<div className="bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-6 md:p-8 text-white shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/10 relative overflow-hidden">'
);

// 3. Profile icon
code = code.replace(
    '<div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/20 shadow-inner overflow-hidden bg-white/10 flex items-center justify-center p-0.5">',
    '<div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden bg-white/10 backdrop-blur-md flex items-center justify-center p-1.5">'
);

// 4. Texts
code = code.replace(
    '<p className="text-orange-50 text-sm font-bold opacity-90 mb-0.5 tracking-wide">{greeting}</p>',
    '<p className="text-blue-100 text-sm font-bold opacity-90 mb-0.5 tracking-wide">{greeting}</p>'
);
code = code.replace(
    '<p className="text-orange-100 text-sm font-mono font-medium mb-3">{isAdmin ? \'Administrator\' : (profile?.nip || \'NIPY -\')}</p>',
    '<p className="text-blue-200 text-sm font-mono font-medium mb-3">{isAdmin ? \'Administrator\' : (profile?.nip || \'NIPY -\')}</p>'
);

// 5. Subject Badge
code = code.replace(
    '<span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white uppercase tracking-wider">{profile.mengajar_mapel}</span>',
    '<span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-[10px] font-bold text-blue-100 uppercase tracking-wider">{profile.mengajar_mapel}</span>'
);
// Wali Kelas Badge
code = code.replace(
    '<span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white border border-blue-500/50 text-[10px] font-bold uppercase tracking-wider shadow-sm">Wali Kelas {profile.wali_kelas}</span>',
    '<span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-[10px] font-bold text-blue-100 uppercase tracking-wider shadow-sm">Wali Kelas {profile.wali_kelas}</span>'
);

// 6. Stats Container
code = code.replace(
    '<p className="text-[11px] font-bold text-orange-50 mb-2 uppercase tracking-widest text-center md:text-right">Kinerja {currentMonthName}</p>',
    '<p className="text-[11px] font-bold text-blue-200 mb-2 uppercase tracking-widest text-center md:text-right">Kinerja {currentMonthName}</p>'
);

code = code.replace(
    '<div className="bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md w-full overflow-hidden shadow-inner">',
    '<div className="bg-white/5 rounded-[20px] md:rounded-[24px] border border-white/10 backdrop-blur-xl w-full overflow-hidden shadow-inner">'
);

code = code.replace(
    '<span className="text-[9px] md:text-[10px] font-bold text-orange-50 uppercase tracking-widest mt-1.5">Pertemuan</span>',
    '<span className="text-[9px] md:text-[10px] font-bold text-blue-200 uppercase tracking-widest mt-1.5">Pertemuan</span>'
);
code = code.replace(
    '<span className="text-[9px] md:text-[10px] font-bold text-orange-50 uppercase tracking-widest mt-1.5">Total JP</span>',
    '<span className="text-[9px] md:text-[10px] font-bold text-blue-200 uppercase tracking-widest mt-1.5">Total JP</span>'
);

// 7. Performance indicator text replacement
// We had: className={`text-[10px] md:text-xs font-extrabold leading-tight uppercase tracking-widest ${performanceColor.replace('text-rose-300', 'text-white').replace('text-blue-300', 'text-white').replace('text-emerald-300', 'text-white')}`}
code = code.replace(
    /<span className=\{`text-\[10px\] md:text-xs font-extrabold leading-tight uppercase tracking-widest \$\{performanceColor[^}]*\}\}>\s*\{performanceStatus\}\s*<\/span>/,
    `<div className={\`inline-flex items-center px-3 py-1.5 rounded-full border backdrop-blur-md \${performanceColor}\`}>\n                                        <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest">{performanceStatus}</span>\n                                    </div>`
);

fs.writeFileSync(file, code);
