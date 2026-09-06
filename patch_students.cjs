const fs = require('fs');
const file = 'pages/StudentsData.tsx';
let code = fs.readFileSync(file, 'utf-8');

// 1. Update state type
code = code.replace(
  "status: 'aktif' as 'aktif' | 'tidak_aktif'",
  "status: 'aktif' as 'aktif' | 'tidak_aktif' | 'pindah_mutasi'"
);

// 2. Update handleSaveKeluar
const oldHandleSaveKeluar = `  const handleSaveKeluar = async () => {
      if (!mutasiKeluarData.kelas || !mutasiKeluarData.studentId) {
          alert("Pilih Kelas dan Murid terlebih dahulu.");
          return;
      }
      setSaving(true);
      try {
          if (mutasiKeluarData.status === 'tidak_aktif') {
              const { error } = await supabase.from('students').delete().eq('id', mutasiKeluarData.studentId);
              if (error) throw error;
              setStudents(prev => prev.filter(s => s.id !== mutasiKeluarData.studentId));
              alert("Data murid berhasil dihapus (Mutasi Keluar).");
          } else {
              alert("Tidak ada perubahan disimpan karena status 'Aktif'.");
          }`;

const newHandleSaveKeluar = `  const handleSaveKeluar = async () => {
      if (!mutasiKeluarData.kelas || !mutasiKeluarData.studentId) {
          alert("Pilih Kelas dan Murid terlebih dahulu.");
          return;
      }
      setSaving(true);
      try {
          if (mutasiKeluarData.status === 'tidak_aktif') {
              // Delete dependent records first to avoid foreign key constraints
              await supabase.from('attendance_logs').delete().eq('student_id', mutasiKeluarData.studentId);
              await supabase.from('journal_notes').delete().eq('student_id', mutasiKeluarData.studentId);
              await supabase.from('homeroom_attendance').delete().eq('student_id', mutasiKeluarData.studentId);

              const { error } = await supabase.from('students').delete().eq('id', mutasiKeluarData.studentId);
              if (error) throw error;
              setStudents(prev => prev.filter(s => s.id !== mutasiKeluarData.studentId));
              alert("Data murid berhasil dihapus permanen.");
          } else if (mutasiKeluarData.status === 'pindah_mutasi') {
              const { error } = await supabase.from('students').update({ kelas: 'Mutasi' }).eq('id', mutasiKeluarData.studentId);
              if (error) throw error;
              setStudents(prev => prev.filter(s => s.id !== mutasiKeluarData.studentId));
              alert("Murid berhasil dipindahkan ke daftar Mutasi.");
          } else {
              alert("Pilih tindakan konfirmasi terlebih dahulu.");
          }`;

code = code.replace(oldHandleSaveKeluar, newHandleSaveKeluar);

// 3. Update the UI for Konfirmasi Tindakan
const oldUI = `<div className="flex flex-col gap-2">
                                            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-blue-300/50 rounded-lg transition-colors">
                                                <input type="radio" name="status" value="tidak_aktif" checked={mutasiKeluarData.status === 'tidak_aktif'} onChange={() => setMutasiKeluarData({...mutasiKeluarData, status: 'tidak_aktif'})} className="text-blue-600 focus:ring-blue-500"/>
                                                <div><span className="text-sm font-bold text-blue-600 block">Hapus Permanen</span><span className="text-[10px] text-blue-500">Data akan hilang dari database.</span></div>
                                            </label>
                                        </div>`;

const newUI = `<div className="flex flex-col gap-2">
                                            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-blue-300/50 rounded-lg transition-colors">
                                                <input type="radio" name="status" value="pindah_mutasi" checked={mutasiKeluarData.status === 'pindah_mutasi'} onChange={() => setMutasiKeluarData({...mutasiKeluarData, status: 'pindah_mutasi'})} className="text-blue-600 focus:ring-blue-500"/>
                                                <div><span className="text-sm font-bold text-blue-600 block">Pindah ke Mutasi (Aman)</span><span className="text-[10px] text-blue-500">Data absen & catatan lama tetap tersimpan.</span></div>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-blue-300/50 rounded-lg transition-colors">
                                                <input type="radio" name="status" value="tidak_aktif" checked={mutasiKeluarData.status === 'tidak_aktif'} onChange={() => setMutasiKeluarData({...mutasiKeluarData, status: 'tidak_aktif'})} className="text-red-500 focus:ring-red-500"/>
                                                <div><span className="text-sm font-bold text-red-600 block">Hapus Permanen</span><span className="text-[10px] text-red-500">Data akan hilang dari database.</span></div>
                                            </label>
                                        </div>`;

code = code.replace(oldUI, newUI);

const oldButton = `<button onClick={handleSaveKeluar} disabled={saving || !mutasiKeluarData.studentId} className={\`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 shadow-lg disabled:opacity-50 transition-all \${mutasiKeluarData.status === 'tidak_aktif' ? 'bg-blue-600 hover:bg-blue-600 text-slate-100 shadow-blue-300' : 'bg-slate-200 text-slate-500'}\`}>{saving ? <Loader2 className="animate-spin" /> : 'Proses Mutasi Keluar'}</button>`;
const newButton = `<button onClick={handleSaveKeluar} disabled={saving || !mutasiKeluarData.studentId || mutasiKeluarData.status === 'aktif'} className={\`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 shadow-lg disabled:opacity-50 transition-all \${mutasiKeluarData.status === 'tidak_aktif' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-300' : mutasiKeluarData.status === 'pindah_mutasi' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-300' : 'bg-slate-200 text-slate-500'}\`}>{saving ? <Loader2 className="animate-spin" /> : 'Proses Mutasi Keluar'}</button>`;

code = code.replace(oldButton, newButton);

fs.writeFileSync(file, code);
console.log("Patched StudentsData.tsx successfully!");
