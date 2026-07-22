const fs = require('fs');
let content = fs.readFileSync('pages/ImportData.tsx', 'utf8');

const oldPapa = `const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: ';'
    });`;
const newPapa = `const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: ';',
        transformHeader: (h) => h.trim(),
        transform: (v) => (typeof v === 'string' ? v.trim() : v)
    });`;

content = content.replace(oldPapa, newPapa);
fs.writeFileSync('pages/ImportData.tsx', content);
