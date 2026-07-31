const fs = require('fs');
let code = fs.readFileSync('pages/Dashboard.tsx', 'utf8');

code = code.replace(/created_by: profile.id,/g, "created_by: profile.id, academic_year: academicYear || '2025/2026', semester: semester || 'Ganjil',");

fs.writeFileSync('pages/Dashboard.tsx', code);
console.log("Fixed Dashboard.tsx");
