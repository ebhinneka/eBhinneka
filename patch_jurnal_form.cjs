const fs = require('fs');
let code = fs.readFileSync('pages/JurnalForm.tsx', 'utf8');

// 1. Add state for locked attendance
code = code.replace(
  "const [notesData, setNotesData] = useState<{discipline: NoteItem[], activity: NoteItem[]}>({ discipline: [], activity: [] });",
  "const [notesData, setNotesData] = useState<{discipline: NoteItem[], activity: NoteItem[]}>({ discipline: [], activity: [] });\n  const [lockedAttendance, setLockedAttendance] = useState<Record<string, boolean>>({});"
);

// 2. Update the fetch to set locked attendance
code = code.replace(
  "const initialAttendance: Record<string, any> = {}; data.forEach(r => { if (['S', 'I', 'A', 'D'].includes(r.status)) { initialAttendance[r.student_id] = r.status; } }); setFormData(prev => ({...prev, attendance: initialAttendance}));",
  "const initialAttendance: Record<string, any> = {}; const locked: Record<string, boolean> = {}; data.forEach(r => { if (['S', 'I', 'A', 'D'].includes(r.status)) { initialAttendance[r.student_id] = r.status; locked[r.student_id] = true; } }); setFormData(prev => ({...prev, attendance: initialAttendance})); setLockedAttendance(locked);"
);

// 3. Clear locked attendance on new / edit
code = code.replace(
  "setEditJournalId(null); setNotesData({ discipline: [], activity: [] });",
  "setEditJournalId(null); setNotesData({ discipline: [], activity: [] }); setLockedAttendance({});"
);

// 4. Also clear locked attendance when edit is selected, maybe? Wait, if editing a journal, the journal already has attendance. We shouldn't lock it if it was filled by Guru? Actually, if the wali kelas filled it TODAY, should we lock it? The user said "isian dari wali kelas, itu bersifat mengunci". For now let's just clear locked attendance on edit to be safe, or just lock them if they match.
// Let's just lock them on new journals for now. Wait, I should also fetch homeroom attendance on edit just to lock them!
code = code.replace(
  "setEditJournalId(journalId);",
  "setEditJournalId(journalId); setLockedAttendance({});\n          const todayStr = getWIBISOString(); supabase.from('homeroom_attendance').select('student_id, status').eq('academic_year', academicYear || '2025/2026').eq('semester', semester || 'Ganjil').gte('date', semesterStart ? `${semesterStart}` : '2000-01-01').lte('date', semesterEnd ? `${semesterEnd}` : '2100-01-01').eq('date', todayStr).eq('kelas', existing.kelas).then(({data}) => { if (data) { const locked: Record<string, boolean> = {}; data.forEach(r => { if (['S', 'I', 'A', 'D'].includes(r.status)) { locked[r.student_id] = true; } }); setLockedAttendance(locked); } });"
);

// 5. Disable buttons
code = code.replace(
  "onClick={() => handleAttendance(student.id, 'S')}",
  "onClick={() => !lockedAttendance[student.id] && handleAttendance(student.id, 'S')} disabled={lockedAttendance[student.id]}"
);
code = code.replace(
  "onClick={() => handleAttendance(student.id, 'I')}",
  "onClick={() => !lockedAttendance[student.id] && handleAttendance(student.id, 'I')} disabled={lockedAttendance[student.id]}"
);
code = code.replace(
  "onClick={() => handleAttendance(student.id, 'A')}",
  "onClick={() => !lockedAttendance[student.id] && handleAttendance(student.id, 'A')} disabled={lockedAttendance[student.id]}"
);
code = code.replace(
  "onClick={() => handleAttendance(student.id, 'D')}",
  "onClick={() => !lockedAttendance[student.id] && handleAttendance(student.id, 'D')} disabled={lockedAttendance[student.id]}"
);

fs.writeFileSync('pages/JurnalForm.tsx', code);
console.log("Done");
