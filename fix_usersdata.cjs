const fs = require('fs');

let content = fs.readFileSync('pages/UsersData.tsx', 'utf8');

const oldLogic = `const handleSaveEdit = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      let finalMapel = editFormData.mengajar_mapel;
      if (editFormData.wali_kelas && editFormData.wali_kelas.trim() !== '') {
        const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()) : [];
        if (!mapels.includes('Sabtu bersama Wali Kelas')) {
           mapels.push('Sabtu bersama Wali Kelas');
           finalMapel = mapels.join(', ');
        }
      }
      const payload = {
          mengajar_mapel: finalMapel,
          wali_kelas: editFormData.wali_kelas
      };
      const { error: profileError } = await supabase.from('profiles').update(payload).eq('id', editingUser.id);
      if (profileError) throw profileError;
      if (editingUser.nip) {
         await supabase.from('tabel_guru').update({ mapel: finalMapel, wali_kelas: editFormData.wali_kelas }).eq('nip', editingUser.nip);
      }
      setProfiles(prev => prev.map(p => p.id === editingUser.id ? { ...p, mengajar_mapel: finalMapel, wali_kelas: editFormData.wali_kelas } : p));
      setEditingUser(null);
    } catch (err: any) { alert('Gagal menyimpan data: ' + err.message); } finally { setSaving(false); }
  };`;

const newLogic = `const handleSaveEdit = async () => {
    if (!editingUser) return;
    if (!serviceKey) { alert("Service Role Key wajib diisi untuk mengubah data akademik user lain."); return; }
    setSaving(true);
    try {
      let finalMapel = editFormData.mengajar_mapel;
      if (editFormData.wali_kelas && editFormData.wali_kelas.trim() !== '') {
        const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()) : [];
        if (!mapels.includes('Sabtu bersama Wali Kelas')) {
           mapels.push('Sabtu bersama Wali Kelas');
           finalMapel = mapels.join(', ');
        }
      }
      const payload = {
          mengajar_mapel: finalMapel,
          wali_kelas: editFormData.wali_kelas
      };
      
      const SUPABASE_URL = 'https://aobgqejpjomgwxiosgin.supabase.co'; 
      const adminClient = createClient(SUPABASE_URL, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

      const { error: profileError } = await adminClient.from('profiles').update(payload).eq('id', editingUser.id);
      if (profileError) throw profileError;
      if (editingUser.nip) {
         await adminClient.from('tabel_guru').update({ mapel: finalMapel, wali_kelas: editFormData.wali_kelas }).eq('nip', editingUser.nip);
      }
      setProfiles(prev => prev.map(p => p.id === editingUser.id ? { ...p, mengajar_mapel: finalMapel, wali_kelas: editFormData.wali_kelas } : p));
      setEditingUser(null);
    } catch (err: any) { alert('Gagal menyimpan data: ' + err.message); } finally { setSaving(false); }
  };`;

if (content.includes("const { error: profileError } = await supabase.from('profiles').update(payload).eq('id', editingUser.id);")) {
    // let's do a loose replacement
    let parts = content.split("const { error: profileError } = await supabase.from('profiles').update(payload).eq('id', editingUser.id);");
    let before = parts[0];
    let after = parts[1];
    
    // add check service key
    before = before.replace('if (!editingUser) return;', 'if (!editingUser) return;\n    if (!serviceKey) { alert("Service Role Key wajib diisi untuk mengubah data akademik user lain."); return; }');
    
    let replacement = `
      const SUPABASE_URL = 'https://aobgqejpjomgwxiosgin.supabase.co'; 
      const adminClient = createClient(SUPABASE_URL, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
      const { error: profileError } = await adminClient.from('profiles').update(payload).eq('id', editingUser.id);
`;
    after = after.replace("await supabase.from('tabel_guru').update({ mapel: finalMapel, wali_kelas: editFormData.wali_kelas }).eq('nip', editingUser.nip);", "await adminClient.from('tabel_guru').update({ mapel: finalMapel, wali_kelas: editFormData.wali_kelas }).eq('nip', editingUser.nip);");

    content = before + replacement + after;
    fs.writeFileSync('pages/UsersData.tsx', content);
    console.log("Replaced handleSaveEdit loose");
}
