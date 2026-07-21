const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Change .app-card light background to F1F5F9 with opacity
code = code.replace(
  'background: rgba(255, 255, 255, 0.85);',
  'background: rgba(241, 245, 249, 0.85);'
);

// Change glow-border-container gradient
code = code.replace(
  'background-image: conic-gradient(from 0deg, transparent 0 340deg, #f59e0b 360deg);',
  'background-image: conic-gradient(from 0deg, transparent 0 340deg, #3b82f6 360deg);'
);

// Change glowing-text
code = code.replace(
  'background: linear-gradient(to right, #f8fafc 20%, #f59e0b 50%, #f8fafc 80%);',
  'background: linear-gradient(to right, #f8fafc 20%, #3b82f6 50%, #f8fafc 80%);'
);

// Make sure html.dark body is #0f172a if they want that? Currently it's #02183b, which they said "kecuali background-nya, kita kombinasikan warna dengan kode..." so I will leave background alone!

fs.writeFileSync('index.html', code);
