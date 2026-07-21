const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `            </div></div>\n        </div>\n        </div>\n        {/* MAIN WIDGETS */}`;
const replace = `            </div>\n        </div>\n\n        {/* MAIN WIDGETS */}`;

code = code.replace(target, replace);
fs.writeFileSync(file, code);
