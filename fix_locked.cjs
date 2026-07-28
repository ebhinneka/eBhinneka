const fs = require('fs');
let code = fs.readFileSync('pages/JurnalForm.tsx', 'utf8');

code = code.replace(
  "const [notesData, setNotesData] = useState<{ discipline: NoteItem[]; activity: NoteItem[]; }>({ discipline: [], activity: [] });",
  "const [notesData, setNotesData] = useState<{ discipline: NoteItem[]; activity: NoteItem[]; }>({ discipline: [], activity: [] });\n  const [lockedAttendance, setLockedAttendance] = useState<Record<string, boolean>>({});"
);

// Also fix the fetch line, I failed to replace that too! Let's check if `initialAttendance: Record<string, any> = {}; data.forEach` exists.
if (code.includes("const initialAttendance: Record<string, any> = {}; data.forEach")) {
    code = code.replace(
      "const initialAttendance: Record<string, any> = {}; data.forEach(r => { if (['S', 'I', 'A', 'D'].includes(r.status)) { initialAttendance[r.student_id] = r.status; } }); setFormData(prev => ({...prev, attendance: initialAttendance}));",
      "const initialAttendance: Record<string, any> = {}; const locked: Record<string, boolean> = {}; data.forEach(r => { if (['S', 'I', 'A', 'D'].includes(r.status)) { initialAttendance[r.student_id] = r.status; locked[r.student_id] = true; } }); setFormData(prev => ({...prev, attendance: initialAttendance})); setLockedAttendance(locked);"
    );
}

// I also need to make sure `setLockedAttendance({})` is added on the edit reset line.
code = code.replace(
  "setEditJournalId(null); setNotesData({ discipline: [], activity: [] });",
  "setEditJournalId(null); setNotesData({ discipline: [], activity: [] }); setLockedAttendance({});"
);

fs.writeFileSync('pages/JurnalForm.tsx', code);
