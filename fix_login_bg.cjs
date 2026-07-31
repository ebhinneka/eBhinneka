const fs = require('fs');

let code = fs.readFileSync('App.tsx', 'utf8');
code = code.replace(/bg-slate-50 dark:bg-slate-900 transition-colors/g, 'bg-white dark:bg-slate-900 transition-colors');
fs.writeFileSync('App.tsx', code);
console.log("Fixed App bg");

let splash = fs.readFileSync('components/SplashScreen.tsx', 'utf8');
splash = splash.replace(/bg-slate-50 dark:bg-slate-900/g, 'bg-white dark:bg-slate-900');
fs.writeFileSync('components/SplashScreen.tsx', splash);
console.log("Fixed splash bg");

