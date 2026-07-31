const fs = require('fs');

let code = fs.readFileSync('pages/Dashboard.tsx', 'utf8');

// Replace header bg-gradient from previous if any
code = code.replace(
    /className="bg-slate-100\/10 backdrop-blur-2xl([^"]*)"/g, 
    'className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 rounded-[2rem] p-5 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-xl border-none text-white relative overflow-hidden"'
);

// Replace hardcoded bg-slate-100 with bg-white in general for light theme
// It might be risky, but we can target specific large containers
code = code.replace(/bg-slate-100 dark:bg-slate-900 rounded-3xl/g, 'bg-white dark:bg-slate-900 rounded-3xl');
code = code.replace(/bg-slate-100 dark:bg-slate-900 rounded-2xl/g, 'bg-white dark:bg-slate-900 rounded-2xl');

fs.writeFileSync('pages/Dashboard.tsx', code);
console.log("Fixed Dashboard.tsx background");
