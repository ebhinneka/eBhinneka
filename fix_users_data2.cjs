const fs = require('fs');
let content = fs.readFileSync('pages/UsersData.tsx', 'utf8');

const oldHandleSaveEditLogic = `      let finalMapel = editFormData.mengajar_mapel;
      if (editFormData.wali_kelas && editFormData.wali_kelas.trim() !== '') {
        const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()).filter(m => m !== '') : [];
        if (!mapels.includes('Sabtu bersama Wali Kelas')) {
           mapels.push('Sabtu bersama Wali Kelas');
           finalMapel = mapels.join(', ');
        }
      }`;
const newHandleSaveEditLogic = `      let finalMapel = editFormData.mengajar_mapel;
      const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()).filter(m => m !== '') : [];
      finalMapel = mapels.join(', ');`;
content = content.replace(oldHandleSaveEditLogic, newHandleSaveEditLogic);

fs.writeFileSync('pages/UsersData.tsx', content);
