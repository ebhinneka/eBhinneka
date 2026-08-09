const fs = require('fs');

const replaceInFile = (file, regex, replacement, requiresImport) => {
    let content = fs.readFileSync(file, 'utf-8');
    if (requiresImport && !content.includes('fetchAllStudents')) {
        content = content.replace(/import \{ supabase([\s\S]*?)\} from '\.\.\/services\/supabase';/, "import { supabase$1, fetchAllStudents } from '../services/supabase';");
    }
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
};

// ImportData.tsx
replaceInFile('pages/ImportData.tsx', 
    /const \{ data: existing \} = await supabase\.from\('students'\)\.select\('id, nisn'\)\.eq\('academic_year', target\);/g,
    `const existing = await fetchAllStudents(target);`,
    true
);

console.log("Done ImportData");
