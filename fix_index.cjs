const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Update body background
content = content.replace(/background-color: #3988d8;/, 'background-color: #f4f7fb;');
content = content.replace(/color: #1e293b;/, 'color: #1e293b;');

// Remove the circle accessory
content = content.replace(/\/\* Circle Accessory in Top Left \*\/[\s\S]*?pointer-events: none;\s*}/, '');

// Update dark mode body
content = content.replace(/background-color: #02183b; \/\* dark blue \*\//, 'background-color: #0f172a;');
content = content.replace(/html\.dark body::before {[^}]*}/, '');

// Update .app-card
let appCardCSS = `
      .app-card {
        background: #ffffff;
        border-radius: 1.5rem; 
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(226, 232, 240, 0.8);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        color: #1e293b;
      }
      /* Dark Mode Card Override */
      html.dark .app-card {
        background: #1e293b;
        border-color: rgba(255, 255, 255, 0.05);
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.2);
        color: #f8fafc;
      }
`;

content = content.replace(/\/\* Card Utility - Glassmorphism \*\/[\s\S]*?color: #f8fafc;\s*}/, appCardCSS);

fs.writeFileSync('index.html', content);
console.log("Fixed index.html");
