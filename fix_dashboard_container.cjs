const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    'className="bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-6 md:p-8 text-white shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/10 relative overflow-hidden"',
    'className="bg-white/10 backdrop-blur-2xl rounded-[2rem] p-6 md:p-8 text-white shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/20 relative overflow-hidden"'
);

fs.writeFileSync(file, code);
