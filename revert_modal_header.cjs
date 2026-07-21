const fs = require('fs');
const file = './pages/PublicDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    '<h3 className="font-extrabold text-white text-lg leading-tight">{modalContent.title}</h3>',
    '<h3 className="font-extrabold text-slate-800 dark:text-white text-lg leading-tight">{modalContent.title}</h3>'
);

fs.writeFileSync(file, code);
