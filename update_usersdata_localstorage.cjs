const fs = require('fs');
let content = fs.readFileSync('pages/UsersData.tsx', 'utf8');

// Replace useState('') with useState(() => localStorage.getItem('supabaseServiceKey') || '')
content = content.replace(
  "const [serviceKey, setServiceKey] = useState('');",
  "const [serviceKey, setServiceKey] = useState(() => localStorage.getItem('supabaseServiceKey') || '');\n  useEffect(() => { if(serviceKey) localStorage.setItem('supabaseServiceKey', serviceKey); }, [serviceKey]);"
);

// We need to make sure useEffect is imported
if (!content.includes("useEffect")) {
  content = content.replace("useState", "useState, useEffect");
}

const oldSaveLogic = /const handleSaveEdit = async \(\) => \{[\s\S]*?finally \{ setSaving\(false\); \} \n  \};/;

const newSaveLogic = `  const handleSaveEdit = async () => {
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
      
      let profileError = null;

      if (serviceKey) {
          const SUPABASE_URL = 'https://nuxpvdmhclxftbgytrsq.supabase.co'; 
          const adminClient = createClient(SUPABASE_URL, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
          const { error } = await adminClient.from('profiles').update(payload).eq('id', editingUser.id);
          profileError = error;
          
          if (editingUser.nip) {
              await adminClient.from('tabel_guru').update({ mapel: finalMapel, wali_kelas: editFormData.wali_kelas }).eq('nip', editingUser.nip);
          }
      } else {
          const { error } = await supabase.from('profiles').update(payload).eq('id', editingUser.id);
          profileError = error;
          
          if (editingUser.nip) {
              await supabase.from('tabel_guru').update({ mapel: finalMapel, wali_kelas: editFormData.wali_kelas }).eq('nip', editingUser.nip);
          }
      }

      if (profileError) throw profileError;
      
      setProfiles(prev => prev.map(p => p.id === editingUser.id ? { ...p, mengajar_mapel: finalMapel, wali_kelas: editFormData.wali_kelas } : p));
      setEditingUser(null);
    } catch (err: any) { alert('Gagal menyimpan data: ' + err.message); } finally { setSaving(false); }
  };`;

content = content.replace(oldSaveLogic, newSaveLogic.trim());

fs.writeFileSync('pages/UsersData.tsx', content);
console.log("Updated UsersData.tsx with localStorage and hybrid save edit");
