const fs = require('fs');

let code = fs.readFileSync('pages/Dashboard.tsx', 'utf8');

code = code.replace(/bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-700/g, 'app-card p-4 md:p-6');
code = code.replace(/bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/g, 'app-card p-5');

code = code.replace(/bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/g, 'app-card p-6');

fs.writeFileSync('pages/Dashboard.tsx', code);
console.log("Updated Dashboard.tsx to use app-card");
