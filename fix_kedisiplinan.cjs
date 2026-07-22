const fs = require('fs');
let content = fs.readFileSync('pages/Kedisiplinan.tsx', 'utf8');

// Use availableClasses
if (!content.includes('availableClasses } = useAuth();')) {
    content = content.replace(
        "const { profile, academicYear } = useAuth();",
        "const { profile, academicYear, availableClasses } = useAuth();"
    );
}

// Remove local classes state
content = content.replace(
    "const [classes, setClasses] = useState<string[]>([]);",
    "// classes state removed"
);

// Remove classes fetching
content = content.replace(
    "supabase.from('students').select('kelas').eq('academic_year', academicYear || '2025/2026'),",
    "// removed classes fetch"
);
content = content.replace(
    "if (classesRes.data) {\n            const unique = Array.from(new Set(classesRes.data.map((s:any) => s.kelas))).sort();\n            setClasses(unique as string[]);\n        }",
    ""
);
// Fix mapping
content = content.replace(/\{classes\.map/g, "{availableClasses.map");

fs.writeFileSync('pages/Kedisiplinan.tsx', content);
