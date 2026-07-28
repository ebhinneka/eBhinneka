const fs = require('fs');
let code = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');

code = code.replace("const todayObj = new Date(todayStr);\n    const jsDay = todayObj.getDay();", "const todayObj = new Date(todayStr);\n    // removed duplicate jsDay");

fs.writeFileSync('pages/PublicDashboard.tsx', code);
console.log("Done");
