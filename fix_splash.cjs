const fs = require('fs');

let code = fs.readFileSync('components/SplashScreen.tsx', 'utf8');

// Change background from blue to white/slate-50
code = code.replace(/bg-\[#3988d8\]/g, 'bg-slate-50 dark:bg-slate-900');
// Change decorative circle from white to blueish
code = code.replace(/bg-slate-100\/15/g, 'bg-blue-600/5 dark:bg-blue-500/10');
// Change text color from slate-100 to dark
code = code.replace(/text-slate-100 text-center/g, 'text-slate-800 dark:text-slate-100 text-center');
// Add blue text to eBhinneka
code = code.replace(/text-3xl font-extrabold tracking-widest drop-shadow-lg/g, 'text-3xl font-extrabold tracking-widest text-blue-700 dark:text-blue-500 drop-shadow-sm');
code = code.replace(/text-sm font-bold opacity-80/g, 'text-sm font-bold text-slate-500 dark:text-slate-400 opacity-90');

fs.writeFileSync('components/SplashScreen.tsx', code);
console.log("Fixed splash");
