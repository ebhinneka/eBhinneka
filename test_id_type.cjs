const fs = require('fs');
let content = fs.readFileSync('pages/InputJadwal.tsx', 'utf8');
content = content.replace(
    /const id = e\.target\.value;/g,
    "const id = e.target.value; console.log('Teacher changed, id:', id, typeof id);"
);
fs.writeFileSync('pages/InputJadwal.tsx', content);
