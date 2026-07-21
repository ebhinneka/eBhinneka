const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('rel="icon"')) {
    html = html.replace('<title>', '<link rel="icon" type="image/png" href="/logo.png" />\n    <title>');
    fs.writeFileSync('index.html', html);
    console.log("Favicon added to index.html");
}
