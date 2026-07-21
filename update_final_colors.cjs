const fs = require('fs');

// 1. Update Dashboard.tsx
let dashboard = fs.readFileSync('pages/Dashboard.tsx', 'utf8');

// Container Assalamualaikum
dashboard = dashboard.replace(
  '<div className="bg-[#fb923c]/80 backdrop-blur-2xl rounded-[2rem] p-6 md:p-8 text-[#0f172a] shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/20 relative overflow-hidden">',
  '<div className="bg-[#2563eb] rounded-[2rem] p-6 md:p-8 text-white shadow-[0_8px_32px_rgba(37,99,235,0.4)] border border-white/20 relative overflow-hidden">'
);

// Texts inside container
dashboard = dashboard.replace(
  '<p className="text-[#0f172a] text-sm font-bold opacity-90 mb-0.5 tracking-wide">{greeting}</p>',
  '<p className="text-white text-sm font-bold opacity-90 mb-0.5 tracking-wide">{greeting}</p>'
);
dashboard = dashboard.replace(
  '<h1 className="text-xl md:text-3xl font-extrabold leading-tight tracking-tight text-[#0f172a] mb-1 drop-shadow-md">{profile?.full_name}</h1>',
  '<h1 className="text-xl md:text-3xl font-extrabold leading-tight tracking-tight text-white mb-1 drop-shadow-md">{profile?.full_name}</h1>'
);
dashboard = dashboard.replace(
  '<p className="text-[#0f172a]/80 text-sm font-mono font-medium mb-3">{isAdmin ? \'Administrator\' : (profile?.nip || \'NIPY -\')}</p>',
  '<p className="text-white/80 text-sm font-mono font-medium mb-3">{isAdmin ? \'Administrator\' : (profile?.nip || \'NIPY -\')}</p>'
);

// Performance colors
dashboard = dashboard.replace(
  /let performanceColor = "text-blue-500 bg-blue-500\/20 border-blue-500\/30";/g,
  'let performanceColor = "text-[#2563eb] bg-white border-white";'
);
dashboard = dashboard.replace(
  /performanceColor = "text-blue-500 bg-blue-500\/20 border-blue-500\/30";/g,
  'performanceColor = "text-[#2563eb] bg-white border-white";'
);
dashboard = dashboard.replace(
  /performanceColor = "text-blue-500 bg-blue-600\/20 border-blue-600\/30";/g,
  'performanceColor = "text-[#2563eb] bg-white border-white";'
);

fs.writeFileSync('pages/Dashboard.tsx', dashboard);


// 2. Update PublicDashboard.tsx
let publicDash = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');

// "Login Sebagai" trigger button
publicDash = publicDash.replace(
  'className="w-full bg-[#fb923c] hover:bg-[#ea580c] border-2 border-[#fb923c] text-slate-900 font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all"',
  'className="w-full bg-[#2563eb] hover:bg-blue-700 border-2 border-[#2563eb] text-white font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all"'
);

// "Masuk Sebagai" Popup
publicDash = publicDash.replace(
  '<div className="w-full grid gap-4 animate-fade-in bg-[#93c5fd] p-8 rounded-[2rem] shadow-2xl border border-blue-200">',
  '<div className="w-full grid gap-4 animate-fade-in bg-[#2563eb] p-8 rounded-[2rem] shadow-2xl border border-blue-400">'
);
publicDash = publicDash.replace(
  '<h2 className="text-xl font-extrabold text-[#0f172a]">Masuk Sebagai</h2>',
  '<h2 className="text-xl font-extrabold text-white">Masuk Sebagai</h2>'
);
publicDash = publicDash.replace(
  '<button onClick={() => setShowLoginModal(false)} className="text-slate-900/70 hover:text-slate-900 p-2 rounded-full bg-slate-900/10 hover:bg-slate-900/20 transition-colors"><X size={24}/></button>',
  '<button onClick={() => setShowLoginModal(false)} className="text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={24}/></button>'
);

// "Masuk Aplikasi" Submit button (Login Guru)
publicDash = publicDash.replace(
  'className="w-full bg-[#fb923c] hover:bg-[#ea580c] text-slate-900 font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(251,146,60,0.5)] border border-[#fb923c] mt-4 active:scale-95"',
  'className="w-full bg-white hover:bg-slate-100 text-[#2563eb] font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg border border-white mt-4 active:scale-95"'
);

fs.writeFileSync('pages/PublicDashboard.tsx', publicDash);
