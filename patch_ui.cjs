const fs = require('fs');
const file = '/app/applet/pages/PublicDashboard.tsx';
let code = fs.readFileSync(file, 'utf-8');

// 1. Center motto
code = code.replace(
  '<div className="flex items-start justify-start mb-6">',
  '<div className="flex items-center justify-center mb-6 w-full">'
);
code = code.replace(
  '<div className="text-[9px] text-white/95 font-medium tracking-[0.2em] ml-1 flex items-center gap-2 mt-1 uppercase">',
  '<div className="text-[9px] text-white/95 font-medium tracking-[0.2em] flex items-center gap-2 mt-1 uppercase justify-center text-center">'
);

// 2. Reduce font size of class count to fit better
code = code.replace(
  /className="w-full flex-1 flex flex-col items-center justify-center pt-5 relative z-10"/g,
  'className="w-full flex-1 flex flex-col items-center justify-center pt-3 relative z-10"'
);
code = code.replace(
  /className="w-10 h-10 rounded-full flex items-center justify-center mb-1"/g,
  'className="w-8 h-8 rounded-full flex items-center justify-center mb-1"'
);
code = code.replace(
  /<svg xmlns="http:\/\/www.w3.org\/2000\/svg" width="26" height="26"/g,
  '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"'
);
code = code.replace(
  /className="text-\[48px\] font-black tracking-tighter leading-none"/g,
  'className="text-[36px] font-black tracking-tighter leading-none"'
);
code = code.replace(
  /className="w-\[30px\] h-\[4px\] rounded-full mt-2 mb-2"/g,
  'className="w-[30px] h-[3px] rounded-full mt-1.5 mb-1.5"'
);

// 3. Login Button Animation
const oldLoginButton = `<button 
                    onClick={() => setShowLoginModal(true)}
                    className="w-full mt-4 bg-gradient-to-r from-[#0c4a9a] to-[#1d4ed8] hover:from-[#0a3a7a] hover:to-[#153a99] text-white p-4 rounded-full flex items-center justify-between shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all group active:scale-[0.98]"
                >`;

const newLoginButton = `<button 
                    onClick={() => setShowLoginModal(true)}
                    className="relative w-full mt-5 rounded-full p-[2.5px] overflow-hidden group active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)]"
                >
                    {/* Spinning glow effect */}
                    <div className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#93c5fd_90%,#ffffff_100%)] opacity-80"></div>
                    
                    {/* Actual button surface */}
                    <div className="relative bg-gradient-to-r from-[#0c4a9a] to-[#1d4ed8] group-hover:from-[#0a3a7a] group-hover:to-[#153a99] text-white p-4 rounded-full flex items-center justify-between transition-all w-full h-full">`;

const oldLoginButtonEnd = `</button>`;
const newLoginButtonEnd = `    </div>
                </button>`;

if (code.includes(oldLoginButton)) {
    code = code.replace(oldLoginButton, newLoginButton);
    
    // We need to insert the closing </div> before the closing </button> of that specific block
    // The easiest way is to find the exact block and replace the end.
    const loginButtonSpan = `<span className="text-[16px] font-bold tracking-wide">Login Sebagai</span>
                    <ChevronRight size={22} className="text-white mr-4 group-hover:translate-x-1 transition-transform" />
                </button>`;
    const loginButtonSpanNew = `<span className="text-[16px] font-bold tracking-wide">Login Sebagai</span>
                        <ChevronRight size={22} className="text-white mr-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>`;
    
    code = code.replace(loginButtonSpan, loginButtonSpanNew);
}

fs.writeFileSync(file, code);
console.log("Patched successfully!");
