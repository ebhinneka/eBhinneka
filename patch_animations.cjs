const fs = require('fs');
const file = 'pages/PublicDashboard.tsx';
let code = fs.readFileSync(file, 'utf-8');

// 1. ACADEMIC YEAR PILL
const oldPill = `<div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between border border-slate-100/50">
                    <div className="flex items-center gap-3">`;

const newPill = `<div className="relative rounded-[18px] p-[2.5px] overflow-hidden shadow-sm mt-1">
                    <div className="absolute inset-[-300%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_60%,#fef08a_80%,#eab308_100%)] opacity-90"></div>
                    <div className="relative bg-white rounded-2xl px-5 py-4 flex items-center justify-between w-full h-full">
                    <div className="flex items-center gap-3">`;

const oldPillEnd = `                        </div>
                    </div>
                </div>

                {/* 3 CLASS METRICS */}`;

const newPillEnd = `                        </div>
                    </div>
                    </div>
                </div>

                {/* 3 CLASS METRICS */}`;

code = code.replace(oldPill, newPill);
code = code.replace(oldPillEnd, newPillEnd);

// 2. LOGIN BUTTON
const oldLoginButton = `<button 
                    onClick={() => setShowLoginModal(true)}
                    className="relative w-full mt-5 rounded-full p-[2.5px] overflow-hidden group active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)]"
                >
                    {/* Spinning glow effect */}
                    <div className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#93c5fd_90%,#ffffff_100%)] opacity-80"></div>`;

const newLoginButton = `<button 
                    onClick={() => setShowLoginModal(true)}
                    className="relative w-full mt-5 rounded-full p-[3px] overflow-hidden group active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)]"
                >
                    {/* Spinning glow effect */}
                    <div className="absolute inset-[-300%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_60%,#60a5fa_80%,#ffffff_100%)] opacity-100"></div>`;

code = code.replace(oldLoginButton, newLoginButton);

fs.writeFileSync(file, code);
console.log("Animations patched successfully!");
