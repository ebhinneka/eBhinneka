const fs = require('fs');
let code = fs.readFileSync('pages/InputManual.tsx', 'utf-8');
code = code.replace(/let \{ data: allStudents, error: errSt \} = await supabase[\s\S]*?else allStudents = \[\];\n          \}/, 
  'let allStudents = await fetchAllStudents(academicYear || \'2025/2026\');');
fs.writeFileSync('pages/InputManual.tsx', code);
