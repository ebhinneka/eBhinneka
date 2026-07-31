const fs = require('fs');
const path = require('path');

const dir = 'pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    const tags = ['input', 'textarea', 'select'];
    tags.forEach(tag => {
        const regex = new RegExp('<' + tag + '\\b[^>]*className=({`[^`]*`}|"[^"]*")', 'g');
        let match;
        while ((match = regex.exec(content)) !== null) {
            const classNameAttr = match[1];
            // Check if it has a white-ish text color that is NOT preceded by 'dark:'
            if (/(?<!dark:)text-(white|slate-100|slate-200|gray-100)/.test(classNameAttr)) {
                console.log(file, tag, classNameAttr);
            }
        }
    });
});
