const fs = require('fs');
let code = fs.readFileSync('pages/UsersData.tsx', 'utf8');

code = code.replace(
  "<th className=\"px-6 py-4\">Role</th>",
  "<th className=\"px-6 py-4\">Role</th>\n                   <th className=\"px-6 py-4\">Jabatan Tambahan</th>"
);

fs.writeFileSync('pages/UsersData.tsx', code);
