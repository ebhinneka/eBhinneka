const fs = require('fs');

// 1. Dashboard.tsx (Header Card)
let dashboard = fs.readFileSync('pages/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace(
  '<div className="bg-slate-100/10 backdrop-blur-2xl rounded-[2rem] p-6 md:p-8 text-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-slate-100/20 relative overflow-hidden">',
  '<div className="bg-[#fb923c]/80 backdrop-blur-2xl rounded-[2rem] p-6 md:p-8 text-[#0f172a] shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/20 relative overflow-hidden">'
);
// Remove avatar circle in Dashboard
dashboard = dashboard.replace(
  /<div className="flex-shrink-0">[\s\S]*?<\/div>[\s]*<\/div>[\s]*<div>/,
  '<div>'
);
// Change text colors in greeting container
dashboard = dashboard.replace(
  '<p className="text-blue-100 text-sm font-bold opacity-90 mb-0.5 tracking-wide">{greeting}</p>',
  '<p className="text-[#0f172a] text-sm font-bold opacity-90 mb-0.5 tracking-wide">{greeting}</p>'
);
dashboard = dashboard.replace(
  '<h1 className="text-xl md:text-3xl font-extrabold leading-tight tracking-tight text-slate-100 mb-1 drop-shadow-md">{profile?.full_name}</h1>',
  '<h1 className="text-xl md:text-3xl font-extrabold leading-tight tracking-tight text-[#0f172a] mb-1 drop-shadow-md">{profile?.full_name}</h1>'
);
dashboard = dashboard.replace(
  '<p className="text-blue-200 text-sm font-mono font-medium mb-3">{isAdmin ? \'Administrator\' : (profile?.nip || \'NIPY -\')}</p>',
  '<p className="text-[#0f172a]/80 text-sm font-mono font-medium mb-3">{isAdmin ? \'Administrator\' : (profile?.nip || \'NIPY -\')}</p>'
);
fs.writeFileSync('pages/Dashboard.tsx', dashboard);

// 2. Layout.tsx (Glow border & Bell number)
let layout = fs.readFileSync('components/Layout.tsx', 'utf8');
layout = layout.replace(
  /style={{ background: 'conic-gradient\(from 0deg, transparent 0 340deg, #[0-9a-fA-F]+ 360deg\)' }}/g,
  "style={{ background: 'conic-gradient(from 0deg, transparent 0 340deg, #fb923c 360deg)' }}"
);
layout = layout.replace(
  /<span className="absolute -top-1 -right-1 z-20 min-w-\[16px\] h-\[16px\] flex items-center justify-center text-\[10px\] font-bold text-slate-100 border-2 border-slate-50 dark:border-slate-800 rounded-full px-\[3px\] bg-blue-500">/g,
  '<span className="absolute -top-1 -right-1 z-20 min-w-[16px] h-[16px] flex items-center justify-center text-[10px] font-bold text-slate-100 border-2 border-slate-50 dark:border-slate-800 rounded-full px-[3px] bg-[#fb923c]">'
);
layout = layout.replace(
  /<span className="absolute -top-1 -right-1 z-20 min-w-\[16px\] h-\[16px\] flex items-center justify-center text-\[10px\] font-bold text-slate-100 border-2 border-slate-100 dark:border-slate-800 rounded-full px-\[3px\] bg-blue-500">/g,
  '<span className="absolute -top-1 -right-1 z-20 min-w-[16px] h-[16px] flex items-center justify-center text-[10px] font-bold text-slate-100 border-2 border-slate-100 dark:border-slate-800 rounded-full px-[3px] bg-[#fb923c]">'
);
fs.writeFileSync('components/Layout.tsx', layout);

// 3. index.html (Glow border)
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
  /conic-gradient\(from 0deg, transparent 0 340deg, #[0-9a-fA-F]+ 360deg\)/g,
  'conic-gradient(from 0deg, transparent 0 340deg, #fb923c 360deg)'
);
fs.writeFileSync('index.html', html);

// 4. PublicDashboard.tsx
let publicDash = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');

// "Login Sebagai" trigger button
publicDash = publicDash.replace(
  'className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 border-2 border-blue-400 text-slate-100 font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all"',
  'className="w-full bg-[#fb923c] hover:bg-[#ea580c] border-2 border-[#fb923c] text-slate-900 font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all"'
);

// Selection Modal bg (wrap with bg-[#93C5FD])
publicDash = publicDash.replace(
  '<div className="w-full grid gap-4 animate-fade-in">',
  '<div className="w-full grid gap-4 animate-fade-in bg-[#93c5fd] p-8 rounded-[2rem] shadow-2xl border border-blue-200">'
);
// Make the selection title darker for contrast
publicDash = publicDash.replace(
  '<h2 className="text-xl font-extrabold text-slate-100">Masuk Sebagai</h2>',
  '<h2 className="text-xl font-extrabold text-[#0f172a]">Masuk Sebagai</h2>'
);
// Make selection close button darker
publicDash = publicDash.replace(
  '<button onClick={() => setShowLoginModal(false)} className="text-slate-100/70 hover:text-slate-100 p-2 rounded-full bg-slate-100/10 hover:bg-slate-100/20 transition-colors"><X size={24}/></button>',
  '<button onClick={() => setShowLoginModal(false)} className="text-slate-900/70 hover:text-slate-900 p-2 rounded-full bg-slate-900/10 hover:bg-slate-900/20 transition-colors"><X size={24}/></button>'
);

// Login Form Modal bg (2563EB)
publicDash = publicDash.replace(
  '<div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-slate-100/20 overflow-hidden relative animate-fade-in transition-colors">',
  '<div className="w-full max-w-sm bg-[#2563eb] rounded-[2rem] shadow-2xl border border-blue-400 overflow-hidden relative animate-fade-in transition-colors">'
);

// Login Form Submit Button (FB923C)
publicDash = publicDash.replace(
  'className="w-full bg-slate-100/20 hover:bg-slate-100/30 backdrop-blur-md text-slate-100 font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-slate-100/30 mt-4 active:scale-95"',
  'className="w-full bg-[#fb923c] hover:bg-[#ea580c] text-slate-900 font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(251,146,60,0.5)] border border-[#fb923c] mt-4 active:scale-95"'
);

fs.writeFileSync('pages/PublicDashboard.tsx', publicDash);

