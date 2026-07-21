const fs = require('fs');
const file = './pages/PublicDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace the white login modal background with elegant glassmorphism
code = code.replace(
    'bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-700',
    'bg-white/10 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/30'
);

// Fix title colors inside the login form
code = code.replace(
    'text-2xl font-black text-slate-800 dark:text-white',
    'text-2xl font-black text-white drop-shadow-md'
);
code = code.replace(
    'text-sm text-slate-500 dark:text-slate-400 font-medium',
    'text-sm text-blue-100/80 font-medium tracking-wide'
);

// Fix inputs
code = code.replace(
    /className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700\/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 dark:text-white"/g,
    'className="w-full pl-11 pr-4 py-3.5 bg-white/10 dark:bg-slate-800/50 border border-white/20 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-blue-100/50"'
);

// Fix input icons
code = code.replace(
    /text-slate-400/g,
    'text-blue-100/60'
);

// Fix labels
code = code.replace(
    /text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider/g,
    'text-xs font-bold text-white uppercase tracking-wider'
);

// Fix submit button
code = code.replace(
    'w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-blue-500/30',
    'w-full bg-white text-blue-600 font-extrabold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-blue-50 hover:scale-[1.02]'
);
code = code.replace(
    'w-full bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-xl transition-all',
    'w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3.5 rounded-xl transition-all'
);

fs.writeFileSync(file, code);
