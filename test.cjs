const fs = require('fs');
console.log(fs.readFileSync('pages/JurnalForm.tsx', 'utf8').split('\n').slice(231, 241).join('\n'));
