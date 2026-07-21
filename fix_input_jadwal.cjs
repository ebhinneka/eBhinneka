const fs = require('fs');
let content = fs.readFileSync('pages/InputJadwal.tsx', 'utf8');
content = content.replace(
    /const nip = e\.target\.value;\s*const teacher = teachers\.find\(t => t\.nip === nip\) \|\| null;/g,
    "const id = e.target.value;\n    const teacher = teachers.find(t => t.id === id) || null;"
);
fs.writeFileSync('pages/InputJadwal.tsx', content);
