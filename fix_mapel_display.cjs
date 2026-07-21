const fs = require('fs');
let content = fs.readFileSync('pages/UsersData.tsx', 'utf8');

const oldEditLogic = `const rawMapels = editFormData.mengajar_mapel || "";
                                    const mapelsArr = rawMapels.split(',').map(m => m.trim());
                                    const displayMapels = mapelsArr.filter(m => m !== 'Sabtu bersama Wali Kelas' && m !== '');`;
const newEditLogic = `const rawMapels = editFormData.mengajar_mapel || "";
                                    const rawArr = rawMapels ? rawMapels.split(',') : [];
                                    const displayMapels = rawArr.filter(m => m.trim() !== 'Sabtu bersama Wali Kelas').map(m => m.trim());`;

content = content.replace(oldEditLogic, newEditLogic);

const oldAddLogic = `const rawMapels = newUser.mapel || "";
                                        const mapelsArr = rawMapels.split(',').map(m => m.trim());
                                        const displayMapels = mapelsArr.filter(m => m !== 'Sabtu bersama Wali Kelas' && m !== '');`;
const newAddLogic = `const rawMapels = newUser.mapel || "";
                                        const rawArr = rawMapels ? rawMapels.split(',') : [];
                                        const displayMapels = rawArr.filter(m => m.trim() !== 'Sabtu bersama Wali Kelas').map(m => m.trim());`;

content = content.replace(oldAddLogic, newAddLogic);

// also fix the button adding ' ' to just add '' but wait!
// if we add '', and rawArr is ["Math", ""], then join(',') makes "Math,".
// split(',') makes ["Math", ""]. 
// map(m => m.trim()) makes ["Math", ""]. 
// So it stays in the array! It works!

fs.writeFileSync('pages/UsersData.tsx', content);
