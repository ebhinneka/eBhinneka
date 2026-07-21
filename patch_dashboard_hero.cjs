const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /<div className="bg-gradient-to-br from-blue-600 to-indigo-700[\s\S]*?\{\!isAdmin && \([\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\)}/;

const newHero = `<div className="bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <Clock size={200} className="-mr-10 -mt-10" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/20 shadow-inner overflow-hidden bg-white/10 flex items-center justify-center">
                            {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <User size={32} className="text-white/80" />}
                        </div>
                    </div>
                    <div>
                        <p className="text-orange-50 text-sm font-bold opacity-90 mb-0.5">{greeting},</p>
                        <h1 className="text-xl md:text-2xl font-extrabold leading-tight tracking-tight text-white">{profile?.full_name}</h1>
                        <p className="text-orange-50 text-sm font-mono opacity-90 mb-2">{isAdmin ? 'Administrator' : (profile?.nip || 'NIPY -')}</p>
                        <div className="flex flex-wrap gap-2">
                            {!isAdmin && profile?.mengajar_mapel && <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white uppercase tracking-wider">{profile.mengajar_mapel}</span>}
                            {!isAdmin && profile?.wali_kelas && <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-blue-600/90 text-white border border-blue-500 text-[10px] font-bold uppercase tracking-wider shadow-sm">Wali Kelas {profile.wali_kelas}</span>}
                        </div>
                    </div>
                </div>
                
                {!isAdmin && (
                    <div className="w-full md:w-auto mt-4 md:mt-0">
                        <p className="text-xs font-bold text-orange-50 mb-2 opacity-90 text-center md:text-right">Kinerja Bulan {currentMonthName}</p>
                        <div className="bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md w-full overflow-hidden shadow-inner">
                            <div className="grid grid-cols-3 divide-x divide-white/20">
                                <div className="p-3 py-4 flex flex-col items-center justify-center text-center">
                                    <span className="text-2xl md:text-3xl font-extrabold leading-none tracking-tight text-white">{stats.totalMeetings}</span>
                                    <span className="text-[10px] md:text-xs font-bold text-orange-50 uppercase tracking-wider mt-1">Pertemuan</span>
                                </div>
                                <div className="p-3 py-4 flex flex-col items-center justify-center text-center">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl md:text-3xl font-extrabold leading-none tracking-tight text-white">{stats.totalJp}</span>
                                        <span className="text-sm md:text-base font-medium opacity-80 text-white">/ {stats.targetJp}</span>
                                    </div>
                                    <span className="text-[10px] md:text-xs font-bold text-orange-50 uppercase tracking-wider mt-1">Total JP</span>
                                </div>
                                <div className="p-3 py-4 flex flex-col items-center justify-center text-center h-full">
                                    <span className={\`text-xs md:text-sm font-extrabold leading-tight uppercase \${performanceColor.replace('text-rose-300', 'text-white').replace('text-blue-300', 'text-white').replace('text-emerald-300', 'text-white')}\`}>
                                        {performanceStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}`;

if(regex.test(code)) {
    code = code.replace(regex, newHero);
    fs.writeFileSync(file, code);
    console.log("Success");
} else {
    console.log("Regex not matched");
}
