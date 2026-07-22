const fs = require('fs');

function replaceClasses(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    if (content.includes('const [classes, setClasses] = useState')) {
        content = content.replace("const [classes, setClasses] = useState<string[]>([]);", "");
        
        if (content.match(/const {[^}]+} = useAuth\(\);/)) {
            let authMatch = content.match(/const {([^}]+)} = useAuth\(\);/)[1];
            if (!authMatch.includes('availableClasses')) {
                content = content.replace(/const {([^}]+)} = useAuth\(\);/, "const {$1, availableClasses} = useAuth();");
            }
        }
        
        // Remove the fetch for classes block
        // This is a bit tricky, let's just replace the map
        content = content.replace(/classes\.map/g, "availableClasses.map");
        content = content.replace(/setClasses\([^)]+\);/g, "");
    }
    
    fs.writeFileSync(file, content);
}

replaceClasses('pages/RekapDhuha.tsx');
replaceClasses('pages/AbsensiRapor.tsx');
replaceClasses('pages/LaporanJurnal.tsx');

