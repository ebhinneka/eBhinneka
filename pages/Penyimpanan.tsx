import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { supabase } from '../services/supabase';
import { Database, Save, Loader2, Calendar } from 'lucide-react';

const Penyimpanan: React.FC = () => {
    const [academicYear, setAcademicYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeYear, setActiveYear] = useState('');
    const [academicYearStart, setAcademicYearStart] = useState('');
    const [academicYearEnd, setAcademicYearEnd] = useState('');
    const [activeSemester, setActiveSemester] = useState('');
    const [semesterStart, setSemesterStart] = useState('');
    const [semesterEnd, setSemesterEnd] = useState('');
    const [activeScheduleVersion, setActiveScheduleVersion] = useState('');
    const [availableScheduleVersions, setAvailableScheduleVersions] = useState<string[]>(['Utama']);
    const [availableYears, setAvailableYears] = useState<string[]>([]);
    
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data: yearsData } = await supabase.from('app_settings').select('value').eq('key', 'available_years').single();
                if (yearsData?.value) {
                    try {
                        const parsed = JSON.parse(yearsData.value);
                        setAvailableYears(parsed);
                    } catch(e) {
                        setAvailableYears([yearsData.value]);
                    }
                } else {
                    setAvailableYears(['2025/2026']);
                }

                const { data: currentData } = await supabase.from('app_settings').select('value').eq('key', 'academic_year').single();
                if (currentData?.value) {
                    setActiveYear(currentData.value);
                }

                const { data: semData } = await supabase.from('app_settings').select('value').eq('key', 'semester').single();
                if (semData?.value) {
                    setActiveSemester(semData.value);
                }

                const { data: ayStart } = await supabase.from('app_settings').select('value').eq('key', 'academic_year_start').single();
                if (ayStart?.value) setAcademicYearStart(ayStart.value);
                const { data: ayEnd } = await supabase.from('app_settings').select('value').eq('key', 'academic_year_end').single();
                if (ayEnd?.value) setAcademicYearEnd(ayEnd.value);
                const { data: semStart } = await supabase.from('app_settings').select('value').eq('key', 'semester_start').single();
                if (semStart?.value) setSemesterStart(semStart.value);
                const { data: semEnd } = await supabase.from('app_settings').select('value').eq('key', 'semester_end').single();
                if (semEnd?.value) setSemesterEnd(semEnd.value);
    
            } catch(e) {
                console.error("Error fetching settings:", e);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        if (!academicYear.trim()) {
            setMessage({ type: 'error', text: 'Tahun Ajaran tidak boleh kosong.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            let currentYears = [...availableYears];
            if (!currentYears.includes(academicYear)) {
                currentYears.push(academicYear);
                
                const { error: upsertError } = await supabase
                    .from('app_settings')
                    .upsert({ 
                        key: 'available_years', 
                        value: JSON.stringify(currentYears),
                        description: 'Daftar Tahun Ajaran Tersedia'
                    }, { onConflict: 'key' });
                
                if (upsertError) throw upsertError;
                setAvailableYears(currentYears);
                setMessage({ type: 'success', text: `Tahun Ajaran ${academicYear} berhasil ditambahkan ke dalam sistem.` });
                setAcademicYear(''); // Reset input
            } else {
                setMessage({ type: 'info', text: `Tahun Ajaran ${academicYear} sudah ada di dalam sistem.` });
            }
        } catch (error: any) {
            console.error("Error saving storage data:", error);
            setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSetActiveYear = async (year: string) => {
        setActiveYear(year);
        try {
            const { error } = await supabase
                .from('app_settings')
                .upsert({ 
                    key: 'academic_year', 
                    value: year,
                    description: 'Tahun Ajaran saat ini'
                }, { onConflict: 'key' });
            
            if (error) throw error;
            setMessage({ type: 'success', text: `Tahun Ajaran Aktif berhasil diubah menjadi ${year}.` });
        } catch (e: any) {
            console.error("Error setting active year:", e);
            setMessage({ type: 'error', text: 'Gagal mengubah Tahun Ajaran aktif.' });
        }
    };

    
    
    const handleSaveAcademicYearDates = async () => {
        try {
            await supabase.from('app_settings').upsert([
                { key: 'academic_year_start', value: academicYearStart },
                { key: 'academic_year_end', value: academicYearEnd }
            ], { onConflict: 'key' });
            setMessage({ type: 'success', text: 'Masa berlaku Tahun Ajaran berhasil disimpan.' });
        } catch (e: any) {
            setMessage({ type: 'error', text: 'Gagal menyimpan masa berlaku.' });
        }
    };
    

    const handleSaveSemesterDates = async () => {
        try {
            await supabase.from('app_settings').upsert([
                { key: 'semester_start', value: semesterStart },
                { key: 'semester_end', value: semesterEnd }
            ], { onConflict: 'key' });
            setMessage({ type: 'success', text: 'Masa berlaku Semester berhasil disimpan.' });
        } catch (e: any) {
            setMessage({ type: 'error', text: 'Gagal menyimpan masa berlaku.' });
        }
    };
    
    const handleSetActiveScheduleVersion = async (val: string) => {
        try {
            const { error } = await supabase.from('app_settings').upsert({ key: 'active_schedule_version', value: val });
            if (error) throw error;
            setActiveScheduleVersion(val);
            setMessage({ type: 'success', text: 'Versi Jadwal Aktif diperbarui!' });
            setTimeout(() => window.location.reload(), 1000);
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Gagal update versi jadwal: ' + err.message });
        }
    };

    const handleSetActiveSemester = async (sem: string) => {
        setActiveSemester(sem);
        try {
            const { error } = await supabase
                .from('app_settings')
                .upsert({ 
                    key: 'semester', 
                    value: sem,
                    description: 'Semester saat ini'
                }, { onConflict: 'key' });
            
            if (error) throw error;
            setMessage({ type: 'success', text: `Semester Aktif berhasil diubah menjadi ${sem}.` });
        } catch (e: any) {
            console.error("Error setting active semester:", e);
            setMessage({ type: 'error', text: 'Gagal mengubah Semester aktif.' });
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-slate-100 p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Database className="text-blue-500" /> Buat Tahun Ajaran
                    </h2>
                    
                    {message.text && (
                        <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.type === 'error' ? 'bg-sky-100 text-blue-600' : message.type === 'success' ? 'bg-sky-100 text-blue-500' : 'bg-blue-50 text-blue-600'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Section: Buat Tahun Ajaran */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                                <Calendar size={18} className="text-slate-500"/> Tambah Tahun Ajaran Baru
                            </h3>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Tahun Ajaran</label>
                                <input 
                                    type="text"
                                    className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border rounded-xl p-3 focus: focus:ring-2 focus:ring-blue-500 outline-none transition-all dark: dark: dark:border-slate-600"
                                    value={academicYear}
                                    onChange={(e) => setAcademicYear(e.target.value)}
                                    placeholder="Contoh: 2025/2026"
                                />
                            </div>
                            
                            <div>
                                <button 
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-slate-100 font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    Buat
                                </button>
                            </div>
                        </div>

                        
                                                {/* Section: Tahun Ajaran Aktif */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                                <Database size={18} className="text-slate-500"/> Tahun Ajaran Aktif
                            </h3>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Pilih Tahun Ajaran Aktif</label>
                                <select 
                                    className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border rounded-xl p-3 focus: focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium dark: dark: dark:border-slate-600"
                                    value={activeYear}
                                    onChange={(e) => handleSetActiveYear(e.target.value)}
                                >
                                    <option value="" disabled>Pilih Tahun Ajaran...</option>
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Berlaku dari tanggal</label>
                                    <input 
                                        type="date"
                                        className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border rounded-xl p-3 focus: focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium dark: dark: dark:border-slate-600"
                                        value={academicYearStart}
                                        onChange={(e) => setAcademicYearStart(e.target.value)}
                                        onBlur={handleSaveAcademicYearDates}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Sampai tanggal</label>
                                    <input 
                                        type="date"
                                        className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border rounded-xl p-3 focus: focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium dark: dark: dark:border-slate-600"
                                        value={academicYearEnd}
                                        onChange={(e) => setAcademicYearEnd(e.target.value)}
                                        onBlur={handleSaveAcademicYearDates}
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-4">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Pilih Semester Aktif</label>
                                <select 
                                    className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border rounded-xl p-3 focus: focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium dark: dark: dark:border-slate-600"
                                    value={activeSemester}
                                    onChange={(e) => handleSetActiveSemester(e.target.value)}
                                >
                                    <option value="" disabled>Pilih Semester...</option>
                                    <option value="Ganjil">Ganjil</option>
                                    <option value="Genap">Genap</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Berlaku mulai tanggal</label>
                                    <input 
                                        type="date"
                                        className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border rounded-xl p-3 focus: focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium dark: dark: dark:border-slate-600"
                                        value={semesterStart}
                                        onChange={(e) => setSemesterStart(e.target.value)}
                                        onBlur={handleSaveSemesterDates}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Sampai Tanggal</label>
                                    <input 
                                        type="date"
                                        className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 w-full border rounded-xl p-3 focus: focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium dark: dark: dark:border-slate-600"
                                        value={semesterEnd}
                                        onChange={(e) => setSemesterEnd(e.target.value)}
                                        onBlur={handleSaveSemesterDates}
                                    />
                                </div>
                            </div>
                        </div>

                        
                        {/* Section: Versi Jadwal Aktif */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                                <Calendar size={18} className="text-slate-500"/> Versi Jadwal Aktif
                            </h3>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Versi Jadwal (misal: Utama, Ramadhan)</label>
                                <div className="flex gap-2">
                                    
                                    <select 
                                        className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 flex-1 border rounded-xl p-3 focus: focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium dark: dark: dark:border-slate-600"
                                        value={activeScheduleVersion}
                                        onChange={(e) => setActiveScheduleVersion(e.target.value)}
                                    >
                                        {availableScheduleVersions.map(v => <option key={v} value={v}>{v}</option>)}
                                        {!availableScheduleVersions.includes(activeScheduleVersion) && activeScheduleVersion && <option value={activeScheduleVersion}>{activeScheduleVersion}</option>}
                                    </select>
                                    <button 
                                        onClick={() => handleSetActiveScheduleVersion(activeScheduleVersion)}
                                        className="px-4 bg-blue-600 hover:bg-blue-700 text-slate-100 rounded-xl font-medium transition-colors"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className="mt-8 text-xs text-slate-500 bg-gray-50 p-4 rounded-xl">
                        <strong>Catatan:</strong> "Tambah Tahun Ajaran Baru" digunakan untuk mendaftarkan tahun ajaran ke sistem. Sedangkan "Tahun Ajaran Aktif" digunakan untuk mengatur tahun ajaran default yang digunakan saat ini.
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Penyimpanan;
