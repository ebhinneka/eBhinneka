const fs = require('fs');

let code = fs.readFileSync('pages/Kedisiplinan.tsx', 'utf8');

// Fix dropdown container bg and text for dark mode
code = code.replace(
    /className="absolute z-20 w-full mt-1 bg-slate-100 border border-slate-100 rounded-xl shadow-lg max-h-48 overflow-y-auto p-1 custom-scrollbar"/g,
    'className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto p-1 custom-scrollbar"'
);

// Fix button bg
code = code.replace(
    /className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-100 text-left flex justify-between items-center text-xs"/g,
    'className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-2.5 bg-slate-50 dark:bg-slate-700 text-left flex justify-between items-center text-xs"'
);


fs.writeFileSync('pages/Kedisiplinan.tsx', code);
console.log("Fixed dropdown in Kedisiplinan");
