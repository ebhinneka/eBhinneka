const fs = require('fs');

let publicDash = fs.readFileSync('pages/PublicDashboard.tsx', 'utf8');

const target = `<div className="pt-2">
                <button 
                        onClick={() => setShowLoginModal(true)} 
                        className="w-full bg-[#2563eb] hover:bg-blue-700 border-2 border-[#2563eb] text-white font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all"
                    >
                        <LogIn size={24} className="stroke-[2.5]" /> 
                        <span>Login Sebagai</span>
                    </button>
            </div>`;

const replacement = `<div className="pt-2">
                <div className="relative group rounded-xl overflow-hidden p-[2px] shadow-xl">
                    <div className="absolute inset-[-100%] z-0 animate-[spin_4s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, transparent 0 340deg, #ffffff 360deg)' }}></div>
                    <button 
                            onClick={() => setShowLoginModal(true)} 
                            className="relative z-10 w-full bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-lg py-4 rounded-[10px] flex items-center justify-center gap-2 transition-all"
                        >
                            <LogIn size={24} className="stroke-[2.5]" /> 
                            <span>Login Sebagai</span>
                        </button>
                </div>
            </div>`;

if (publicDash.includes('className="w-full bg-[#2563eb] hover:bg-blue-700 border-2 border-[#2563eb] text-white font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all"')) {
    publicDash = publicDash.replace(/<div className="pt-2">\s*<button\s*onClick=\{\(\) => setShowLoginModal\(true\)\}\s*className="w-full bg-\[#2563eb\] hover:bg-blue-700 border-2 border-\[#2563eb\] text-white font-extrabold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all"\s*>\s*<LogIn size=\{24\} className="stroke-\[2\.5\]" \/>\s*<span>Login Sebagai<\/span>\s*<\/button>\s*<\/div>/, replacement);
    fs.writeFileSync('pages/PublicDashboard.tsx', publicDash);
    console.log("Updated Login button");
} else {
    console.log("Target not found");
}

