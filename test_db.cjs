const fs = require('fs');
let code = fs.readFileSync('pages/Dashboard.tsx', 'utf8');

code = code.replace(
    /\.eq\('academic_year', academicYear \|\| '2025\/2026'\)\.eq\('semester', semester \|\| 'Ganjil'\)/g,
    ''
);

fs.writeFileSync('pages/Dashboard.tsx', code);

code = fs.readFileSync('pages/OperatorDashboard.tsx', 'utf8');
code = code.replace(
    /\.eq\('academic_year', academicYear \|\| '2025\/2026'\)\.eq\('semester', semester \|\| 'Ganjil'\)/g,
    ''
);
fs.writeFileSync('pages/OperatorDashboard.tsx', code);

code = fs.readFileSync('pages/AbsensiRapor.tsx', 'utf8');
code = code.replace(
    /\.eq\('academic_year', academicYear \|\| '2025\/2026'\)\.eq\('semester', semester \|\| 'Ganjil'\)/g,
    ''
);
fs.writeFileSync('pages/AbsensiRapor.tsx', code);

code = fs.readFileSync('pages/Kedisiplinan.tsx', 'utf8');
code = code.replace(
    /\.eq\('academic_year', academicYear \|\| '2025\/2026'\)\.eq\('semester', semester \|\| 'Ganjil'\)/g,
    ''
);
fs.writeFileSync('pages/Kedisiplinan.tsx', code);

code = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');
code = code.replace(
    /supabase\.from\('homeroom_attendance'\)\.select\('student_id, status, kelas'\)\.eq\('academic_year', academicYear \|\| '2025\/2026'\)\.eq\('semester', semester \|\| 'Ganjil'\)/g,
    "supabase.from('homeroom_attendance').select('student_id, status, kelas')"
);
fs.writeFileSync('pages/PublicDashboard.tsx', code);
