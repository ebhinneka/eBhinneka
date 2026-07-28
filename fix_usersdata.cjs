const fs = require('fs');
let code = fs.readFileSync('pages/UsersData.tsx', 'utf8');

code = code.replace(
  "const [editFormData, setEditFormData] = useState({\n    mengajar_mapel: '',\n    wali_kelas: ''\n  });",
  "const [editFormData, setEditFormData] = useState({\n    mengajar_mapel: '',\n    wali_kelas: '',\n    jabatan_tambahan: '-'\n  });"
);

fs.writeFileSync('pages/UsersData.tsx', code);
console.log("Done");
