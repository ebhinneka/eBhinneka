const fs = require('fs');
let jf = fs.readFileSync('pages/JurnalForm.tsx', 'utf8');
jf = jf.replace(
    "const { profile, academicYear, semester , activeScheduleVersion , semesterStart, semesterEnd } = useAuth();",
    "const { profile, academicYear, semester , activeScheduleVersion , semesterStart, semesterEnd, availableClasses } = useAuth();"
);
fs.writeFileSync('pages/JurnalForm.tsx', jf);

let kd = fs.readFileSync('pages/Kedisiplinan.tsx', 'utf8');
kd = kd.replace(
    "const { profile, academicYear } = useAuth();",
    "const { profile, academicYear, availableClasses } = useAuth();"
);
// In Kedisiplinan.tsx, I had:
// const [classesRes, settingsRes] = await Promise.all([
//    supabase.from('students').select('kelas').eq('academic_year', academicYear || '2025/2026'),
//    supabase.from('app_settings').select('*')
// ]);
// But wait, the previous replace script messed it up?
kd = kd.replace(
    /const \[classesRes, settingsRes\] = await Promise\.all\(\[\n\s*\/\/ removed classes fetch\n\s*supabase\.from\('app_settings'\)\.select\('\*'\)\n\s*\]\);/,
    "const [settingsRes] = await Promise.all([supabase.from('app_settings').select('*')]);"
);
fs.writeFileSync('pages/Kedisiplinan.tsx', kd);
