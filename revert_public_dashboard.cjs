const fs = require('fs');
const file = './pages/PublicDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

// Revert main card
code = code.replace(
    'bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20 w-full max-w-sm mb-6 transform transition-all hover:scale-[1.02]',
    'bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-2xl border border-white/40 dark:border-slate-700 w-full max-w-sm mb-6 transform transition-all hover:scale-[1.02]'
);

code = code.replace(
    'className="text-white/80 text-sm font-bold tracking-widest uppercase mb-1"',
    'className="text-slate-500 dark:text-blue-100/70 text-sm font-bold tracking-widest uppercase mb-1"'
);

code = code.replace(
    'className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter drop-shadow-md"',
    'className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tighter drop-shadow-md"'
);

code = code.replace(
    'className="text-white/80 font-medium"',
    'className="text-slate-600 dark:text-blue-100/70 font-medium"'
);

code = code.replace(
    'bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20 w-full max-w-sm relative overflow-hidden',
    'bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-2xl border border-white/40 dark:border-slate-700 w-full max-w-sm relative overflow-hidden'
);

code = code.replace(
    'className="text-white text-lg font-extrabold mb-5 flex items-center gap-2"',
    'className="text-slate-800 dark:text-white text-lg font-extrabold mb-5 flex items-center gap-2"'
);

code = code.replace(
    'className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/30 transition-all"',
    'className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all"'
);

code = code.replace(
    'className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/30 transition-all"',
    'className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all"'
);

// Revert Modal Selection bg
code = code.replace(
    'bg-white/10 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/30 overflow-hidden relative animate-fade-in transition-colors',
    'bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-700 overflow-hidden relative animate-fade-in transition-colors'
);

code = code.replace(
    'className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"',
    'className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-white dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 p-5 rounded-3xl shadow-sm hover:shadow-md flex items-center gap-5 transition-all group"'
);

code = code.replace(
    'className="text-lg font-extrabold text-white"',
    'className="text-lg font-extrabold text-slate-800 dark:text-white"'
);

code = code.replace(
    'className="w-16 h-16 rounded-full bg-white/20 text-white shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"',
    'className="w-16 h-16 rounded-full bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"'
);

code = code.replace(
    'className="w-16 h-16 rounded-full bg-white/20 text-white shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"',
    'className="w-16 h-16 rounded-full bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"'
);

code = code.replace(
    'className="text-lg font-extrabold text-white"',
    'className="text-lg font-extrabold text-slate-800 dark:text-white"'
);

code = code.replace(
    'className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"',
    'className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-white dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 p-5 rounded-3xl shadow-sm hover:shadow-md flex items-center gap-5 transition-all group"'
);

code = code.replace(
    'className="text-lg font-extrabold text-white"',
    'className="text-lg font-extrabold text-slate-800 dark:text-white"'
);

code = code.replace(
    'className="w-16 h-16 rounded-full bg-white/20 text-white shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"',
    'className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"'
);

code = code.replace(
    'className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"',
    'className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-white dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 p-5 rounded-3xl shadow-sm hover:shadow-md flex items-center gap-5 transition-all group"'
);

// Modal Header
code = code.replace(
    'className="text-lg font-bold text-white"',
    'className="text-lg font-bold text-slate-800 dark:text-white"'
);
code = code.replace(
    'className="p-3 bg-white/20 text-white rounded-full mb-2"',
    'className="p-3 bg-slate-900 text-white rounded-full mb-2"'
);

code = code.replace(
    'className="pl-12 block w-full bg-white  border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3.5 text-white text-sm font-bold transition-all placeholder:text-gray-300 dark:placeholder:text-slate-600 placeholder:font-normal"',
    'className="pl-12 block w-full border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3.5 text-slate-700 dark:text-white text-sm font-bold transition-all placeholder:text-gray-400"'
);

code = code.replace(
    'className="pl-12 pr-12 block w-full bg-white  border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3.5 text-white text-sm font-bold transition-all placeholder:text-gray-300 dark:placeholder:text-slate-600 placeholder:font-normal"',
    'className="pl-12 pr-12 block w-full border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3.5 text-slate-700 dark:text-white text-sm font-bold transition-all placeholder:text-gray-400"'
);

code = code.replace(
    'className="w-full bg-[#3B82F6] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-200 dark:shadow-none mt-4 active:translate-y-0.5"',
    'className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg mt-4"'
);

fs.writeFileSync(file, code);
