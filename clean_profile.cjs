const fs = require('fs');

let profile = fs.readFileSync('pages/ProfilePage.tsx', 'utf8');

// Use regex to remove handleFileChange
profile = profile.replace(/const handleFileChange = async \([\s\S]*?};\n/, '');

fs.writeFileSync('pages/ProfilePage.tsx', profile);
