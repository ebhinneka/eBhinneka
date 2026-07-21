const fs = require('fs');

let content = fs.readFileSync('pages/UsersData.tsx', 'utf8');

const oldLogic = `  const handleSaveEdit = async () => {
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
      
      const SUPABASE_URL = 'https://nuxpvdmhclxftbgytrsq.supabase.co'; 
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

const newLogic = `  const handleSaveEdit = async () => {
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

// Let's use regex instead since exact spacing might differ
const regex = /const handleSaveEdit = async \(\) => \{[\s\S]*?finally \{ setSaving\(false\); \} \n  \};/;
content = content.replace(regex, newLogic.trim());

fs.writeFileSync('pages/UsersData.tsx', content);
console.log("Fixed handleSaveEdit");
