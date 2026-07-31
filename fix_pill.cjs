const fs = require('fs');
let code = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');

code = code.replace(
    /<div className="app-card border-none text-slate-800 px-6 py-2 rounded-full shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300">([^<]*)<\/div>/g,
    '<div className="bg-white px-6 py-2.5 rounded-full shadow-sm text-xs font-bold text-slate-700 flex items-center justify-center gap-2 border border-slate-200/60"><Calendar size={14} className="text-blue-500"/> $1</div>'
);

// We need to import Calendar if not imported
if (!code.includes('Calendar')) {
    code = code.replace(/import \{ ([^}]*) \} from 'lucide-react';/, "import { $1, Calendar } from 'lucide-react';");
}

fs.writeFileSync('pages/PublicDashboard.tsx', code);
console.log("Fixed pill");
