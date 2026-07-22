const fs = require('fs');
let content = fs.readFileSync('contexts/AuthContext.tsx', 'utf8');

if (!content.includes('availableClasses: string[];')) {
    content = content.replace(
        "activeScheduleVersion: string;\n}",
        "activeScheduleVersion: string;\n  availableClasses: string[];\n  refreshClasses: () => Promise<void>;\n}"
    );
}

if (!content.includes('const [availableClasses, setAvailableClasses] = useState<string[]>')) {
    content = content.replace(
        "const [activeScheduleVersion, setActiveScheduleVersion] = useState<string>('Utama');",
        "const [activeScheduleVersion, setActiveScheduleVersion] = useState<string>('Utama');\n  const [availableClasses, setAvailableClasses] = useState<string[]>([]);"
    );
}

const refreshClassesFunc = `
  const refreshClasses = async () => {
    try {
        if (!isSupabaseConfigured) return;
        const res = await supabase.from('students').select('kelas');
        if (res.data) {
            const classes = [...new Set(res.data.map((d: any) => d.kelas).filter(Boolean))].sort() as string[];
            setAvailableClasses(classes);
        }
    } catch (err) {
        console.error('Failed to fetch classes', err);
    }
  };
`;

if (!content.includes('const refreshClasses = async () => {')) {
    content = content.replace(
        "useEffect(() => {\n    const fetchSettings = async () => {",
        refreshClassesFunc + "\n  useEffect(() => {\n    const fetchSettings = async () => {"
    );
}

// ensure fetchSettings calls refreshClasses
if (!content.includes('await refreshClasses();')) {
    content = content.replace(
        "if (!isSupabaseConfigured) return;",
        "if (!isSupabaseConfigured) return;\n        await refreshClasses();"
    );
}

content = content.replace(
    "activeScheduleVersion\n    }}>",
    "activeScheduleVersion,\n      availableClasses,\n      refreshClasses\n    }}>"
);

fs.writeFileSync('contexts/AuthContext.tsx', content);
