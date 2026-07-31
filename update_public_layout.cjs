const fs = require('fs');
let code = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');

// Update Row 2 and Progress Bar
const oldRow2AndProgress = `<div className="grid grid-cols-2 gap-3">
                <div className="app-card p-6 flex flex-col items-center justify-center text-center h-44">
                     <div className="mb-3 text-blue-600 dark:text-blue-500">
                        <BookOpen size={40} strokeWidth={1.5} />
                     </div>
                     <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-500">{stats.completedJp}</span>
                        <span className="text-lg font-bold text-slate-400 dark:text-slate-500">/ {stats.totalJpRequired} JP</span>
                     </div>
                     <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">KBM Terlaksana</p>
                </div>
                <button 
                    onClick={handleAbsenceClick}
                    className="app-card p-6 flex flex-col items-center justify-center text-center h-44 transition-transform active:scale-95 group"
                >
                     <div className="mb-3 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <AlertCircle size={40} strokeWidth={1.5} />
                     </div>
                     <span className="text-4xl font-extrabold text-blue-500 dark:text-blue-400 mb-1">{stats.absenceCount}</span>
                     <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1 leading-tight">Ketidakhadiran <br/> Murid</p>
                </button>
            </div>

            {/* PROGRESS BAR */}
            <div className="app-card p-6">
                <h3 className="font-bold text-slate-600 dark:text-slate-300 text-xs uppercase mb-3 text-center">Progress KBM Hari Ini</h3>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
                    <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: \`\${stats.totalJpRequired > 0 ? (stats.completedJp / stats.totalJpRequired) * 100 : 0}%\` }}
                    ></div>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>{stats.totalJpRequired > 0 ? ((stats.completedJp / stats.totalJpRequired) * 100).toFixed(1) : '0.0'}% Terlaksana</span>
                    <span>{stats.completedJp} dari {stats.totalJpRequired} Jam</span>
                </div>
            </div>`;

const newRow2AndProgress = `<div className="grid grid-cols-2 gap-3">
                <div className="app-card p-5 flex flex-col justify-between text-left h-44 relative overflow-hidden">
                     <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-2 relative z-10">
                        <BookOpen size={24} strokeWidth={2} />
                     </div>
                     <div className="relative z-10">
                         <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-4xl font-extrabold text-blue-700">{stats.completedJp}</span>
                            <span className="text-sm font-bold text-slate-500">/ {stats.totalJpRequired} JP</span>
                         </div>
                         <p className="text-[10px] font-bold text-slate-600 uppercase">KBM Terlaksana</p>
                     </div>
                     <BookOpen className="absolute -bottom-4 -right-4 text-slate-100 opacity-50" size={100} strokeWidth={1} />
                </div>
                <button 
                    onClick={handleAbsenceClick}
                    className="app-card p-5 flex flex-col justify-between text-left h-44 transition-transform active:scale-95 group relative overflow-hidden"
                >
                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2 relative z-10 group-hover:scale-110 transition-transform">
                        <AlertCircle size={24} strokeWidth={2} />
                     </div>
                     <div className="relative z-10">
                         <span className="text-4xl font-extrabold text-blue-700 block mb-1">{stats.absenceCount}</span>
                         <p className="text-[10px] font-bold text-slate-600 uppercase leading-tight">Ketidakhadiran <br/> Murid</p>
                     </div>
                     <User className="absolute -bottom-2 -right-4 text-slate-100 opacity-50" size={110} strokeWidth={1} />
                </button>
            </div>

            {/* PROGRESS BAR */}
            <div className="app-card p-5 flex flex-col justify-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <MonitorPlay size={20} strokeWidth={2} />
                    </div>
                    <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wide">Progress KBM Hari Ini</h3>
                </div>
                <div>
                    <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                        <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: \`\${stats.totalJpRequired > 0 ? (stats.completedJp / stats.totalJpRequired) * 100 : 0}%\` }}
                        ></div>
                    </div>
                    <div className="text-xs font-bold">
                        <span className="text-blue-600">{stats.totalJpRequired > 0 ? ((stats.completedJp / stats.totalJpRequired) * 100).toFixed(1) : '0.0'}%</span>
                        <span className="text-slate-500"> Terlaksana</span>
                    </div>
                </div>
            </div>`;

code = code.replace(oldRow2AndProgress, newRow2AndProgress);

// Update Class Cards (Row 1)
const oldClassCard = `const ClassCard: React.FC<{label: string, count: number, onClick: () => void, colorClass: string, iconColorClass: string}> = ({label, count, onClick, colorClass, iconColorClass}) => (
      <button 
        onClick={onClick}
        className="app-card p-5 flex flex-col items-center justify-center text-center transition-transform active:scale-95 h-36"
      >
          <div className={\`mb-2 text-3xl \${iconColorClass}\`}>
              <School size={32} strokeWidth={1.5} />
          </div>
          <h2 className={\`text-4xl font-extrabold \${colorClass} mb-1 tracking-tight\`}>{count}</h2>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
      </button>
  );`;
  
const newClassCard = `const ClassCard: React.FC<{label: string, count: number, onClick: () => void, colorClass: string, iconColorClass: string}> = ({label, count, onClick, colorClass, iconColorClass}) => (
      <button 
        onClick={onClick}
        className="app-card p-4 flex flex-col items-center justify-center text-center transition-transform active:scale-95 h-36 relative overflow-hidden"
      >
          <div className="mb-2 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <GraduationCap size={22} strokeWidth={2} />
          </div>
          <h2 className="text-4xl font-extrabold text-blue-800 mb-1 tracking-tight">{count}</h2>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">{label}</p>
          <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-blue-600 rounded-t-full"></div>
      </button>
  );`;
  
code = code.replace(oldClassCard, newClassCard);

fs.writeFileSync('pages/PublicDashboard.tsx', code);
console.log("Updated PublicDashboard Layout");
