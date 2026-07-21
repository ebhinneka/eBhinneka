const fs = require('fs');
const file = './index.html';
let code = fs.readFileSync(file, 'utf8');

// Just remove the second definition block
const toRemove = `      /* Card Utility - Reverted to White */
      .app-card {
        background-color: #FFFFFF; 
        border-radius: 1.25rem; 
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        border: 1px solid rgba(226, 232, 240, 0.8); /* slate-200 */
        transition: background-color 0.3s ease, border-color 0.3s ease;
      }

      /* Dark Mode Card Override */
      html.dark .app-card {
        background-color: #1e293b; /* slate-800 */
        border-color: #334155; /* slate-700 */
        color: #f8fafc;
      }`;

code = code.replace(toRemove, '');
fs.writeFileSync(file, code);
