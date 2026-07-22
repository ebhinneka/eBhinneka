const fs = require('fs');
let kd = fs.readFileSync('pages/Kedisiplinan.tsx', 'utf8');

kd = kd.replace(
    "const { profile, academicYear, semester , semesterStart, semesterEnd } = useAuth();",
    "const { profile, academicYear, semester , semesterStart, semesterEnd, availableClasses } = useAuth();"
);

fs.writeFileSync('pages/Kedisiplinan.tsx', kd);
