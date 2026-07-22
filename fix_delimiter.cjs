const fs = require('fs');
let content = fs.readFileSync('pages/ImportData.tsx', 'utf8');

// replace delimiter: ';', with nothing
content = content.replace("delimiter: ';',", "");

fs.writeFileSync('pages/ImportData.tsx', content);
