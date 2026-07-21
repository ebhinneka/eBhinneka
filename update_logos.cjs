const fs = require('fs');
const glob = require('glob'); // Not available by default, let's use a simple recursive read.

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

const targetUrl = 'https://www.smpbhinnekatunggalika.sch.id/upload/imagecache/24871901smp-100x100.png';
const newUrl = '/logo.png';

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
