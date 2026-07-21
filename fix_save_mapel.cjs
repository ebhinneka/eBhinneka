const fs = require('fs');
let content = fs.readFileSync('pages/UsersData.tsx', 'utf8');

content = content.replace(
    /const mapels = finalMapel \? finalMapel\.split\(\',\/\)\.map\(m => m\.trim\(\)\) : \[\];/g, 
    "const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()).filter(m => m !== '') : [];"
);

content = content.replace(
    /const mapelsNew = finalMapelNew \? finalMapelNew\.split\(\',\/\)\.map\(m => m\.trim\(\)\) : \[\];/g, 
    "const mapelsNew = finalMapelNew ? finalMapelNew.split(',').map(m => m.trim()).filter(m => m !== '') : [];"
);

// Ah wait, the actual text in handleSaveEdit is:
// const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()) : [];
content = content.replace(
    "const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()) : [];",
    "const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()).filter(m => m !== '') : [];"
);

content = content.replace(
    "const mapelsNew = finalMapelNew ? finalMapelNew.split(',').map(m => m.trim()) : [];",
    "const mapelsNew = finalMapelNew ? finalMapelNew.split(',').map(m => m.trim()).filter(m => m !== '') : [];"
);

// Also need to sanitize the finalMapel before saving to the DB:
// Instead of just relying on the if (wali_kelas) check, we should unconditionally clean it.
// Let's modify handleSaveEdit
const oldSaveLogic = /const handleSaveEdit = async \(\) => \{[\s\S]*?finally \{ setSaving\(false\); \} \n  \};/;
const newSaveLogic = `const handleSaveEdit = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      let finalMapel = editFormData.mengajar_mapel;
      
      const mapels = finalMapel ? finalMapel.split(',').map(m => m.trim()).filter(m => m !== '') : [];
      if (editFormData.wali_kelas && editFormData.wali_kelas.trim() !== '') {
        if (!mapels.includes('Sabtu bersama Wali Kelas')) {
           mapels.push('Sabtu bersama Wali Kelas');
        }
      }
      finalMapel = mapels.join(', ');
      
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

content = content.replace(oldSaveLogic, newSaveLogic);

// Let's modify handleCreateUser as well
const oldCreateLogic = /const handleCreateUser = async \(\) => \{[\s\S]*?finally \{ setSaving\(false\); \}\n  \};/;
const newCreateLogic = `const handleCreateUser = async () => {
      if (!newUser.nip || !newUser.fullName || !newUser.password) { alert("NIPY, Nama Lengkap, dan Password wajib diisi."); return; }
      if (!serviceKey) { alert("Service Role Key wajib diisi untuk membuat akun Login."); return; }
      setSaving(true);
      try {
          let finalMapelNew = newUser.mapel;
          
          const mapelsNew = finalMapelNew ? finalMapelNew.split(',').map(m => m.trim()).filter(m => m !== '') : [];
          if (newUser.waliKelas && newUser.waliKelas.trim() !== '') {
              if (!mapelsNew.includes('Sabtu bersama Wali Kelas')) {
                 mapelsNew.push('Sabtu bersama Wali Kelas');
              }
          }
          finalMapelNew = mapelsNew.join(', ');

          const SUPABASE_URL = 'https://nuxpvdmhclxftbgytrsq.supabase.co'; 
          const adminClient = createClient(SUPABASE_URL, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
          const email = \`\${newUser.nip}@sekolah.id\`;
          const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
              email: email,
              password: newUser.password,
              email_confirm: true,
              user_metadata: { full_name: newUser.fullName }
          });
          if (authError) throw new Error("Gagal membuat Auth User: " + authError.message);
          if (!authData.user) throw new Error("Gagal mendapatkan data user baru.");
          const userId = authData.user.id;
          const { error: profileError } = await supabase.from('profiles').insert({
              id: userId, nip: newUser.nip, full_name: newUser.fullName, role: newUser.role,
              mengajar_mapel: finalMapelNew, wali_kelas: newUser.waliKelas, password_info: newUser.password
          });
          if (profileError) throw new Error("Gagal menyimpan Profile: " + profileError.message);
          
          await supabase.from('tabel_guru').upsert({ nip: newUser.nip, nama_lengkap: newUser.fullName, mapel: finalMapelNew, wali_kelas: newUser.waliKelas });
          alert("User berhasil ditambahkan!");
          setIsAddModalOpen(false);
          setNewUser({ nip: '', fullName: '', role: 'user', mapel: '', waliKelas: '', password: 'bti' });
          fetchProfiles();
      } catch (err: any) { alert('Gagal: ' + err.message); } finally { setSaving(false); }
  };`;
  
content = content.replace(oldCreateLogic, newCreateLogic);

fs.writeFileSync('pages/UsersData.tsx', content);
console.log("Fixed save logic for both Edit and Create");
