const fs = require('fs');
const file = './pages/PublicDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    'className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all"',
    'className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-2 border-orange-400 text-white font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all"'
);

fs.writeFileSync(file, code);
