const fs = require('fs');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = dir + '/' + f;
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else if (dirPath.endsWith('.tsx')) {
            callback(dirPath);
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Find all <input, <select, <textarea tags
    content = content.replace(/<(input|select|textarea)([^>]+)className="([^"]+)"([^>]*)>/g, (match, tag, before, className, after) => {
        let newClassName = className;
        
        // if text color is not explicitly set, add it
        if (!newClassName.includes('text-slate-') && !newClassName.includes('text-gray-') && !newClassName.includes('text-white') && !newClassName.includes('text-black') && !newClassName.includes('text-blue-') && !newClassName.includes('text-red-')) {
            newClassName += ' text-slate-900 dark:text-slate-100';
        }
        
        // if background color is light but no dark mode bg, add dark bg
        if ((newClassName.includes('bg-white') || newClassName.includes('bg-slate-50') || newClassName.includes('bg-slate-100') || newClassName.includes('bg-gray-50')) && !newClassName.includes('dark:bg-')) {
            newClassName += ' dark:bg-slate-800 dark:border-slate-600';
        }
        
        if (newClassName !== className) {
            changed = true;
            return `<${tag}${before}className="${newClassName}"${after}>`;
        }
        return match;
    });

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed inputs in', filePath);
    }
}

walkDir('./pages', processFile);
walkDir('./components', processFile);
