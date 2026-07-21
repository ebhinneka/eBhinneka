const fs = require('fs');
const file = './pages/PublicDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'bg-gradient-to-br from-[#2E8BF0] to-[#1C6DD0]',
  'bg-transparent'
);

fs.writeFileSync(file, code);
