const fs = require('fs');

let code = fs.readFileSync('components/Layout.tsx', 'utf8');

code = code.replace(/bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/g, 'bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-[2px_0_10px_-2px_rgba(0,0,0,0.05)]');
code = code.replace(/bg-slate-100\/80 backdrop-blur-md/g, 'bg-white/90 backdrop-blur-md');
code = code.replace(/bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 z-30 shadow-sm/g, 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 z-30 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)]');

fs.writeFileSync('components/Layout.tsx', code);
console.log("Fixed Layout.tsx");
