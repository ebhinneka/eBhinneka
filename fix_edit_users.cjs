const fs = require('fs');

let content = fs.readFileSync('pages/UsersData.tsx', 'utf8');

// Fix handleSaveEdit
content = content.replace(
`    if (!serviceKey) { alert("Service Role Key wajib diisi untuk mengubah data akademik user lain."); return; }`,
``
);

content = content.replace(
`      const SUPABASE_URL = 'https://aobgqejpjomgwxiosgin.supabase.co'; 
      const adminClient = createClient(SUPABASE_URL, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

      const { error: profileError } = await adminClient.from('profiles').update(payload).eq('id', editingUser.id);
      if (profileError) throw profileError;

      if (editingUser.nip) {
         await adminClient.from('tabel_guru').update({ mapel: finalMapel, wali_kelas: editFormData.wali_kelas }).eq('nip', editingUser.nip);
      }`,
`      const { error: profileError } = await supabase.from('profiles').update(payload).eq('id', editingUser.id);
      if (profileError) throw profileError;

      if (editingUser.nip) {
         await supabase.from('tabel_guru').update({ mapel: finalMapel, wali_kelas: editFormData.wali_kelas }).eq('nip', editingUser.nip);
      }`
);

// Fix the other SUPABASE_URL instances
content = content.replace(/https:\/\/aobgqejpjomgwxiosgin.supabase.co/g, 'https://nuxpvdmhclxftbgytrsq.supabase.co');

// Remove Service Key Input from Edit Modal
const modalEditRegex = /<div>\s*<label className="block text-xs font-bold text-slate-500 mb-1">Service Role Key \(Wajib\)<\/label>\s*<div className="relative">\s*<input type=\{showServiceKey \? "text" : "password"\} className="w-full border border-blue-300 rounded-lg p-2 pr-10 text-xs font-mono focus:ring-2 focus:ring-blue-600 bg-slate-100 text-slate-900 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-600" placeholder="Paste Service Role Key\.\.\." value=\{serviceKey\} onChange=\{e => setServiceKey\(e\.target\.value\)\}\/>\s*<button type="button" onClick=\{[\s\S]*?<\/button>\s*<\/div>\s*<p className="text-\[10px\] text-blue-600 mt-1">\* Diperlukan untuk update data akademik\.<\/p>\s*<\/div>/;

content = content.replace(modalEditRegex, '');

fs.writeFileSync('pages/UsersData.tsx', content);
console.log("Fixed UsersData.tsx");
