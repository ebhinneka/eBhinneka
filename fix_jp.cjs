const fs = require('fs');

let pubDash = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');
pubDash = pubDash.replace(
  "const calculatedTotalJp = jpPerClass * 24;",
  "// Removed calculatedTotalJp = jpPerClass * 24"
);
pubDash = pubDash.replace(
  "totalJpRequired: calculatedTotalJp,",
  "totalJpRequired: jpPerClass * (Object.keys(classCounts).length || 45),"
);
fs.writeFileSync('pages/PublicDashboard.tsx', pubDash);

let opDash = fs.readFileSync('pages/OperatorDashboard.tsx', 'utf8');
if (opDash) {
    opDash = opDash.replace(
        "const calculatedTotalJp = jpPerClass * 24;",
        "// Removed calculatedTotalJp"
    );
    opDash = opDash.replace(
        "totalJpRequired: calculatedTotalJp,",
        "totalJpRequired: jpPerClass * (Object.keys(classCounts).length || 45),"
    );
    fs.writeFileSync('pages/OperatorDashboard.tsx', opDash);
}
