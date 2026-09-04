import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { supabase } from '../services/supabase';
import { FileText, Loader2, CalendarDays, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const getWIBISOString = () => {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const nd = new Date(utc + (3600000 * 7));
    const year = nd.getFullYear();
    const month = String(nd.getMonth() + 1).padStart(2, '0');
    const day = String(nd.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

interface Teacher {
    id: string;
    full_name: string;
}

interface AttendanceRecord {
    teacher_id: string;
    material: string;
    created_at: string;
}

const StaffRecap: React.FC = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState(getWIBISOString());
    const [staffList, setStaffList] = useState<Teacher[]>([]);
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [activeTab, setActiveTab] = useState<'harian' | 'periodik'>('harian');
    const [startDate, setStartDate] = useState(getWIBISOString());
    const [endDate, setEndDate] = useState(getWIBISOString());
    const [periodicData, setPeriodicData] = useState<{ teacher_id: string, count: number, presentDates: string[] }[]>([]);
    const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);

    useEffect(() => {
        if (isAdmin === false) {
            navigate('/dashboard');
        } else {
            if (activeTab === 'harian') {
                fetchData();
            } else {
                fetchPeriodicData();
            }
        }
    }, [isAdmin, filterDate, activeTab, startDate, endDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Get all teachers who are Staff
            const { data: teachers, error: tErr } = await supabase
                .from('profiles')
                .select('id, full_name')
                .eq('jabatan_tambahan', 'Staff')
                .order('full_name', { ascending: true });

            if (tErr) throw tErr;
            setStaffList(teachers || []);

            // Get attendance for the selected date
            const { data: journals, error: jErr } = await supabase
                .from('journals')
                .select('teacher_id, material, created_at')
                .eq('kelas', 'STAFF')
                .eq('subject', 'KEHADIRAN')
                .gte('created_at', `${filterDate}T00:00:00+07:00`)
                .lte('created_at', `${filterDate}T23:59:59+07:00`);

            if (jErr) throw jErr;
            setAttendanceData(journals || []);
        } catch (error) {
            console.error("Error fetching staff recap:", error);
        } finally {
            setLoading(false);
        }
    };

    
    
    const getWorkingDays = (start: string, end: string) => {
        const days = [];
        let curr = new Date(start);
        const last = new Date(end);
        while (curr <= last) {
            // Exclude Fridays (5)
            if (curr.getDay() !== 5) {
                days.push(curr.toISOString().split('T')[0]);
            }
            curr.setDate(curr.getDate() + 1);
        }
        return days;
    };

    const fetchPeriodicData = async () => {
        setLoading(true);
        try {
            // Get all teachers who are Staff
            const { data: teachers, error: tErr } = await supabase
                .from('profiles')
                .select('id, full_name')
                .eq('jabatan_tambahan', 'Staff')
                .order('full_name', { ascending: true });

            if (tErr) throw tErr;
            setStaffList(teachers || []);

            // Get attendance for the selected date range
            const { data: journals, error: jErr } = await supabase
                .from('journals')
                .select('teacher_id, created_at')
                .eq('kelas', 'STAFF')
                .eq('subject', 'KEHADIRAN')
                .gte('created_at', `${startDate}T00:00:00+07:00`)
                .lte('created_at', `${endDate}T23:59:59+07:00`);

            if (jErr) throw jErr;

            // Process periodic data: count unique days per teacher
            const teacherDays = new Map<string, Set<string>>();
            
            (journals || []).forEach(j => {
                const date = j.created_at.split('T')[0];
                if (!teacherDays.has(j.teacher_id)) {
                    teacherDays.set(j.teacher_id, new Set());
                }
                teacherDays.get(j.teacher_id)!.add(date);
            });

            const processedData = Array.from(teacherDays.entries()).map(([teacher_id, daysSet]) => ({
                teacher_id,
                count: daysSet.size,
                presentDates: Array.from(daysSet)
            }));

            setPeriodicData(processedData);
        } catch (error) {
            console.error("Error fetching periodic staff recap:", error);
        } finally {
            setLoading(false);
        }
    };

    const getAttendanceStatus = (teacherId: string, type: 'Datang' | 'Pulang') => {
        const record = attendanceData.find(j => j.teacher_id === teacherId && (
            type === 'Datang' ? (j.material === 'Datang' || j.material === 'Hadir') : j.material === 'Pulang'
        ));
        
        if (record) {
            const time = new Date(record.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            return (
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800 inline-flex">
                    <CheckCircle2 size={14} />
                    <span>{time} WIB</span>
                </div>
            );
        }
        
        return (
            <div className="flex items-center gap-1.5 text-red-500 font-bold bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-md border border-red-100 dark:border-red-800 inline-flex">
                <XCircle size={14} />
                <span>Belum</span>
            </div>
        );
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
                
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                            <FileText className="text-blue-500" size={28} />
                            Rekap Kehadiran Staff
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Pantau presensi harian dan periodik guru dengan jabatan tambahan Staff.
                        </p>
                    </div>
                    
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('harian')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'harian' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Harian
                        </button>
                        <button
                            onClick={() => setActiveTab('periodik')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'periodik' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Periodik
                        </button>
                    </div>
                </div>

                {/* FILTERS */}
                {activeTab === 'harian' ? (
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-max">
                        <div className="flex items-center gap-2 px-3 border-r border-slate-200 dark:border-slate-700">
                            <CalendarDays size={18} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-500 uppercase">Tanggal</span>
                        </div>
                        <input 
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-0 focus:outline-none cursor-pointer"
                        />
                    </div>
                ) : (
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-max">
                        <div className="flex items-center gap-2 px-3 border-r border-slate-200 dark:border-slate-700">
                            <CalendarDays size={18} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-500 uppercase">Periode</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-0 focus:outline-none cursor-pointer"
                            />
                            <span className="text-slate-400 text-sm font-bold">s/d</span>
                            <input 
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-0 focus:outline-none cursor-pointer"
                            />
                        </div>
                    </div>
                )}

                
                {/* TABLE */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                        <h2 className="font-bold text-slate-700 dark:text-slate-300">
                            {activeTab === 'harian' ? 'Data Presensi Harian' : 'Rekapitulasi Kehadiran Periodik'}
                        </h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-4 text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Staff</th>
                                    {activeTab === 'harian' ? (
                                        <>
                                            <th className="px-6 py-4 text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Presensi Datang</th>
                                            <th className="px-6 py-4 text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Presensi Pulang</th>
                                        </>
                                    ) : (
                                        <th className="px-6 py-4 text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Jumlah Kehadiran (Hari)</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={activeTab === 'harian' ? 4 : 3} className="p-10 text-center">
                                            <Loader2 size={32} className="animate-spin text-blue-500 mx-auto" />
                                            <p className="text-slate-500 mt-2 font-medium">Memuat data...</p>
                                        </td>
                                    </tr>
                                ) : staffList.length === 0 ? (
                                    <tr>
                                        <td colSpan={activeTab === 'harian' ? 4 : 3} className="p-10 text-center text-slate-500 dark:text-slate-400 font-medium">
                                            Tidak ada guru dengan jabatan tambahan Staff.
                                        </td>
                                    </tr>
                                ) : (
                                    staffList.map((staff, idx) => (
                                        <React.Fragment key={staff.id}>
                                        <tr 
                                            className={`border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${activeTab === 'periodik' ? 'cursor-pointer' : ''}`}
                                            onClick={() => activeTab === 'periodik' && setExpandedStaffId(expandedStaffId === staff.id ? null : staff.id)}
                                        >
                                            <td className="px-6 py-4 text-sm font-bold text-slate-500 dark:text-slate-400">
                                                {idx + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-100">
                                                {staff.full_name}
                                            </td>
                                            {activeTab === 'harian' ? (
                                                <>
                                                    <td className="px-6 py-4 text-center">
                                                        {getAttendanceStatus(staff.id, 'Datang')}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {getAttendanceStatus(staff.id, 'Pulang')}
                                                    </td>
                                                </>
                                            ) : (
                                                <td className="px-6 py-4 text-center font-bold text-blue-600 dark:text-blue-400 text-lg">
                                                    {periodicData.find(d => d.teacher_id === staff.id)?.count || 0}
                                                </td>
                                            )}
                                        </tr>
                                        {activeTab === 'periodik' && expandedStaffId === staff.id && (
                                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                <td colSpan={3} className="p-6">
                                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-inner">
                                                        <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                                                            Detail Kehadiran (Tanpa Hari Jumat)
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {getWorkingDays(startDate, endDate).map(dateStr => {
                                                                const present = periodicData.find(d => d.teacher_id === staff.id)?.presentDates.includes(dateStr);
                                                                const dateObj = new Date(dateStr);
                                                                const dateFmt = dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
                                                                return (
                                                                    <div key={dateStr} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${present ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800' : 'bg-red-50 text-red-500 border-red-200 dark:bg-red-900/30 dark:border-red-800'}`}>
                                                                        {present ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                                        <span>{dateFmt}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        </React.Fragment>
                                    
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default StaffRecap;
