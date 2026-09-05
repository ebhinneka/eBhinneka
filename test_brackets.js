const fs = require('fs');
const code = fs.readFileSync('pages/PublicDashboard.tsx', 'utf-8');

let openCount = 0;
let closeCount = 0;

for (let i = 0; i < code.length; i++) {
    if (code[i] === '{') openCount++;
    if (code[i] === '}') closeCount++;
}
console.log('Open:', openCount, 'Close:', closeCount);
