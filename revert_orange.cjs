const fs = require('fs');

const file1 = './pages/PublicDashboard.tsx';
let code1 = fs.readFileSync(file1, 'utf8');

code1 = code1.replace(
    '        {/* HEADER CARD */}\n        <div className="app-card p-5 flex items-center justify-between">',
    '        {/* HEADER CARD */}\n        <div className="bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-[2rem] p-5 flex items-center justify-between shadow-xl text-white relative overflow-hidden">'
);
code1 = code1.replace(
    '             <div className="flex items-center gap-3">\n                 <img src="https://www.smpbhinnekatunggalika.sch.id/upload/imagecache/24871901smp-100x100.png" alt="Logo" className="h-14 w-auto object-contain" />',
    '             <div className="flex items-center gap-3 relative z-10">\n                 <img src="https://www.smpbhinnekatunggalika.sch.id/upload/imagecache/24871901smp-100x100.png" alt="Logo" className="h-14 w-auto object-contain bg-white/20 p-1 rounded-full shadow-inner backdrop-blur-md" />'
);
code1 = code1.replace(
    '                    <h1 className="text-md font-extrabold text-white leading-tight">SMP BHINNEKA <br/> TUNGGAL IKA</h1>',
    '                    <h1 className="text-md font-extrabold text-white leading-tight drop-shadow-sm">SMP BHINNEKA <br/> TUNGGAL IKA</h1>'
);
code1 = code1.replace(
    '                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">eBhinneka</p>',
    '                    <p className="text-xs font-bold text-orange-100 mt-1 drop-shadow-sm">eBhinneka</p>'
);
code1 = code1.replace(
    '             <div className="text-right">',
    '             <div className="text-right relative z-10">'
);
code1 = code1.replace(
    '                <p className="text-xs font-medium text-blue-100/70 mb-0.5">{formatDateIndo(time)}</p>',
    '                <p className="text-xs font-medium text-orange-100 mb-0.5">{formatDateIndo(time)}</p>'
);

fs.writeFileSync(file1, code1);

const file2 = './pages/Dashboard.tsx';
let code2 = fs.readFileSync(file2, 'utf8');
code2 = code2.replace(
    '        <div className="bg-slate-900 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] p-6 md:p-8 text-white shadow-xl relative overflow-hidden">',
    '        <div className="bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-[2rem] p-6 md:p-8 text-white shadow-xl relative overflow-hidden">'
);
code2 = code2.replace(
    ' className="text-blue-50 text-sm font-bold opacity-80 mb-0.5 tracking-wide"',
    ' className="text-orange-50 text-sm font-bold opacity-90 mb-0.5 tracking-wide"'
);
code2 = code2.replace(
    ' className="text-blue-100/70 text-sm font-mono font-medium mb-3"',
    ' className="text-orange-100 text-sm font-mono font-medium mb-3"'
);
code2 = code2.replace(
    ' bg-blue-500/30 backdrop-blur-md text-white border border-blue-400/50',
    ' bg-blue-600/90 backdrop-blur-md text-white border border-blue-500/50'
);
code2 = code2.replace(
    ' className="text-[11px] font-bold text-blue-100/70 mb-2 uppercase tracking-widest text-center md:text-right"',
    ' className="text-[11px] font-bold text-orange-50 mb-2 uppercase tracking-widest text-center md:text-right"'
);
code2 = code2.replace(
    ' bg-white/5 rounded-2xl border border-white/10 ',
    ' bg-white/10 rounded-2xl border border-white/20 '
);
code2 = code2.replace(
    ' divide-white/10',
    ' divide-white/20'
);
code2 = code2.replace(
    ' className="text-[9px] md:text-[10px] font-bold text-blue-100/70 uppercase tracking-widest mt-1.5">Pertemuan</span>',
    ' className="text-[9px] md:text-[10px] font-bold text-orange-50 uppercase tracking-widest mt-1.5">Pertemuan</span>'
);
code2 = code2.replace(
    ' className="text-[9px] md:text-[10px] font-bold text-blue-100/70 uppercase tracking-widest mt-1.5">Total JP</span>',
    ' className="text-[9px] md:text-[10px] font-bold text-orange-50 uppercase tracking-widest mt-1.5">Total JP</span>'
);
code2 = code2.replace(
    ' className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/30 shadow-lg overflow-hidden bg-white/10 flex items-center justify-center p-0.5"',
    ' className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/20 shadow-inner overflow-hidden bg-white/10 flex items-center justify-center p-0.5"'
);

fs.writeFileSync(file2, code2);
