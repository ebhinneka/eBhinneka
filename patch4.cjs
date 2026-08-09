const fs = require('fs');

const replaceInFile = (file, regex, replacement, requiresImport) => {
    let content = fs.readFileSync(file, 'utf-8');
    if (requiresImport && !content.includes('fetchAllStudents')) {
        content = content.replace(/import \{ supabase([\s\S]*?)\} from '\.\.\/services\/supabase';/, "import { supabase$1, fetchAllStudents } from '../services/supabase';");
    }
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
};

// StudentsData.tsx
replaceInFile('pages/StudentsData.tsx', 
    /let query = supabase\.from\('students'\)[\s\S]*?setStudents\(data \|\| \[\]\);/g,
    `let all = await fetchAllStudents(academicYear || '2025/2026');
      if (filterClass) all = all.filter(s => s.kelas === filterClass);
      
      // Sort
      all.sort((a, b) => {
          if (a.kelas !== b.kelas) return (a.kelas || '').localeCompare(b.kelas || '');
          return (a.name || '').localeCompare(b.name || '');
      });
      setStudents(all);`,
    true
);

console.log("Done StudentsData");
