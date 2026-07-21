const fs = require('fs');
let content = fs.readFileSync('pages/SettingsPage.tsx', 'utf8');

content = content.replace(
    /\.neq\('nip', null\)\s*\.order\('full_name'\)/g,
    ".order('full_name')"
);

fs.writeFileSync('pages/SettingsPage.tsx', content);
