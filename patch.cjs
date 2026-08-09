const fs = require('fs');
let code = fs.readFileSync('pages/PublicDashboard.tsx', 'utf-8');
code = code.replace(/let allStudents: any\[\] = \[\];[\s\S]*?let cMap: Record<string, string> = \{\};/, 
  'let allStudents = await fetchAllStudents(academicYear || \'2025/2026\');\n\n          let cMap: Record<string, string> = {};');
fs.writeFileSync('pages/PublicDashboard.tsx', code);
