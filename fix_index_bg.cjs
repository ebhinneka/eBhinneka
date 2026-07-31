const fs = require('fs');

let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/background-color: #f4f7fb;/g, 'background-color: #ffffff;');
code = code.replace(/background-color: #0f172a;/g, 'background-color: #0f172a;'); // no change for dark mode

fs.writeFileSync('index.html', code);
console.log("Fixed index background");
