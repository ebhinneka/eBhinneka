const fs = require('fs');
let content = fs.readFileSync('pages/UsersData.tsx', 'utf8');

// 1. Remove parsed.push('Sabtu bersama Wali Kelas')
content = content.replace(
    /if \(!parsed\.includes\('Sabtu bersama Wali Kelas'\)\) \{\s*parsed\.push\('Sabtu bersama Wali Kelas'\);\s*\}/g,
    ""
);

// 2. Remove mapels.push('Sabtu bersama Wali Kelas') in handleSaveEdit
content = content.replace(
    /if \(editFormData\.wali_kelas && editFormData\.wali_kelas\.trim\(\) !== ''\) \{\s*const mapels = finalMapel \? finalMapel\.split\(\',\/\)\.map\(m => m\.trim\(\)\)\.filter\(m => m !== ''\) : \[\];\s*if \(!mapels\.includes\('Sabtu bersama Wali Kelas'\)\) \{\s*mapels\.push\('Sabtu bersama Wali Kelas'\);\s*\}\s*\}\s*finalMapel = mapels\.join\(\', '\);\s*/g,
    ""
);
// Wait, the regex might be tricky. Let's do it exactly:
const oldHandleSaveEditLogic = `const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()).filter(m => m !== '') : [];
      if (editFormData.wali_kelas && editFormData.wali_kelas.trim() !== '') {
        if (!mapels.includes('Sabtu bersama Wali Kelas')) {
           mapels.push('Sabtu bersama Wali Kelas');
        }
      }
      finalMapel = mapels.join(', ');`;
const newHandleSaveEditLogic = `const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()).filter(m => m !== '') : [];
      finalMapel = mapels.join(', ');`;
content = content.replace(oldHandleSaveEditLogic, newHandleSaveEditLogic);


// 3. Remove mapelsNew.push('Sabtu bersama Wali Kelas') in handleCreateUser
const oldHandleCreateUserLogic = `const mapelsNew = finalMapelNew ? finalMapelNew.split(',').map(m => m.trim()).filter(m => m !== '') : [];
          if (newUser.waliKelas && newUser.waliKelas.trim() !== '') {
              if (!mapelsNew.includes('Sabtu bersama Wali Kelas')) {
                 mapelsNew.push('Sabtu bersama Wali Kelas');
              }
          }
          finalMapelNew = mapelsNew.join(', ');`;
const newHandleCreateUserLogic = `const mapelsNew = finalMapelNew ? finalMapelNew.split(',').map(m => m.trim()).filter(m => m !== '') : [];
          finalMapelNew = mapelsNew.join(', ');`;
content = content.replace(oldHandleCreateUserLogic, newHandleCreateUserLogic);


// 4. Change displayMapels filter
content = content.replace(
    /const displayMapels = rawArr\.filter\(m => m\.trim\(\) !== 'Sabtu bersama Wali Kelas'\)\.map\(m => m\.trim\(\)\);/g,
    "const displayMapels = rawArr.map(m => m.trim());"
);


// 5. Change Wali Kelas select onChange (Edit)
const oldWaliEditOnChange = `onChange={e => {
    const val = e.target.value;
    let newMapel = editFormData.mengajar_mapel;
    if (val) {
        const mapels = newMapel ? newMapel.split(',').map(m => m.trim()) : [];
        if (!mapels.includes('Sabtu bersama Wali Kelas')) {
            mapels.push('Sabtu bersama Wali Kelas');
            newMapel = mapels.join(', ');
        }
    }
    setEditFormData({...editFormData, wali_kelas: val, mengajar_mapel: newMapel});
}}`;
const newWaliEditOnChange = `onChange={e => setEditFormData({...editFormData, wali_kelas: e.target.value})}`;
content = content.replace(oldWaliEditOnChange, newWaliEditOnChange);


// 6. Change Wali Kelas select onChange (Create)
const oldWaliCreateOnChange = `onChange={e => {
    const val = e.target.value;
    let newMapel = newUser.mapel;
    if (val) {
        const mapels = newMapel ? newMapel.split(',').map(m => m.trim()) : [];
        if (!mapels.includes('Sabtu bersama Wali Kelas')) {
            mapels.push('Sabtu bersama Wali Kelas');
            newMapel = mapels.join(', ');
        }
    }
    setNewUser({...newUser, waliKelas: val, mapel: newMapel});
}}`;
const newWaliCreateOnChange = `onChange={e => setNewUser({...newUser, waliKelas: e.target.value})}`;
content = content.replace(oldWaliCreateOnChange, newWaliCreateOnChange);


// 7. Remove dark classes that might cause white text
content = content.replace(/dark:text-slate-100/g, "");
content = content.replace(/dark:bg-slate-800/g, "");
content = content.replace(/dark:border-slate-600/g, "");

// Write back
fs.writeFileSync('pages/UsersData.tsx', content);
