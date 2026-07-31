const fs = require('fs');
const path = require('path');

const dir = 'pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let changedFiles = [];

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let original = content;

    // A simplistic regex to find input, select, textarea and inject text-slate-900
    // We can replace `className="...bg-slate-100..."` with `className="...bg-slate-100 text-slate-900 dark:text-slate-100..."`
    
    // Instead of parsing perfectly, let's just replace `className="` with `className="text-slate-900 dark:text-slate-100 ` for ALL inputs, selects, textareas that don't already have text-slate-900 or text-slate-800 or text-slate-700
    // Wait, let's just do it manually for the ones that look like inputs.
    
    // Let's print out all input/textarea/select classNames to see which ones lack text colors
    const regex = /<(input|textarea|select)[^>]*className=(["'])(.*?)\2/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const tag = match[1];
        const className = match[3];
        if (!className.includes('text-slate-900') && !className.includes('text-slate-800') && !className.includes('text-slate-700') && !className.includes('text-blue-600') && !className.includes('text-slate-500') && !className.includes('text-transparent')) {
            console.log(file, tag, className);
        }
    }
});
