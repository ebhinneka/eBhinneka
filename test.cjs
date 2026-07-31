const fs = require('fs');
let code = fs.readFileSync('pages/JurnalForm.tsx', 'utf8');

code = code.replace(
    /supabase.from\('homeroom_attendance'\).select\('student_id, status'\).eq\('academic_year', academicYear \|\| '2025\/2026'\).eq\('semester', semester \|\| 'Ganjil'\).gte\('date', semesterStart \? \`\$\{semesterStart\}\` : '2000-01-01'\).lte\('date', semesterEnd \? \`\$\{semesterEnd\}\` : '2100-01-01'\).eq\('date', todayStr\).eq\('kelas', ([^)]+)\).then\(\(\{data\}\) => {/g,
    "supabase.from('homeroom_attendance').select('student_id, status').eq('date', todayStr).eq('kelas', $1).then(({data, error}) => { console.log('Homeroom attendance err:', error);"
);
fs.writeFileSync('pages/JurnalForm.tsx', code);
