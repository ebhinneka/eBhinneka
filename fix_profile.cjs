const fs = require('fs');
let profile = fs.readFileSync('pages/ProfilePage.tsx', 'utf8');

profile = profile.replace(/<button[\s\S]*?onClick=\{\(\) => fileInputRef.current\?.click\(\)\}[\s\S]*?<\/button>/, '');
profile = profile.replace(/<input[\s\S]*?type="file"[\s\S]*?ref=\{fileInputRef\}[\s\S]*?\/>/, '');
profile = profile.replace(/<p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-bold">Maks. Ukuran Foto: 500 KB<\/p>/, '');

fs.writeFileSync('pages/ProfilePage.tsx', profile);
