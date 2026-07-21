const fs = require('fs');

function fixFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the Supabase query to remove .neq('nip', null)
    // and instead filter in JS if needed.
    
    // In InputJadwal.tsx:
    content = content.replace(
        /.neq\('nip', null\).order\('full_name'\)/g,
        ".order('full_name')"
    );
    
    // Let's also make sure we only setTeachers with valid nips
    content = content.replace(
        /if \(data\) setTeachers\(data\);/g,
        "if (data) setTeachers(data.filter(t => t.nip && t.nip.trim() !== ''));"
    );

    fs.writeFileSync(file, content);
}

fixFile('pages/InputJadwal.tsx');
fixFile('pages/SettingsPage.tsx');
