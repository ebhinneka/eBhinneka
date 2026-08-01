const fs = require('fs');

let code = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');

// Add studentNameMap state
code = code.replace(
    /const \[studentClassMap, setStudentClassMap\] = useState<Record<string, string>>\(\{\}\);/g,
    "const [studentClassMap, setStudentClassMap] = useState<Record<string, string>>({});\n  const [studentNameMap, setStudentNameMap] = useState<Record<string, string>>({});"
);

// Update students fetch to select name
code = code.replace(
    /let res = await supabase.from\('students'\).select\('id, kelas'\).eq\('academic_year', academicYear \|\| '2025\/2026'\).range\(/g,
    "let res = await supabase.from('students').select('id, name, kelas').eq('academic_year', academicYear || '2025/2026').range("
);
code = code.replace(
    /res = await supabase.from\('students'\).select\('id, kelas'\).eq\('academic_year', academicYear \|\| '2025\/2026'\).range\(/g,
    "res = await supabase.from('students').select('id, name, kelas').eq('academic_year', academicYear || '2025/2026').range("
);

// Update sClassMap population
code = code.replace(
    /const sClassMap: Record<string, string> = \{\};/g,
    "const sClassMap: Record<string, string> = {};\n        const sNameMap: Record<string, string> = {};"
);
code = code.replace(
    /sClassMap\[s.id\] = rawKelas;/g,
    "sClassMap[s.id] = rawKelas;\n                if (s.name) sNameMap[s.id] = s.name;"
);
code = code.replace(
    /setStudentClassMap\(sClassMap\);/g,
    "setStudentClassMap(sClassMap);\n        setStudentNameMap(sNameMap);"
);

// Update getAbsentStudentsForClass
code = code.replace(
    /name: s.name === 'Loading\.\.\.' \? 'Siswa \(Data Wali\)' : s.name,/g,
    "name: (s.name === 'Loading...' || s.name === 'Unknown') ? (studentNameMap[s.student_id] || 'Siswa (Data Wali)') : s.name,"
);

fs.writeFileSync('pages/PublicDashboard.tsx', code);
console.log("Fixed PublicDashboard names");
