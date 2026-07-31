const fs = require('fs');
let code = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');

// Fix header card
code = code.replace(
    /className="bg-slate-100\/10 backdrop-blur-2xl([^"]*)"/g, 
    'className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 rounded-[2rem] p-5 flex items-center justify-between shadow-xl border-none text-white relative overflow-hidden"'
);

// Fix login button
code = code.replace(
    /className="w-full bg-slate-100\/10 hover:bg-slate-100\/20 backdrop-blur-md text-white([^"]*)"/g,
    'className="w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-4 rounded-2xl font-extrabold flex justify-center items-center gap-3 text-lg transition-all shadow-lg active:scale-[0.98] mt-2 border-none"'
);

fs.writeFileSync('pages/PublicDashboard.tsx', code);
console.log("Fixed PublicDashboard.tsx");
