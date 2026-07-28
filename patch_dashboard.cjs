const fs = require('fs');

// 1. OperatorDashboard.tsx
let op = fs.readFileSync('pages/OperatorDashboard.tsx', 'utf8');
op = op.replace(
  '<XCircle className="text-blue-500',
  '<XCircle className="text-red-500'
);
fs.writeFileSync('pages/OperatorDashboard.tsx', op);

// 2. PublicDashboard.tsx
let pub = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');
const oldJp = `    let jpPerClass = 0;
    if (jsDay === 1) jpPerClass = 7;
    else if (jsDay >= 2 && jsDay <= 4) jpPerClass = 8;
    else if (jsDay === 5) jpPerClass = 5;
    else if (jsDay === 6) jpPerClass = 6;`;
const newJp = `    let jpPerClass = 0;
    if (jsDay === 6) jpPerClass = 8; // Sabtu
    else if (jsDay === 0) jpPerClass = 6; // Minggu
    else if (jsDay === 1) jpPerClass = 4; // Senin
    else if (jsDay === 2) jpPerClass = 6; // Selasa
    else if (jsDay === 3) jpPerClass = 8; // Rabu
    else if (jsDay === 4) jpPerClass = 4; // Kamis
    else if (jsDay === 5) jpPerClass = 5; // Jumat default`;

if (pub.includes(oldJp)) {
    pub = pub.replace(oldJp, newJp);
} else {
    console.log("Could not find old JP logic in PublicDashboard");
}
fs.writeFileSync('pages/PublicDashboard.tsx', pub);
console.log("Done");
