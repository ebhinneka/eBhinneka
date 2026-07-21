const fs = require('fs');
const file = './pages/PublicDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

// Header card
code = code.replace(
    '<div className="bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-[2rem] p-5 flex items-center justify-between shadow-xl text-white relative overflow-hidden">',
    '<div className="bg-white/10 backdrop-blur-2xl rounded-[2rem] p-5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/20 text-white relative overflow-hidden">'
);

// eBhinneka text
code = code.replace(
    '<p className="text-xs font-bold text-orange-100 mt-1 drop-shadow-sm">eBhinneka</p>',
    '<p className="text-xs font-bold text-blue-200 mt-1 drop-shadow-sm">eBhinneka</p>'
);

// Date text
code = code.replace(
    '<p className="text-xs font-medium text-orange-100 mb-0.5">{formatDateIndo(time)}</p>',
    '<p className="text-xs font-medium text-blue-200 mb-0.5">{formatDateIndo(time)}</p>'
);

// Login Modal
code = code.replace(
    '<div className="w-full max-w-sm bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-[2rem] shadow-2xl border border-white/40 dark:border-slate-700 overflow-hidden relative animate-fade-in transition-colors">',
    '<div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-white/20 overflow-hidden relative animate-fade-in transition-colors">'
);
// In modal
code = code.replace(
    '<p className="text-xs text-orange-100 font-bold opacity-90">Masuk untuk mengisi jurnal & absensi.</p>',
    '<p className="text-xs text-blue-200 font-bold opacity-90">Masuk untuk mengisi jurnal & absensi.</p>'
);
code = code.replace(
    '<p className="text-xs text-orange-100 font-bold opacity-90">Dashboard monitoring jadwal real-time.</p>',
    '<p className="text-xs text-blue-200 font-bold opacity-90">Dashboard monitoring jadwal real-time.</p>'
);
code = code.replace(
    '<p className="text-xs text-orange-100 font-bold opacity-90">Pengaturan sistem dan data master.</p>',
    '<p className="text-xs text-blue-200 font-bold opacity-90">Pengaturan sistem dan data master.</p>'
);
code = code.replace(
    /text-orange-200 group-hover:text-white/g,
    'text-blue-300 group-hover:text-white'
);
code = code.replace(
    'className="text-xs text-orange-100 font-bold"',
    'className="text-xs text-blue-200 font-bold"'
);
code = code.replace(
    'placeholder:text-orange-200 placeholder:font-normal',
    'placeholder:text-blue-300/70 placeholder:font-normal'
);
code = code.replace(
    'placeholder:text-orange-200 placeholder:font-normal',
    'placeholder:text-blue-300/70 placeholder:font-normal'
);
code = code.replace(
    'className="text-orange-100 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2"',
    'className="text-blue-200 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2"'
);
code = code.replace(
    'className="text-orange-100 hover:text-white p-2 rounded-full hover:bg-white/20 transition-colors -mr-2"',
    'className="text-blue-200 hover:text-white p-2 rounded-full hover:bg-white/20 transition-colors -mr-2"'
);
code = code.replace(
    'text-orange-100 hover:text-white',
    'text-blue-200 hover:text-white'
);

code = code.replace(
    'from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-2 border-orange-400',
    'from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 border-2 border-blue-400'
);

fs.writeFileSync(file, code);
