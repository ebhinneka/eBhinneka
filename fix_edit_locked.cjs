const fs = require('fs');
let code = fs.readFileSync('pages/JurnalForm.tsx', 'utf8');

const oldCode = `          setNotesData(loadedNotes);
          setFormData({ kelas: existing.kelas, subject: existing.subject, hours: existing.hours.split(',').map(s => s.trim()), material: existing.material, attendance: attendanceMap, cleanliness: existing.cleanliness as any, validation: existing.validation as any, notes: existing.notes || '', isConfirmed: existing.validation === 'hadir_kbm' });
      } else {`;

const newCode = `          setNotesData(loadedNotes);
          setFormData({ kelas: existing.kelas, subject: existing.subject, hours: existing.hours.split(',').map(s => s.trim()), material: existing.material, attendance: attendanceMap, cleanliness: existing.cleanliness as any, validation: existing.validation as any, notes: existing.notes || '', isConfirmed: existing.validation === 'hadir_kbm' });
          const todayStr = getWIBISOString();
          supabase.from('homeroom_attendance').select('student_id, status').eq('academic_year', academicYear || '2025/2026').eq('semester', semester || 'Ganjil').gte('date', semesterStart ? \`\${semesterStart}\` : '2000-01-01').lte('date', semesterEnd ? \`\${semesterEnd}\` : '2100-01-01').eq('date', todayStr).eq('kelas', existing.kelas).then(({data}) => { 
              if (data && data.length > 0) { 
                  const locked: Record<string, boolean> = {}; 
                  const updatedAtt = {...attendanceMap};
                  data.forEach(r => { 
                      if (['S', 'I', 'A', 'D'].includes(r.status)) { 
                          updatedAtt[r.student_id] = r.status; 
                          locked[r.student_id] = true; 
                      } 
                  }); 
                  setFormData(prev => ({...prev, attendance: updatedAtt})); 
                  setLockedAttendance(locked); 
              } else {
                  setLockedAttendance({});
              }
          });
      } else {`;

if (code.includes(oldCode)) {
    code = code.replace(oldCode, newCode);
    fs.writeFileSync('pages/JurnalForm.tsx', code);
    console.log("Done edit lock");
} else {
    console.log("Not found edit lock");
}
