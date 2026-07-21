const fs = require('fs');
const file = './pages/PublicDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldBtn = `<div className="pt-2">
                <button 
                    onClick={() => setShowLoginModal(true)} 
                    className="w-full bg-[#f59e0b] hover:bg-amber-600 text-slate-900 font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                    <LogIn size={24} className="stroke-[2.5]" /> Login Sebagai
                </button>
            </div>`;

const newBtn = `<div className="pt-2">
                <div className="glow-border-container">
                    <button 
                        onClick={() => setShowLoginModal(true)} 
                        className="relative z-10 w-full bg-[#f59e0b] hover:bg-amber-600 text-white font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                        <LogIn size={24} className="stroke-[2.5]" /> 
                        <span className="glowing-text text-white">Login Sebagai</span>
                    </button>
                </div>
            </div>`;

code = code.replace(oldBtn, newBtn);
fs.writeFileSync(file, code);
