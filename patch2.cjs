const fs = require('fs');

const replaceInFile = (file, regex, replacement, requiresImport) => {
    let content = fs.readFileSync(file, 'utf-8');
    if (requiresImport && !content.includes('fetchAllStudents')) {
        content = content.replace(/import \{ supabase([\s\S]*?)\} from '\.\.\/services\/supabase';/, "import { supabase$1, fetchAllStudents } from '../services/supabase';");
    }
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
};

// InputManual.tsx
replaceInFile('pages/InputManual.tsx', 
    /let \{ data: allStudents, error: errSt \} = await supabase[\s\S]*?if \(errSt\) \{\n[\s\S]*?console\.error\(errSt\);\n[\s\S]*?\}\n[\s\S]*?if \(allStudents\) \{/g,
    `let allStudents = await fetchAllStudents(academicYear || '2025/2026');\n          if (allStudents) {`,
    true
);

console.log("InputManual Done");
