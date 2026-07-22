const fs = require('fs');
let content = fs.readFileSync('contexts/AuthContext.tsx', 'utf8');

content = content.replace(
    "const refreshClasses = async () => {",
    "const refreshClasses = async () => {\n    console.log('refreshClasses called');"
);
content = content.replace(
    "setAvailableClasses(classes);",
    "setAvailableClasses(classes);\n            console.log('availableClasses updated:', classes);"
);

fs.writeFileSync('contexts/AuthContext.tsx', content);
