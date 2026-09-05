const fs = require('fs');
const file = 'components/Layout.tsx';
let code = fs.readFileSync(file, 'utf-8');

const target1 = `export const Layout: React.FC<{ children: React.ReactNode; showNav?: boolean; collapsed?: boolean }> = ({ children, showNav = true, collapsed: defaultCollapsed = false }) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const { signOut, profile, isOperator, isAdmin, academicYear, semester, activeScheduleVersion } = useAuth();`;

const replacement1 = `export const Layout: React.FC<{ children: React.ReactNode; showNav?: boolean; collapsed?: boolean }> = ({ children, showNav = true, collapsed: defaultCollapsed = false }) => {
  const { signOut, profile, isOperator, isAdmin, academicYear, semester, activeScheduleVersion } = useAuth();
  const [collapsed, setCollapsed] = useState(isAdmin ? false : defaultCollapsed);`;

if (code.includes(target1)) {
    code = code.replace(target1, replacement1);
    fs.writeFileSync(file, code);
    console.log("Patched successfully");
} else {
    console.log("Could not find target1");
}
