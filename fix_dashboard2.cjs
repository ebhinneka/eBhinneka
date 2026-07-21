const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    '            </div></div>\n        </div>\n\n        {/* MAIN WIDGETS */}',
    '            </div>\n        </div>\n\n        {/* MAIN WIDGETS */}'
);

fs.writeFileSync(file, code);
