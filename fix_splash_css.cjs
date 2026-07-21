const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('150vw, -150vh', '40vw, -40vh');
fs.writeFileSync('index.html', html);
