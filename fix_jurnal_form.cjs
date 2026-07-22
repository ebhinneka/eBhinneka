const fs = require('fs');
let content = fs.readFileSync('pages/JurnalForm.tsx', 'utf8');

// Replace allClasses with availableClasses
content = content.replace(
    "const [allClasses, setAllClasses] = useState<string[]>([]);",
    "// allClasses removed"
);
content = content.replace(
    "if (studentData) { const unique = Array.from(new Set(studentData.map((s: any) => s.kelas))).sort() as string[]; setAllClasses(unique); }",
    ""
);
content = content.replace(
    /\{allClasses\.map/g,
    "{availableClasses.map"
);
content = content.replace(
    "const { profile, academicYear, semester, semesterStart, semesterEnd } = useAuth();",
    "const { profile, academicYear, semester, semesterStart, semesterEnd, availableClasses } = useAuth();"
);

fs.writeFileSync('pages/JurnalForm.tsx', content);
