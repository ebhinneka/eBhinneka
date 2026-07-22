const fs = require('fs');
let content = fs.readFileSync('pages/InputJadwal.tsx', 'utf8');

// replace selectedTeacher state
content = content.replace(
    /const \[selectedTeacher, setSelectedTeacher\] = useState<Profile \| null>\(null\);/g,
    "const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');\n  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId) || null;"
);

// replace setSelectedTeacher(teacher) in handleTeacherChange
content = content.replace(
    /setSelectedTeacher\(teacher\);/g,
    "setSelectedTeacherId(id);"
);

// replace value in select
content = content.replace(
    /value=\{selectedTeacher\?\.id \|\| ''\}/g,
    "value={selectedTeacherId}"
);

fs.writeFileSync('pages/InputJadwal.tsx', content);
