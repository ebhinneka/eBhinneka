const fs = require('fs');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = dir + '/' + f;
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts') || dirPath.endsWith('.html')) {
            callback(dirPath);
        }
    });
}

const targetUrl = '/logo.png';
const newUrl = 'https://i.imghippo.com/files/WXB3962h.png';

walkDir('./pages', processFile);
walkDir('./components', processFile);
processFile('./index.html');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(targetUrl)) {
        content = content.replace(new RegExp(targetUrl.replace(/\//g, '\\/').replace(/\./g, '\\.'), 'g'), newUrl);
        fs.writeFileSync(filePath, content);
        console.log('Updated logo in', filePath);
    }
}
