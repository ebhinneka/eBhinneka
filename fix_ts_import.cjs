const fs = require('fs');
let content = fs.readFileSync('pages/ImportData.tsx', 'utf8');

content = content.replace(
    "const nipToIdMap = {};",
    "const nipToIdMap: Record<string, string> = {};"
);

content = content.replace(
    "if (p.nip) nipToIdMap[p.nip] = p.id;",
    "if (p.nip) nipToIdMap[p.nip as string] = p.id;"
);

fs.writeFileSync('pages/ImportData.tsx', content);
