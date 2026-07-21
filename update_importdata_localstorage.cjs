const fs = require('fs');
let content = fs.readFileSync('pages/ImportData.tsx', 'utf8');

content = content.replace(
  "const [serviceRoleKey, setServiceRoleKey] = useState('');",
  "const [serviceRoleKey, setServiceRoleKey] = useState(() => localStorage.getItem('supabaseServiceKey') || '');\n  useEffect(() => { if(serviceRoleKey) localStorage.setItem('supabaseServiceKey', serviceRoleKey); }, [serviceRoleKey]);"
);

fs.writeFileSync('pages/ImportData.tsx', content);
console.log("Updated ImportData.tsx with localStorage");
