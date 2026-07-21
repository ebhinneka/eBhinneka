const fs = require('fs');
let code = fs.readFileSync('components/Layout.tsx', 'utf8');

code = code.replace(/bg-white\/95/g, 'bg-slate-100/95');
code = code.replace(/bg-white\/90/g, 'bg-slate-100/90');
code = code.replace(/border-white\/50/g, 'border-slate-100/50');
code = code.replace(/border-slate-200\/50/g, 'border-blue-300/50');

fs.writeFileSync('components/Layout.tsx', code);
