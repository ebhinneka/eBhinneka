const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = "<span className={`text-[10px] md:text-xs font-extrabold leading-tight uppercase tracking-widest ${performanceColor.replace('text-rose-300', 'text-white').replace('text-blue-300', 'text-white').replace('text-emerald-300', 'text-white')}`}>\n                                        {performanceStatus}\n                                    </span>";

const replacement = `<div className={\`inline-flex items-center px-3 py-1.5 rounded-full border backdrop-blur-md \${performanceColor}\`}>\n                                        <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest">{performanceStatus}</span>\n                                    </div>`;

code = code.replace(target, replacement);

fs.writeFileSync(file, code);
