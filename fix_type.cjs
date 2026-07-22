const fs = require('fs');
let content = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');
content = content.replace(
    "let allData = [];",
    "let allData: any[] = [];"
);
fs.writeFileSync('pages/PublicDashboard.tsx', content);
