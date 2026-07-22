const fs = require('fs');
let content = fs.readFileSync('pages/ImportData.tsx', 'utf8');

const oldStr = `                if (hourString) {
                    schedulesToInsert.push({
                        day_of_week: dayNum,
                        hour: hourString,
                        kelas: kelas,
                        subject: mapel,
                        teacher_nip: nip,
                        teacher_id: teacherId,
                        academic_year: targetYear || academicYear || '2025/2026',
                        semester: semester || 'Ganjil',
                        schedule_version: activeScheduleVersion || 'Utama',
                        
                        
                    });
                }`;

const newStr = `                if (hoursArray.length > 0) {
                    for (const h of hoursArray) {
                        schedulesToInsert.push({
                            day_of_week: dayNum,
                            hour: h,
                            kelas: kelas,
                            subject: mapel,
                            teacher_nip: nip,
                            teacher_id: teacherId,
                            academic_year: targetYear || academicYear || '2025/2026',
                            semester: semester || 'Ganjil',
                            schedule_version: activeScheduleVersion || 'Utama',
                        });
                    }
                }`;

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync('pages/ImportData.tsx', content);
    console.log("Success");
} else {
    console.log("Failed to match old string. Looking for partial...");
    if (content.includes('schedulesToInsert.push({')) {
        console.log("Found push");
    }
}
