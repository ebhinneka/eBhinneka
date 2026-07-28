const fs = require('fs');

function fixFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    const fetchOld = `const [studentsRes, journalsRes, attendanceRes, homeroomRes] = await Promise.all([`;
    const fetchNew = `const [studentsRes, journalsRes, attendanceRes, homeroomRes, schedulesRes] = await Promise.all([`;
    code = code.replace(fetchOld, fetchNew);

    const promiseEndOld = `supabase.from('homeroom_attendance').select('student_id, status, kelas').eq('academic_year', academicYear || '2025/2026').eq('semester', semester || 'Ganjil').gte('date', semesterStart ? \`\${semesterStart}\` : '2000-01-01').lte('date', semesterEnd ? \`\${semesterEnd}\` : '2100-01-01').eq('date', todayStr)
        ]);`;
    const promiseEndNew = `supabase.from('homeroom_attendance').select('student_id, status, kelas').eq('academic_year', academicYear || '2025/2026').eq('semester', semester || 'Ganjil').gte('date', semesterStart ? \`\${semesterStart}\` : '2000-01-01').lte('date', semesterEnd ? \`\${semesterEnd}\` : '2100-01-01').eq('date', todayStr),
            supabase.from('schedules').select('hour').eq('day_of_week', dbDay).eq('academic_year', academicYear || '2025/2026').eq('semester', semester || 'Ganjil').eq('schedule_version', activeScheduleVersion || 'Utama').then(async (res) => {
                if (res.error && (res.error.code === '42703' || res.error.message?.includes('academic_year'))) {
                    return await supabase.from('schedules').select('hour, academic_year, semester').eq('day_of_week', dbDay);
                }
                return res;
            })
        ]);`;
    if (code.includes(promiseEndOld)) {
        code = code.replace(promiseEndOld, promiseEndNew);
    } else {
        console.log("Could not find promise end in " + filePath);
    }

    const calcJpOld = `totalJpRequired: jpPerClass * (Object.keys(classCounts).length || 45),`;
    const calcJpNew = `totalJpRequired: calculatedTotalJp,`;
    code = code.replace(calcJpOld, calcJpNew);

    const calcJpCodeOld = `let c7 = 0, c8 = 0, c9 = 0;`;
    const calcJpCodeNew = `let c7 = 0, c8 = 0, c9 = 0;
        let calculatedTotalJp = 0;
        if (schedulesRes && schedulesRes.data) {
            let scheds = schedulesRes.data;
            if (scheds.length > 0 && scheds[0].academic_year !== undefined) {
                scheds = scheds.filter(s => s.academic_year === (academicYear || '2025/2026') && s.semester === (semester || 'Ganjil'));
            }
            scheds.forEach((s: any) => {
                calculatedTotalJp += s.hour.split(',').filter((h: string) => h.trim() !== '').length;
            });
        }
        if (calculatedTotalJp === 0) calculatedTotalJp = jpPerClass * (Object.keys(classCounts).length || 45); // fallback`;
    
    code = code.replace(calcJpCodeOld, calcJpCodeNew);

    fs.writeFileSync(filePath, code);
    console.log("Updated " + filePath);
}

fixFile('pages/PublicDashboard.tsx');
fixFile('pages/OperatorDashboard.tsx');

