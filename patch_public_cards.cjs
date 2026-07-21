const fs = require('fs');
const file = './pages/PublicDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

// The main clock card
code = code.replace(
    'bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-white/40 dark:border-slate-700 w-full max-w-sm mb-6 transform transition-all hover:scale-[1.02]',
    'bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20 w-full max-w-sm mb-6 transform transition-all hover:scale-[1.02] text-white'
);

// Fix the text colors inside that card
code = code.replace(
    'text-gray-500 dark:text-gray-400 mb-0.5">{formatDateIndo(time)}',
    'text-blue-100/70 mb-0.5">{formatDateIndo(time)}'
);
code = code.replace(
    'text-red-600 dark:text-red-400 mb-0.5">{formatDateIndo(time)}',
    'text-blue-100/70 mb-0.5">{formatDateIndo(time)}'
);
code = code.replace(
    'text-2xl font-bold text-red-600 font-mono tracking-tight leading-none',
    'text-3xl font-extrabold text-white font-mono tracking-tight leading-none drop-shadow-md'
);

// Action Button "Login Sebagai"
// Replace the previous orange button with a very elegant glassy one
const oldLoginBtn = /<div className="glow-border-container">[\s\S]*?<span className="glowing-text text-white">Login Sebagai<\/span>[\s\S]*?<\/button>\s*<\/div>/;
const newLoginBtn = `<button 
                        onClick={() => setShowLoginModal(true)} 
                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/30 transition-all"
                    >
                        <LogIn size={24} className="stroke-[2.5]" /> 
                        <span>Login Sebagai</span>
                    </button>`;
code = code.replace(oldLoginBtn, newLoginBtn);

// Secondary actions card
code = code.replace(
    'bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-5 shadow-xl border border-white/40 dark:border-slate-700 flex items-center justify-between w-full max-w-sm transform transition-all hover:scale-[1.02] group',
    'bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-5 shadow-lg border border-white/20 flex items-center justify-between w-full max-w-sm transform transition-all hover:scale-[1.02] group'
);
code = code.replace(
    'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
    'bg-white/20 text-white'
);
code = code.replace(
    'text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400',
    'text-white drop-shadow-sm'
);
code = code.replace(
    'text-slate-500 dark:text-slate-400',
    'text-blue-100/70'
);
code = code.replace(
    'text-slate-300 dark:text-slate-600 group-hover:text-blue-500',
    'text-blue-200 group-hover:text-white'
);

// Fix login modal selection cards to be elegant glassy instead of orange
code = code.replace(
    'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-2 border-orange-400',
    'bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30'
);
code = code.replace(
    'text-xs text-orange-50 font-bold opacity-90',
    'text-xs text-blue-100/70 font-bold'
);
code = code.replace(
    'text-orange-200 group-hover:text-white',
    'text-blue-200 group-hover:text-white'
);

code = code.replace(
    /className="bg-white dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border-2 border-transparent hover:border-orange-300 dark:hover:border-orange-500\/50 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"/g,
    'className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"'
);

code = code.replace(
    /className="bg-white dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border-2 border-transparent hover:border-slate-400 dark:hover:border-slate-500\/50 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"/g,
    'className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"'
);

code = code.replace(
    'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400',
    'bg-white/20 text-white shadow-inner'
);
code = code.replace(
    'bg-slate-800 dark:bg-slate-700 text-white',
    'bg-white/20 text-white shadow-inner'
);
code = code.replace(
    /text-slate-800 dark:text-white group-hover:text-orange-700 dark:group-hover:text-orange-400/g,
    'text-white'
);
code = code.replace(
    /text-slate-800 dark:text-white/g,
    'text-white'
);

fs.writeFileSync(file, code);
