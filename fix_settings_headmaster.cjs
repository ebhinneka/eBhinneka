const fs = require('fs');
let content = fs.readFileSync('pages/SettingsPage.tsx', 'utf8');

// onChange has already been partially fixed in fix_teachers_dropdown.cjs? Let's check:
content = content.replace(
    /value=\{settings\['headmaster_nip'\] \|\| ''\}/g,
    "value={teachers.find(t => (t.nip && t.nip === settings.headmaster_nip) || t.full_name === settings.headmaster)?.id || ''}"
);

fs.writeFileSync('pages/SettingsPage.tsx', content);
