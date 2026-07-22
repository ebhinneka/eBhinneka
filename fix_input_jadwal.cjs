const fs = require('fs');
let content = fs.readFileSync('pages/InputJadwal.tsx', 'utf8');

content = content.replace(
    "const { academicYear, semester , activeScheduleVersion } = useAuth();",
    "const { academicYear, semester , activeScheduleVersion, availableClasses } = useAuth();"
);

// We want to replace the hardcoded array in both formData.kelas and editFormData.kelas.
// The hardcoded string: {['7', '8', '9'].map(level => (['A','B','C','D','E','F','G','H'].map(paralel => (<option key={`${level}${paralel}`} value={`${level}${paralel}`}>{level}{paralel}</option>))))}
// Since we have availableClasses, we can just map it.

content = content.replace(
    /\{\[\'7\', \'8\', \'9\'\]\.map\(level => \(\[\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\'\]\.map\(paralel => \(<option key=\{\`\$\{level\}\$\{paralel\}\`\} value=\{\`\$\{level\}\$\{paralel\}\`\}>\{level\}\{paralel\}<\/option>\)\)\)\)\}/g,
    "{availableClasses.map(c => (<option key={c} value={c}>{c}</option>))}"
);

fs.writeFileSync('pages/InputJadwal.tsx', content);
