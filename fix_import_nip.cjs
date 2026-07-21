const fs = require('fs');
let content = fs.readFileSync('pages/ImportData.tsx', 'utf8');
content = content.replace(
    /nip: String\(row\['NIPY'\] \|\| row\['nip'\]\),/g,
    "nip: String(row['NIPY'] || row['NIP'] || row['nip'] || row['nipy'] || ''),"
);
content = content.replace(
    /const nip = String\(row\['NIPY Guru'\] \|\| row\['nip guru'\] \|\| row\['NIPY'\] \|\| ''\);/g,
    "const nip = String(row['NIPY Guru'] || row['NIP Guru'] || row['nip guru'] || row['NIPY'] || row['NIP'] || row['nip'] || '');"
);
fs.writeFileSync('pages/ImportData.tsx', content);
