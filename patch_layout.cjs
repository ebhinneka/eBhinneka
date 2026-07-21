const fs = require('fs');
const file = './components/Layout.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'SISTEM INFORMASI<br/>KEGIATAN BELAJAR MENGAJAR',
  'eBhinneka'
);

code = code.replace(
  'SEMESTER {semester} | T.A {academicYear}',
  'Digitalisasi Administrasi dan Kinerja'
);

// Mobile time and date
code = code.replace(
  '<span>{formattedDate}</span>\n                 <span className="font-mono text-blue-600 dark:text-blue-400">{formattedTime} WIB</span>',
  '<span className="text-red-600 dark:text-red-400">{formattedDate}</span>\n                 <span className="font-mono text-red-600 dark:text-red-400">{formattedTime} WIB</span>'
);

// Desktop time and date
code = code.replace(
  '<span>{formattedDate}</span>\n                  <span className="font-mono text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">{formattedTime} WIB</span>',
  '<span className="text-red-600 dark:text-red-400">{formattedDate}</span>\n                  <span className="font-mono text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">{formattedTime} WIB</span>'
);

// In case the background of sidebar and headers need to be updated:
// Currently they are bg-white dark:bg-slate-800. If the user wants them to stay as is, it's fine. The body will be blue, so the cards and sidebars are white on top. The user said: "di semua tampilan, warna biru yang saya minta adalah seperti yang saya kirim di gambar persis dengan asesoris". That usually means the background color of the body.
fs.writeFileSync(file, code);
