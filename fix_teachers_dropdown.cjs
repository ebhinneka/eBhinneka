const fs = require('fs');

function fixInputJadwal() {
    let content = fs.readFileSync('pages/InputJadwal.tsx', 'utf8');
    
    // Remove JS filter
    content = content.replace(
        /if \(data\) setTeachers\(data\.filter\(t => t\.nip && t\.nip\.trim\(\) !== ''\)\);/g,
        "if (data) setTeachers(data);"
    );
    
    // Change select value and options
    // <select className="..." value={selectedTeacher?.nip || ''} onChange={handleTeacherChange}
    content = content.replace(
        /value=\{selectedTeacher\?\.nip \|\| ''\}/g,
        "value={selectedTeacher?.id || ''}"
    );
    
    // <option key={t.id} value={t.nip}>{t.full_name}</option>
    content = content.replace(
        /<option key=\{t\.id\} value=\{t\.nip\}>\{t\.full_name\}<\/option>/g,
        "<option key={t.id} value={t.id}>{t.full_name}</option>"
    );
    
    // onChange lookup
    // const nip = e.target.value;
    // const teacher = teachers.find(t => t.nip === nip);
    content = content.replace(
        /const nip = e\.target\.value;\s+const teacher = teachers\.find\(t => t\.nip === nip\);/g,
        "const id = e.target.value;\n    const teacher = teachers.find(t => t.id === id);"
    );
    
    fs.writeFileSync('pages/InputJadwal.tsx', content);
}

function fixSettingsPage() {
    let content = fs.readFileSync('pages/SettingsPage.tsx', 'utf8');
    
    // Remove JS filter
    content = content.replace(
        /if \(data\) setTeachers\(data\.filter\(t => t\.nip && t\.nip\.trim\(\) !== ''\)\);/g,
        "if (data) setTeachers(data);"
    );
    
    // The headmaster select uses settings.headmaster_nip right now, which is tricky.
    // If the headmaster has NO nip, how do we select it?
    // Let's change the select to use headmaster (the name). Wait, names can be duplicate.
    // Let's actually look at how headmaster is handled.
    // handleHeadmasterChange(e):
    // const selectedNip = e.target.value;
    // const selectedTeacher = teachers.find(t => t.nip === selectedNip);
    
    content = content.replace(
        /value=\{settings\.headmaster_nip \|\| ''\}/g,
        "value={teachers.find(t => t.nip === settings.headmaster_nip && t.nip)?.id || teachers.find(t => t.full_name === settings.headmaster)?.id || ''}"
    );
    
    content = content.replace(
        /<option key=\{t\.id\} value=\{t\.nip\}>\{t\.full_name\}<\/option>/g,
        "<option key={t.id} value={t.id}>{t.full_name}</option>"
    );
    
    content = content.replace(
        /const selectedNip = e\.target\.value;\s+const selectedTeacher = teachers\.find\(t => t\.nip === selectedNip\);/g,
        "const id = e.target.value;\n      const selectedTeacher = teachers.find(t => t.id === id);"
    );

    fs.writeFileSync('pages/SettingsPage.tsx', content);
}

fixInputJadwal();
fixSettingsPage();
