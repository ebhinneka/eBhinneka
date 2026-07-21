const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    '      </div>\n      </div>\n    </Layout>',
    '      </div>\n    </Layout>'
);

fs.writeFileSync(file, code);
