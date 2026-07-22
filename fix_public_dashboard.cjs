const fs = require('fs');
let content = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');

const fetchStudentsLoop = `
            (async () => {
                let allData = [];
                let from = 0;
                let step = 1000;
                while (true) {
                    let res = await supabase.from('students').select('id, kelas').eq('academic_year', academicYear || '2025/2026').range(from, from + step - 1);
                    if (res.error && (res.error.code === '42703' || res.error.message?.includes('academic_year'))) {
                        res = await supabase.from('students').select('id, kelas').eq('academic_year', academicYear || '2025/2026').range(from, from + step - 1);
                    }
                    if (res.error) break;
                    if (!res.data || res.data.length === 0) break;
                    allData = allData.concat(res.data);
                    if (res.data.length < step) break;
                    from += step;
                }
                return { data: allData, error: null };
            })()
`;

content = content.replace(
    /supabase\.from\('students'\)\.select\('id, kelas'\)\.eq\('academic_year', academicYear \|\| '2025\/2026'\)\.then\(async \(res\) => \{[\s\S]*?return res;\s*\}\)/,
    fetchStudentsLoop
);

fs.writeFileSync('pages/PublicDashboard.tsx', content);
