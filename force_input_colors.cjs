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
        // match <input ... className="..." ... >
        const regex = new RegExp('(<' + tag + '\\b[^>]*className=)({`[^`]*`}|"[^"]*")', 'g');
        content = content.replace(regex, (match, prefix, classStr) => {
            if (classStr.includes('hidden') || classStr.includes('opacity-0') || match.includes('type="checkbox"') || match.includes('type="radio"')) {
                return match;
            }
            if (classStr.includes('bg-transparent')) {
                return match;
            }
            
            // Remove existing text- colors
            let cleanStr = classStr
                .replace(/\btext-(slate|gray|blue|white|black|transparent)(-[0-9]+)?\b/g, '')
                .replace(/\bdark:text-(slate|gray|blue|white|black|transparent)(-[0-9]+)?\b/g, '')
                .replace(/\bbg-(slate|gray|blue|white|black|transparent)(-[0-9]+)?\b/g, '')
                .replace(/\bdark:bg-(slate|gray|blue|white|black|transparent)(-[0-9]+)?\b/g, '')
                .replace(/\s+/g, ' ');

            // Add our standard text and bg colors
            const inject = "text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 ";
            
            let newClassStr = cleanStr;
            if (newClassStr.startsWith('"{`')) {
                // skip
            } else if (newClassStr.startsWith('`')) {
                newClassStr = newClassStr.replace('`', '`' + inject);
            } else if (newClassStr.startsWith('"')) {
                newClassStr = newClassStr.replace('"', '"' + inject);
            } else if (newClassStr.startsWith('{`')) {
                newClassStr = newClassStr.replace('{`', '{`' + inject);
            }
            
            return prefix + newClassStr;
        });
    });

    if (content !== original) {
        fs.writeFileSync(path.join(dir, file), content);
        console.log("Updated", file);
        changes++;
    }
});
console.log("Total files updated:", changes);
