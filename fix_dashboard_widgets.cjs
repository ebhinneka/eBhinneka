const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace standard white cards with glassmorphism .app-card
code = code.replace(
    /className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden/g,
    'className="app-card rounded-[24px] p-5 relative overflow-hidden border border-white/40 dark:border-white/10'
);

code = code.replace(
    /className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden/g,
    'className="app-card rounded-[24px] p-6 relative overflow-hidden border border-white/40 dark:border-white/10'
);

// We need to also adjust any other nested bg-white in these widgets to bg-white/50 or similar to let glassmorphism show through.
code = code.replace(
    /className="mb-2 p-4 border-2 border-blue-100 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-800 animate-fade-in shadow-sm"/g,
    'className="mb-2 p-4 border-2 border-blue-200/50 dark:border-slate-600/50 rounded-[20px] bg-white/50 dark:bg-slate-800/50 backdrop-blur-md animate-fade-in shadow-sm"'
);

fs.writeFileSync(file, code);
