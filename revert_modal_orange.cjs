const fs = require('fs');
const file = './pages/PublicDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    'className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-700 overflow-hidden relative animate-fade-in transition-colors"',
    'className="w-full max-w-sm bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-[2rem] shadow-2xl border border-white/40 dark:border-slate-700 overflow-hidden relative animate-fade-in transition-colors"'
);

// Guru
code = code.replace(
    'className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-white dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 p-5 rounded-3xl shadow-sm hover:shadow-md flex items-center gap-5 transition-all group"',
    'className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"'
);
code = code.replace(
    'className="w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner"',
    'className="w-16 h-16 rounded-full bg-white/20 text-white shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"'
);
code = code.replace(
    'className="text-lg font-extrabold text-slate-800 dark:text-white"',
    'className="text-lg font-extrabold text-white"'
);
code = code.replace(
    'className="text-xs text-blue-100/70 font-bold"',
    'className="text-xs text-orange-100 font-bold opacity-90"'
);
code = code.replace(
    'className="ml-auto text-blue-200 group-hover:text-white"',
    'className="ml-auto text-orange-200 group-hover:text-white"'
);

// Operator
code = code.replace(
    'className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-white dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 p-5 rounded-3xl shadow-sm hover:shadow-md flex items-center gap-5 transition-all group"',
    'className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"'
);
code = code.replace(
    'className="w-16 h-16 rounded-full bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"',
    'className="w-16 h-16 rounded-full bg-white/20 text-white shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"'
);
code = code.replace(
    'className="text-lg font-extrabold text-slate-800 dark:text-white"',
    'className="text-lg font-extrabold text-white"'
);
code = code.replace(
    'className="text-xs text-slate-500 dark:text-blue-100/60 font-medium"',
    'className="text-xs text-orange-100 font-bold opacity-90"'
);
code = code.replace(
    'className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-orange-500"',
    'className="ml-auto text-orange-200 group-hover:text-white"'
);

// Admin
code = code.replace(
    'className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-white dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 p-5 rounded-3xl shadow-sm hover:shadow-md flex items-center gap-5 transition-all group"',
    'className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"'
);
code = code.replace(
    'className="w-16 h-16 rounded-full bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"',
    'className="w-16 h-16 rounded-full bg-white/20 text-white shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"'
);
code = code.replace(
    'className="text-lg font-extrabold text-slate-800 dark:text-white"',
    'className="text-lg font-extrabold text-white"'
);
code = code.replace(
    'className="text-xs text-slate-500 dark:text-blue-100/60 font-medium"',
    'className="text-xs text-orange-100 font-bold opacity-90"'
);
code = code.replace(
    'className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-slate-800 dark:group-hover:text-white"',
    'className="ml-auto text-orange-200 group-hover:text-white"'
);

// Form elements
code = code.replace(
    'className="text-lg font-bold text-slate-800 dark:text-white"',
    'className="text-lg font-bold text-white"'
);
code = code.replace(
    'className="text-xs text-slate-500 dark:text-blue-100/60"',
    'className="text-xs text-orange-100 font-bold"'
);
code = code.replace(
    'className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2"',
    'className="block text-sm font-bold text-white mb-2"'
);
code = code.replace(
    'className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2"',
    'className="block text-sm font-bold text-white mb-2"'
);
code = code.replace(
    'className="p-3 bg-slate-900 text-white rounded-full mb-2"',
    'className="p-3 bg-white/20 text-white shadow-inner rounded-full mb-2"'
);
code = code.replace(
    'className="pl-12 block w-full border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3.5 text-slate-700 dark:text-white text-sm font-bold transition-all placeholder:text-gray-400"',
    'className="pl-12 block w-full bg-white/10 backdrop-blur-md border border-white/30 rounded-xl focus:ring-2 focus:ring-white focus:border-white p-3.5 text-white text-sm font-bold transition-all placeholder:text-orange-200 placeholder:font-normal"'
);
code = code.replace(
    'className="pl-12 pr-12 block w-full border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3.5 text-slate-700 dark:text-white text-sm font-bold transition-all placeholder:text-gray-400"',
    'className="pl-12 pr-12 block w-full bg-white/10 backdrop-blur-md border border-white/30 rounded-xl focus:ring-2 focus:ring-white focus:border-white p-3.5 text-white text-sm font-bold transition-all placeholder:text-orange-200 placeholder:font-normal"'
);
code = code.replace(
    'className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg mt-4"',
    'className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/30 mt-4 active:scale-95"'
);
code = code.replace(
    'text-blue-100/60 hover:text-slate-600',
    'text-orange-100 hover:text-white'
);
code = code.replace(
    'text-blue-100/60 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700',
    'text-orange-100 hover:text-white hover:bg-white/20'
);
code = code.replace(
    'hover:bg-slate-100 dark:hover:bg-slate-700',
    'hover:bg-white/20'
);

fs.writeFileSync(file, code);
