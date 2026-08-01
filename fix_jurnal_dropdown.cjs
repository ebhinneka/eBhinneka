const fs = require('fs');

let code = fs.readFileSync('pages/JurnalForm.tsx', 'utf8');

// Fix dropdown container bg and text for dark mode
code = code.replace(
    /className="absolute z-20 w-full mt-1 bg-slate-100 border border-slate-100 rounded-xl shadow-lg max-h-60 overflow-y-auto p-1 custom-scrollbar"/g,
    'className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-y-auto p-1 custom-scrollbar"'
);

// fix text color in dropdown options
code = code.replace(
    /className=\{\`text-sm \$\{isSelected \? 'text-blue-700 font-bold' : 'text-slate-700'\}\`\}/g,
    'className={`text-sm ${isSelected ? \'text-blue-700 dark:text-blue-400 font-bold\' : \'text-slate-700 dark:text-slate-300\'}`}'
);

// Fix button bg
code = code.replace(
    /className="w-full border border-slate-200 rounded-xl p-3 bg-slate-100 text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500"/g,
    'className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 bg-slate-50 dark:bg-slate-700 text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500"'
);

code = code.replace(
    /className=\{\`truncate text-sm \$\{selectedIds.length === 0 \? 'text-slate-400' : 'text-slate-700 font-bold'\}\`\}/g,
    'className={`truncate text-sm ${selectedIds.length === 0 ? \'text-slate-400 dark:text-slate-500\' : \'text-slate-700 dark:text-slate-100 font-bold\'}`}'
);

code = code.replace(
    /className=\{\`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors \$\{isSelected \? 'bg-blue-50' : 'hover:bg-gray-50'\}\`\}/g,
    'className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${isSelected ? \'bg-blue-50 dark:bg-blue-900/30\' : \'hover:bg-slate-100 dark:hover:bg-slate-700\'}`}'
);


fs.writeFileSync('pages/JurnalForm.tsx', code);
console.log("Fixed dropdown in Jurnal");
