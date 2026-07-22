const fs = require('fs');
let content = fs.readFileSync('pages/StudentsData.tsx', 'utf8');

content = content.replace(
    "const { academicYear } = useAuth();",
    "const { academicYear, availableClasses, refreshClasses } = useAuth();"
);

// We should also replace the hardcoded availableClasses
content = content.replace(
    "const availableClasses = ['7A','7B','7C','7D','7E','7F','7G','7H',\n                            '8A','8B','8C','8D','8E','8F','8G','8H',\n                            '9A','9B','9C','9D','9E','9F','9G','9H'];",
    ""
);

// What if the form wants to add a new class? We should change the select to input with datalist or just an input?
// Wait, if we use a text input for formData.kelas, we can type a new class and see existing. Let's do that!
// For the filters, keeping it select is fine.
const newAddClass = `<div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Kelas</label>
                                        <input list="class-options" className="w-full border border-slate-200 rounded-xl p-3 bg-slate-100 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-600" value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value.toUpperCase()})} placeholder="Cth: 7A" />
                                        <datalist id="class-options">
                                            {availableClasses.map(c => <option key={c} value={c} />)}
                                        </datalist>
                                    </div>`;

content = content.replace(
    /<div>\s*<label className="block text-xs font-bold text-slate-500 mb-1\.5 ml-1">Kelas<\/label>\s*<select className="w-full border border-slate-200 rounded-xl p-3 bg-slate-100 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-600" value=\{formData\.kelas\} onChange=\{e => setFormData\(\{\.\.\.formData, kelas: e\.target\.value\}\)\}>\{availableClasses\.map\(c => <option key=\{c\} value=\{c\}>\{c\}<\/option>\)\}<\/select>\s*<\/div>/g,
    newAddClass
);

// Update fetch to refreshClasses when new class is added
// Find handleSave = async
const handleSave = `const handleSave = async () => {`;
// find fetchData();
const oldFetchData = `setModalType(null);
          fetchData();`;
const newFetchData = `setModalType(null);
          fetchData();
          refreshClasses();`;
content = content.replace(oldFetchData, newFetchData);

fs.writeFileSync('pages/StudentsData.tsx', content);
