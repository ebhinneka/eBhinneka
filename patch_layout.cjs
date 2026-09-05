const fs = require('fs');
const file = 'components/Layout.tsx';
let code = fs.readFileSync(file, 'utf-8');

// The original lines were:
// export const Layout: React.FC<{ children: React.ReactNode; showNav?: boolean; collapsed?: boolean }> = ({ children, showNav = true, collapsed: defaultCollapsed = true }) => {
//   const [collapsed, setCollapsed] = useState(defaultCollapsed);
//   const { signOut, profile, isOperator, isAdmin, academicYear, semester, activeScheduleVersion } = useAuth();

const oldCode = \`export const Layout: React.FC<{ children: React.ReactNode; showNav?: boolean; collapsed?: boolean }> = ({ children, showNav = true, collapsed: defaultCollapsed = true }) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const { signOut, profile, isOperator, isAdmin, academicYear, semester, activeScheduleVersion } = useAuth();\`;

const newCode = \`export const Layout: React.FC<{ children: React.ReactNode; showNav?: boolean; collapsed?: boolean }> = ({ children, showNav = true, collapsed: defaultCollapsed = false }) => {
  const { signOut, profile, isOperator, isAdmin, academicYear, semester, activeScheduleVersion } = useAuth();
  const [collapsed, setCollapsed] = useState(isAdmin ? false : defaultCollapsed);\`;

if (code.includes(oldCode)) {
    code = code.replace(oldCode, newCode);
    console.log("Patched collapsed state correctly.");
} else {
    console.log("Could not find the exact target string.");
}

// Let's also make sure the logo area has the toggle visible or not. The user says: 
// "untuk akun admin, pada bagian sidebar yang menampilkan menu, itu kita buat bisa menampilkan nama menu-nya atau hanya tampil logonya saja"
// Basically they just wanted to confirm it defaults to open (nama menu).

fs.writeFileSync(file, code);
