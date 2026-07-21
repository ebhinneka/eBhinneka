const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /            <\/div><\/div>\n        <\/div>\n        <\/div>\n        \{\/\* MAIN WIDGETS \*\/\}/;

code = code.replace(regex, '            </div>\n        </div>\n\n        {/* MAIN WIDGETS */}');
fs.writeFileSync(file, code);
