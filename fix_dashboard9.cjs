const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldStr = `                )}
            </div></div>
        </div>
        </div>
        {/* MAIN WIDGETS */}`;

const newStr = `                )}
            </div>
        </div>
        {/* MAIN WIDGETS */}`;

code = code.replace(oldStr, newStr);
fs.writeFileSync(file, code);
