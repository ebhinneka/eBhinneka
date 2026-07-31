const fs = require('fs');

let code = fs.readFileSync('pages/Login.tsx', 'utf8');

code = code.replace(/bg-transparent/g, 'bg-slate-50 dark:bg-slate-900');
code = code.replace(/text-slate-100 font-bold text-sm mb-2/g, 'text-slate-500 font-bold text-sm mb-2'); // Fix text-blue-100 or something?

fs.writeFileSync('pages/Login.tsx', code);
console.log("Fixed Login");
