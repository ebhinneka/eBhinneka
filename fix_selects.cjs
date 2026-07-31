const fs = require('fs');
const path = require('path');

const dir = 'pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
let changes = 0;

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let original = content;

    // clean up the weird dark: dark: dark:
    content = content.replace(/dark:\s+dark:\s+dark:/g, 'dark:');
    
    // ensure select has correct colors without overriding if it's already there
    content = content.replace(/<select\b[^>]*className="([^"]*)"/g, (match, className) => {
        let newClass = className.replace(/\btext-(slate|gray|white|black)(-[0-9]+)?\b/g, '')
                                .replace(/\bbg-(slate|gray|white|black|transparent)(-[0-9]+)?\b/g, '')
                                .replace(/\s+/g, ' ');
        // Force bg-white text-slate-800
        newClass = "bg-white text-slate-800 border-slate-200 " + newClass.trim();
        return `<select className="${newClass}"`;
    });

    if (content !== original) {
        fs.writeFileSync(path.join(dir, file), content);
        changes++;
    }
});
console.log("Total selects fixed:", changes);
