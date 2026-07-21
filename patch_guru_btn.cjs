const fs = require('fs');
const file = './pages/PublicDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldBtn = `<button 
                        onClick={() => handleRoleSelect('guru')}
                        className="bg-white dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-500/50 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"
                      >
                          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <GraduationCap size={32} />
                          </div>
                          <div className="text-left">
                              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400">Guru / Tenaga Pendidik</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Masuk untuk mengisi jurnal & absensi.</p>
                          </div>
                          <div className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-blue-500">
                              <ArrowRight size={24} />
                          </div>
                      </button>`;

const newBtn = `<button 
                        onClick={() => handleRoleSelect('guru')}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-2 border-orange-400 p-5 rounded-3xl shadow-xl flex items-center gap-5 transition-all group"
                      >
                          <div className="w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                              <GraduationCap size={32} />
                          </div>
                          <div className="text-left">
                              <h3 className="text-lg font-extrabold text-white">Guru / Tenaga Pendidik</h3>
                              <p className="text-xs text-orange-50 font-bold opacity-90">Masuk untuk mengisi jurnal & absensi.</p>
                          </div>
                          <div className="ml-auto text-orange-200 group-hover:text-white">
                              <ArrowRight size={24} />
                          </div>
                      </button>`;

code = code.replace(oldBtn, newBtn);
fs.writeFileSync(file, code);
