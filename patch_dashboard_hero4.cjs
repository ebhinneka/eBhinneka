const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const startStr = '<div className="bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">';
const startIndex = code.indexOf(startStr);

if (startIndex !== -1) {
    const endStr = '</div>\n        </div>\n\n        {/* MAIN WIDGETS */}';
    const endIndex = code.indexOf(endStr, startIndex);
    
    if (endIndex !== -1) {
        const newHero = `<div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] p-6 md:p-8 text-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <Clock size={250} className="-mr-10 -mt-10" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden bg-white/10 flex items-center justify-center p-0.5">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white/20">
                                {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <User size={32} className="text-white/80 w-full h-full p-3" />}
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-blue-50 text-sm font-bold opacity-80 mb-0.5 tracking-wide">{greeting}</p>
                        <h1 className="text-xl md:text-3xl font-extrabold leading-tight tracking-tight text-white mb-1 drop-shadow-md">{profile?.full_name}</h1>
                        <p className="text-blue-100/70 text-sm font-mono font-medium mb-3">{isAdmin ? 'Administrator' : (profile?.nip || 'NIPY -')}</p>
                        <div className="flex flex-wrap gap-2">
                            {!isAdmin && profile?.mengajar_mapel && <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white uppercase tracking-wider">{profile.mengajar_mapel}</span>}
                            {!isAdmin && profile?.wali_kelas && <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/30 backdrop-blur-md text-white border border-blue-400/50 text-[10px] font-bold uppercase tracking-wider shadow-sm">Wali Kelas {profile.wali_kelas}</span>}
                        </div>
                    </div>
                </div>
                
                {!isAdmin && (
                    <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col items-center md:items-end">
                        <p className="text-[11px] font-bold text-blue-100/70 mb-2 uppercase tracking-widest text-center md:text-right">Kinerja {currentMonthName}</p>
                        <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md w-full overflow-hidden shadow-inner">
                            <div className="grid grid-cols-3 divide-x divide-white/10">
                                <div className="p-4 py-5 flex flex-col items-center justify-center text-center">
                                    <span className="text-2xl md:text-4xl font-extrabold leading-none tracking-tighter text-white drop-shadow-sm">{stats.totalMeetings}</span>
                                    <span className="text-[9px] md:text-[10px] font-bold text-blue-100/70 uppercase tracking-widest mt-1.5">Pertemuan</span>
                                </div>
                                <div className="p-4 py-5 flex flex-col items-center justify-center text-center">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl md:text-4xl font-extrabold leading-none tracking-tighter text-white drop-shadow-sm">{stats.totalJp}</span>
                                        <span className="text-sm md:text-base font-medium opacity-60 text-white">/ {stats.targetJp}</span>
                                    </div>
                                    <span className="text-[9px] md:text-[10px] font-bold text-blue-100/70 uppercase tracking-widest mt-1.5">Total JP</span>
                                </div>
                                <div className="p-4 py-5 flex flex-col items-center justify-center text-center h-full">
                                    <span className={\`text-[10px] md:text-xs font-extrabold leading-tight uppercase tracking-widest \${performanceColor.replace('text-rose-300', 'text-white').replace('text-blue-300', 'text-white').replace('text-emerald-300', 'text-white')}\`}>
                                        {performanceStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>\n`;
            
        code = code.substring(0, startIndex) + newHero + code.substring(endIndex);
        fs.writeFileSync(file, code);
        console.log("Success Dashboard Hero");
    } else {
        console.log("End index not found");
    }
} else {
    console.log("Start index not found");
}
