const fs = require('fs');

let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(/text-blue-100 font-bold text-sm mb-2/g, 'text-blue-600 dark:text-blue-400 font-bold text-sm mb-2');
code = code.replace(/text-slate-100/g, 'text-slate-800 dark:text-slate-100'); // Check if there are other text-slate-100 in App.tsx (like the academic year text)

// Wait, doing global text-slate-100 might break buttons (e.g. Masuk Aplikasi button text-slate-100)
// Let's be more specific.

code = fs.readFileSync('App.tsx', 'utf8');
code = code.replace(/text-blue-100 font-bold text-sm mb-2/g, 'text-blue-600 dark:text-blue-400 font-bold text-sm mb-2');
code = code.replace(/bg-transparent/g, 'bg-slate-50 dark:bg-slate-900');
code = code.replace(/text-slate-100">Tahun Ajaran/g, 'text-slate-800 dark:text-slate-100">Tahun Ajaran');

fs.writeFileSync('App.tsx', code);
console.log("Fixed App.tsx");
