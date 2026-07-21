const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    'bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] p-6 md:p-8 text-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20 relative overflow-hidden',
    'bg-slate-900 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] p-6 md:p-8 text-white shadow-xl relative overflow-hidden'
);

code = code.replace(
    'className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden bg-white/10 flex items-center justify-center p-0.5"',
    'className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/30 shadow-lg overflow-hidden bg-white/10 flex items-center justify-center p-0.5"'
);

fs.writeFileSync(file, code);
