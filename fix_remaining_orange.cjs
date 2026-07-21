const fs = require('fs');

const f1 = './pages/Dashboard.tsx';
let c1 = fs.readFileSync(f1, 'utf8');
c1 = c1.replace(/orange/g, 'amber');
fs.writeFileSync(f1, c1);

const f2 = './pages/PublicDashboard.tsx';
let c2 = fs.readFileSync(f2, 'utf8');
c2 = c2.replace(/orange-500/g, 'blue-500');
c2 = c2.replace(/orange-400/g, 'blue-400');
fs.writeFileSync(f2, c2);
