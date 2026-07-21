const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    /\)\}[\s\n]*<\/div><\/div>[\s\n]*<\/div>[\s\n]*<\/div>[\s\n]*\{\/\* MAIN WIDGETS \*\/\}/g,
    ')}\n            </div>\n        </div>\n\n        {/* MAIN WIDGETS */}'
);
fs.writeFileSync(file, code);
