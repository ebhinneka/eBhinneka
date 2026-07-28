const fs = require('fs');
let code = fs.readFileSync('pages/JurnalForm.tsx', 'utf8');

// For non-Dhuha
code = code.replace(
  "checked={formData.attendance[student.id] === status}",
  "checked={formData.attendance[student.id] === status}\n                                                                                   disabled={lockedAttendance[student.id]}"
);

// For Dhuha 'A'
code = code.replace(
  "checked={formData.attendance[student.id] === 'A'} onChange={() => { const newAtt = {...formData.attendance}; if (newAtt[student.id] === 'A') delete newAtt[student.id]; else newAtt[student.id] = 'A'; setFormData({...formData, attendance: newAtt}); }} />",
  "checked={formData.attendance[student.id] === 'A'} disabled={lockedAttendance[student.id]} onChange={() => { const newAtt = {...formData.attendance}; if (newAtt[student.id] === 'A') delete newAtt[student.id]; else newAtt[student.id] = 'A'; setFormData({...formData, attendance: newAtt}); }} />"
);

// For Dhuha 'D'
code = code.replace(
  "checked={formData.attendance[student.id] === 'D'} onChange={() => { const newAtt = {...formData.attendance}; if (newAtt[student.id] === 'D') delete newAtt[student.id]; else newAtt[student.id] = 'D'; setFormData({...formData, attendance: newAtt}); }} />",
  "checked={formData.attendance[student.id] === 'D'} disabled={lockedAttendance[student.id]} onChange={() => { const newAtt = {...formData.attendance}; if (newAtt[student.id] === 'D') delete newAtt[student.id]; else newAtt[student.id] = 'D'; setFormData({...formData, attendance: newAtt}); }} />"
);

fs.writeFileSync('pages/JurnalForm.tsx', code);
console.log("Done");
