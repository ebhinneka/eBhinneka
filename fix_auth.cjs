const fs = require('fs');

let code = fs.readFileSync('contexts/AuthContext.tsx', 'utf8');
code = code.replace(
  /let finalPassword = password;\s*if \(cleanId === '234567' && password === 'admin'\) \{\s*finalPassword = 'admin_sekolah';\s*\}/,
  'let finalPassword = password;'
);
fs.writeFileSync('contexts/AuthContext.tsx', code);
