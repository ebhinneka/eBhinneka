const fs = require('fs');
const file = './pages/PublicDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    'className="text-blue-100/60 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors -mr-2"',
    'className="text-orange-100 hover:text-white p-2 rounded-full hover:bg-white/20 transition-colors -mr-2"'
);

fs.writeFileSync(file, code);
