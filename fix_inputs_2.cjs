const fs = require('fs');
const path = require('path');

const dir = 'pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // Find all <input, <textarea, <select
    const tags = ['input', 'textarea', 'select'];
    tags.forEach(tag => {
        const regex = new RegExp('<' + tag + '\\b[^>]*className=({`[^`]*`}|"[^"]*")', 'g');
        let match;
        while ((match = regex.exec(content)) !== null) {
            const fullMatch = match[0];
            const classNameAttr = match[1];
            if (!classNameAttr.includes('text-slate-') && !classNameAttr.includes('text-gray-') && !classNameAttr.includes('text-blue-') && !classNameAttr.includes('text-pink-') && !classNameAttr.includes('text-transparent')) {
                console.log(file, tag, classNameAttr);
            }
        }
    });
});
