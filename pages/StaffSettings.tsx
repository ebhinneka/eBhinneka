import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { supabase } from '../services/supabase';
import { MapPin, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface GeoLocation {
    id: string;
    name: string;
    lat: number;
    lng: number;
    radius: number; // in meters
    startTime?: string;
    endTime?: string;
}

const StaffSettings: React.FC = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [locations, setLocations] = useState<GeoLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // New location inputs
    const [newName, setNewName] = useState('');
    const [newLat, setNewLat] = useState('');
    const [newLng, setNewLng] = useState('');
    const [newRadius, setNewRadius] = useState('100');
    const [newStartTime, setNewStartTime] = useState('');
    const [newEndTime, setNewEndTime] = useState('');

    useEffect(() => {
        if (isAdmin === false) {
            navigate('/dashboard');
        }
        fetchLocations();
    }, [isAdmin, navigate]);

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const { data } = await supabase.from('app_settings').select('value').eq('key', 'staff_geolocations').single();
            if (data && data.value) {
                setLocations(JSON.parse(data.value));
            }
        } catch (error) {
            console.error("Error fetching locations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (updatedLocations: GeoLocation[]) => {
        setSaving(true);
        try {
            const { error } = await supabase.from('app_settings').upsert({
                key: 'staff_geolocations',
                value: JSON.stringify(updatedLocations)
            });
            if (error) throw error;
            setLocations(updatedLocations);
            alert('Pengaturan geolokasi berhasil disimpan.');
        } catch (error: any) {
            alert('Gagal menyimpan pengaturan: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAddLocation = () => {
        if (!newName || !newLat || !newLng || !newRadius) {
            alert('Lengkapi semua data geolokasi!');
            return;
        }

        const latNum = parseFloat(newLat);
        const lngNum = parseFloat(newLng);
        const radNum = parseInt(newRadius, 10);

        if (isNaN(latNum) || isNaN(lngNum) || isNaN(radNum)) {
            alert('Format Latitude, Longitude, dan Radius harus berupa angka.');
            return;
        }

        const newLoc: GeoLocation = {
            id: Date.now().toString(),
            name: newName,
            lat: latNum,
            lng: lngNum,
            radius: radNum,
            startTime: newStartTime || undefined,
            endTime: newEndTime || undefined
        };

        const updated = [...locations, newLoc];
        handleSave(updated);

        setNewName('');
        setNewLat('');
        setNewLng('');
        setNewRadius('100');
        setNewStartTime('');
        setNewEndTime('');
    };

    const handleDeleteLocation = (id: string) => {
        if (window.confirm('Hapus geolokasi ini?')) {
            const updated = locations.filter(l => l.id !== id);
            handleSave(updated);
        }
    };

    const handleGetCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setNewLat(position.coords.latitude.toString());
                    setNewLng(position.coords.longitude.toString());
                },
                (error) => {
                    alert("Gagal mendapatkan lokasi: " + error.message);
                }
            );
        } else {
            alert("Geolokasi tidak didukung di browser ini.");
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <MapPin className="text-blue-500" size={28} />
                        Pengaturan Staff
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Kelola lokasi yang diizinkan untuk konfirmasi kehadiran Staff.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                        Daftar Geolokasi
                    </h2>

                    {locations.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm italic border border-dashed border-slate-200 dark:border-slate-700 rounded-xl mb-6">
                            Belum ada geolokasi yang ditambahkan.
                        </div>
                    ) : (
                        <div className="space-y-3 mb-6">
                            {locations.map((loc) => (
                                <div key={loc.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div>
                                        <div className="font-bold text-slate-800 dark:text-slate-100">{loc.name}</div>
                                        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                                            Lat: {loc.lat}, Lng: {loc.lng}
                                        </div>
                                        <div className="text-[10px] font-bold mt-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-block">
                                            Radius: {loc.radius}m
                                        </div>
                                        {(loc.startTime || loc.endTime) && (
                                            <div className="text-[10px] font-bold mt-1 ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block">
                                                Waktu: {loc.startTime || '00:00'} - {loc.endTime || '23:59'}
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteLocation(loc.id)}
                                        disabled={saving}
                                        className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-3">Tambah Lokasi Baru</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Nama Tempat</label>
                                <input 
                                    type="text" 
                                    value={newName} 
                                    onChange={e => setNewName(e.target.value)} 
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Contoh: Gedung Sekolah Utama"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Radius (meter)</label>
                                <input 
                                    type="number" 
                                    value={newRadius} 
                                    onChange={e => setNewRadius(e.target.value)} 
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Contoh: 100"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Latitude</label>
                                <input 
                                    type="text" 
                                    value={newLat} 
                                    onChange={e => setNewLat(e.target.value)} 
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                    placeholder="-7.xxxxx"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Longitude</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={newLng} 
                                        onChange={e => setNewLng(e.target.value)} 
                                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                        placeholder="112.xxxxx"
                                    />
                                    <button
                                        onClick={handleGetCurrentLocation}
                                        className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-3 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                                        title="Gunakan lokasi saya saat ini"
                                    >
                                        <MapPin size={16} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Waktu Mulai (Opsional)</label>
                                <input 
                                    type="time" 
                                    value={newStartTime} 
                                    onChange={e => setNewStartTime(e.target.value)} 
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Waktu Selesai (Opsional)</label>
                                <input 
                                    type="time" 
                                    value={newEndTime} 
                                    onChange={e => setNewEndTime(e.target.value)} 
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleAddLocation}
                            disabled={saving}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                            Tambahkan Lokasi
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StaffSettings;
