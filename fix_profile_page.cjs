const fs = require('fs');
let content = fs.readFileSync('pages/ProfilePage.tsx', 'utf8');

content = content.replace(
    "const { profile, academicYear, semester } = useAuth();",
    "const { profile, academicYear, semester, availableClasses } = useAuth();"
);

content = content.replace(
    /\{\[\'7A\',\'7B\',\'7C\',\'7D\',\'7E\',\'7F\',\'7G\',\'7H\',\'8A\',\'8B\',\'8C\',\'8D\',\'8E\',\'8F\',\'8G\',\'8H\',\'9A\',\'9B\',\'9C\',\'9D\',\'9E\',\'9F\',\'9G\',\'9H\'\]\.map\(k => \(\s*<option key=\{k\} value=\{k\}>\{k\}<\/option>\s*\)\)\}/g,
    "{availableClasses.map(k => (<option key={k} value={k}>{k}</option>))}"
);

fs.writeFileSync('pages/ProfilePage.tsx', content);
