const fs = require('fs');
let code = fs.readFileSync('pages/UsersData.tsx', 'utf8');

code = code.replace(
  "jabatan_tambahan: editFormData.jabatan_tambahan === '-' ? null : editFormData.jabatan_tambahan",
  "jabatan_tambahan: editFormData.jabatan_tambahan === '-' ? undefined : editFormData.jabatan_tambahan"
);
code = code.replace(
  "jabatan_tambahan: editFormData.jabatan_tambahan === '-' ? null : editFormData.jabatan_tambahan",
  "jabatan_tambahan: editFormData.jabatan_tambahan === '-' ? undefined : editFormData.jabatan_tambahan"
);

fs.writeFileSync('pages/UsersData.tsx', code);
console.log("Done");
