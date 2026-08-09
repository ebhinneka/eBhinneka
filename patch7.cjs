const fs = require('fs');

const replaceInFile = (file, regex, replacement, requiresImport) => {
    let content = fs.readFileSync(file, 'utf-8');
    if (requiresImport && !content.includes('fetchAllStudents')) {
        content = content.replace(/import \{ supabase([\s\S]*?)\} from '\.\.\/services\/supabase';/, "import { supabase$1, fetchAllStudents } from '../services/supabase';");
    }
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
};

// JurnalForm.tsx
replaceInFile('pages/JurnalForm.tsx', 
    /let \{ data: studentData, error: errSt \} = await supabase\.from\('students'\)[\s\S]*?else studentData = \[\];\n        \}/g,
    `let studentData = await fetchAllStudents(academicYear || '2025/2026');`,
    true
);

console.log("Done JurnalForm");
