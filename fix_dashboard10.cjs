const fs = require('fs');
const file = './pages/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const str = "            </div></div>\\n        </div>\\n        </div>\\n        {/* MAIN WIDGETS */}";
// Just use split by `{/* MAIN WIDGETS */}` and replace what's right before it
let parts = code.split('{/* MAIN WIDGETS */}');
if(parts.length > 1) {
    let before = parts[0];
    // Find the last index of `)}`
    let idx = before.lastIndexOf(')}');
    if (idx !== -1) {
        before = before.substring(0, idx) + ')}\n            </div>\n        </div>\n\n        ';
    }
    code = before + '{/* MAIN WIDGETS */}' + parts[1];
    fs.writeFileSync(file, code);
    console.log("Success");
}
