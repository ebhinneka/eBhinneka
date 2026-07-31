const fs = require('fs');
const path = require('path');

const dir = 'pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let changes = 0;

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let original = content;

    const tags = ['input', 'textarea', 'select'];
    tags.forEach(tag => {
        const regex = new RegExp('(<' + tag + '\\b[^>]*className=)({`[^`]*`}|"[^"]*")', 'g');
        content = content.replace(regex, (match, prefix, classStr) => {
            // Check if there is a dark text color
            if (!classStr.includes('text-slate-9') && !classStr.includes('text-slate-8') && !classStr.includes('text-slate-7') && !classStr.includes('text-gray-9') && !classStr.includes('text-blue-6') && !classStr.includes('text-blue-5') && !classStr.includes('text-transparent')) {
                // It lacks a dark text color
                if (classStr.startsWith('"{`')) {
                    // unexpected
                    return match;
                } else if (classStr.startsWith('`')) {
                    // Wait, the regex matched {`...`} so classStr is {`...`}
                    return prefix + classStr.replace('{`', '{`text-slate-900 dark:text-slate-100 ');
                } else if (classStr.startsWith('"{')) {
                    return match;
                } else if (classStr.startsWith('"')) {
                    return prefix + classStr.replace('"', '"text-slate-900 dark:text-slate-100 ');
                } else if (classStr.startsWith('{`')) {
                    return prefix + classStr.replace('{`', '{`text-slate-900 dark:text-slate-100 ');
                }
            }
            return match;
        });
    });

    if (content !== original) {
        fs.writeFileSync(path.join(dir, file), content);
        console.log("Updated", file);
        changes++;
    }
});
console.log("Total files updated:", changes);
