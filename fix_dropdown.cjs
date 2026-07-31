const fs = require('fs');

let code = fs.readFileSync('pages/Kedisiplinan.tsx', 'utf8');

// Fix text color in MultiSelectDropdown
code = code.replace(
    /className=\{\`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs \$\{selectedIds\.includes\([^)]+\) \? 'bg-sky-100 font-bold text-blue-600' : 'hover:bg-gray-50'\}\`\}/g,
    'className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs ${selectedIds.includes(opt.id) ? \'bg-sky-100 font-bold text-blue-600\' : \'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700\'}`}'
);

fs.writeFileSync('pages/Kedisiplinan.tsx', code);
console.log("Fixed dropdown");
