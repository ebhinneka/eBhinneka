const fs = require('fs');
let publicDash = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');

// Replace text-slate-100 with text-white in PublicDashboard (this is safe since it's mostly login stuff that should be white on blue now)
publicDash = publicDash.replace(/text-slate-100/g, 'text-white');
publicDash = publicDash.replace(/text-blue-200/g, 'text-white/90');
publicDash = publicDash.replace(/text-blue-300/g, 'text-white/70');

fs.writeFileSync('pages/PublicDashboard.tsx', publicDash);
