const fs = require('fs');
let code = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');

// 1. Add activeScheduleVersion fallback and dbDay
const beforeFetch = `const todayStr = getWIBISOString();\n    const startOfDay = \`\${todayStr}T00:00:00+07:00\`;`;
const newVars = `const todayStr = getWIBISOString();
    const startOfDay = \`\${todayStr}T00:00:00+07:00\`;
    const tempDate = new Date();
    const jsDay = tempDate.getDay();
    const dbDay = jsDay === 0 ? 7 : jsDay;
    const activeScheduleVersion = 'Utama';`;
code = code.replace(beforeFetch, newVars);

// 2. Fix select query fields
code = code.replace(
  "supabase.from('schedules').select('hour').eq('day_of_week', dbDay)",
  "supabase.from('schedules').select('hour, academic_year, semester').eq('day_of_week', dbDay)"
);

fs.writeFileSync('pages/PublicDashboard.tsx', code);
console.log("Done");
