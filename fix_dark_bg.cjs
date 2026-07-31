const fs = require('fs');
const path = require('path');

const dir = 'pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let original = content;

    const tags = ['input', 'textarea', 'select'];
    tags.forEach(tag => {
        const regex = new RegExp('(<' + tag + '\\b[^>]*className=)({`[^`]*`}|"[^"]*")', 'g');
        content = content.replace(regex, (match, prefix, classStr) => {
            // Check if it's hidden or checkbox/radio, if so, skip bg
            if (classStr.includes('hidden') || classStr.includes('opacity-0') || match.includes('type="checkbox"') || match.includes('type="radio"')) {
                return match;
            }
            if (classStr.includes('bg-transparent')) {
                return match; // don't mess with transparent inputs
            }

            let newClassStr = classStr;
            
            // If it doesn't have bg- slate/white, add bg-slate-50
            if (!newClassStr.includes('bg-')) {
                if (newClassStr.startsWith('"{`')) {
                    // skip
                } else if (newClassStr.startsWith('`')) {
                    newClassStr = newClassStr.replace('`', '`bg-slate-50 ');
                } else if (newClassStr.startsWith('"')) {
                    newClassStr = newClassStr.replace('"', '"bg-slate-50 ');
                } else if (newClassStr.startsWith('{`')) {
                    newClassStr = newClassStr.replace('{`', '{`bg-slate-50 ');
                }
            }

            // Ensure dark mode background for dark mode text
            if (newClassStr.includes('dark:text-slate-100') && !newClassStr.includes('dark:bg-')) {
                if (newClassStr.endsWith('"`')) {
                    newClassStr = newClassStr.slice(0, -2) + ' dark:bg-slate-800 dark:border-slate-600"`';
                } else if (newClassStr.endsWith('"}')) {
                    // skip for now or handle carefully
                } else if (newClassStr.endsWith('"')) {
                    newClassStr = newClassStr.slice(0, -1) + ' dark:bg-slate-800 dark:border-slate-600"';
                } else if (newClassStr.endsWith('`}')) {
                    newClassStr = newClassStr.slice(0, -2) + ' dark:bg-slate-800 dark:border-slate-600`}';
                }
            }
            
            return prefix + newClassStr;
        });
    });

    if (content !== original) {
        fs.writeFileSync(path.join(dir, file), content);
        console.log("Updated", file);
    }
});
