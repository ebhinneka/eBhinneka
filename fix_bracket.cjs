const fs = require('fs');
let code = fs.readFileSync('pages/PublicDashboard.tsx', 'utf-8');

if (!code.trim().endsWith('};\\nexport default PublicDashboard;')) {
    code = code.replace(/export default PublicDashboard;/g, '};\nexport default PublicDashboard;');
    // Also remove double '};' if we accidentally created it
    code = code.replace(/};\n};\nexport default PublicDashboard;/g, '};\nexport default PublicDashboard;');
    fs.writeFileSync('pages/PublicDashboard.tsx', code);
}
