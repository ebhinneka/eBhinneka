const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    '        {/* MAIN WIDGETS */}',
    '        </div>\n        {/* MAIN WIDGETS */}'
);

fs.writeFileSync(file, code);
