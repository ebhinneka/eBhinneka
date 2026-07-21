const fs = require('fs');
const file = './index.html';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'transition: background-color 0.3s ease, border-color 0.3s ease;\n      }',
  'transition: background-color 0.3s ease, border-color 0.3s ease;\n        color: #1e293b;\n      }'
);

fs.writeFileSync(file, code);
