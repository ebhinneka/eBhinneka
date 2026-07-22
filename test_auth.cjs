const fs = require('fs');
let content = fs.readFileSync('contexts/AuthContext.tsx', 'utf8');
console.log(content.includes('supabase.from(\'students\').select(\'kelas\').range'));
