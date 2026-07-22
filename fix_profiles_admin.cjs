const fs = require('fs');

let importData = fs.readFileSync('pages/ImportData.tsx', 'utf8');
importData = importData.replace(
    /await supabase\.from\('profiles'\)\.upsert/g,
    "await adminClient.from('profiles').upsert"
);
// Also for existing profile select, since anon might not see all profiles if RLS blocks
importData = importData.replace(
    /await supabase\.from\('profiles'\)\.select\('id'\)/g,
    "await adminClient.from('profiles').select('id')"
);
fs.writeFileSync('pages/ImportData.tsx', importData);

let usersData = fs.readFileSync('pages/UsersData.tsx', 'utf8');
usersData = usersData.replace(
    /await supabase\.from\('profiles'\)\.insert\(\{/g,
    "await adminClient.from('profiles').upsert({"
);
fs.writeFileSync('pages/UsersData.tsx', usersData);

