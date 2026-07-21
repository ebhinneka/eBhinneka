const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
};

const tsxFiles = walkSync('./').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

// 2563EB (blue-600)
// 3B82F6 (blue-500)
// 93C5FD (blue-300)
// E0F2FE (sky-100) or we can use blue-50 (eff6ff) but we'll map sky-100.
// F1F5F9 (slate-100)
// 0F172A (slate-900)

for (const file of tsxFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Let's replace generic grays with slates to align with F1F5F9 and 0F172A
  content = content.replace(/\bgray-100\b/g, 'slate-100');
  content = content.replace(/\bgray-200\b/g, 'slate-100'); // collapse lighter grays
  content = content.replace(/\bgray-300\b/g, 'slate-300');
  content = content.replace(/\bgray-400\b/g, 'slate-400');
  content = content.replace(/\bgray-500\b/g, 'slate-500');
  content = content.replace(/\bgray-600\b/g, 'slate-600');
  content = content.replace(/\bgray-700\b/g, 'slate-700');
  content = content.replace(/\bgray-800\b/g, 'slate-900');
  content = content.replace(/\bgray-900\b/g, 'slate-900');

  // Replace orange/amber with blue
  content = content.replace(/\borange-50\b/g, 'sky-100');
  content = content.replace(/\borange-100\b/g, 'blue-300');
  content = content.replace(/\borange-200\b/g, 'blue-300');
  content = content.replace(/\borange-300\b/g, 'blue-300');
  content = content.replace(/\borange-400\b/g, 'blue-500');
  content = content.replace(/\borange-500\b/g, 'blue-600');
  content = content.replace(/\borange-600\b/g, 'blue-600');
  content = content.replace(/\borange-700\b/g, 'blue-600');
  content = content.replace(/\borange-800\b/g, 'slate-900');
  content = content.replace(/\borange-900\b/g, 'slate-900');
  
  content = content.replace(/\bamber-50\b/g, 'sky-100');
  content = content.replace(/\bamber-100\b/g, 'blue-300');
  content = content.replace(/\bamber-200\b/g, 'blue-300');
  content = content.replace(/\bamber-300\b/g, 'blue-300');
  content = content.replace(/\bamber-400\b/g, 'blue-500');
  content = content.replace(/\bamber-500\b/g, 'blue-600');
  content = content.replace(/\bamber-600\b/g, 'blue-600');
  content = content.replace(/\bamber-700\b/g, 'blue-600');
  content = content.replace(/\bamber-800\b/g, 'slate-900');
  content = content.replace(/\bamber-900\b/g, 'slate-900');

  // Replace purple with blue
  content = content.replace(/\bpurple-50\b/g, 'sky-100');
  content = content.replace(/\bpurple-100\b/g, 'sky-100');
  content = content.replace(/\bpurple-200\b/g, 'blue-300');
  content = content.replace(/\bpurple-300\b/g, 'blue-300');
  content = content.replace(/\bpurple-400\b/g, 'blue-500');
  content = content.replace(/\bpurple-500\b/g, 'blue-600');
  content = content.replace(/\bpurple-600\b/g, 'blue-600');
  content = content.replace(/\bpurple-700\b/g, 'blue-600');
  content = content.replace(/\bpurple-800\b/g, 'slate-900');
  content = content.replace(/\bpurple-900\b/g, 'slate-900');

  // We should also replace text-white with text-slate-100 where appropriate, or bg-white with bg-slate-100.
  // But wait! bg-white is often fine. F1F5F9 is very close to white. E0F2FE is sky-100.
  // Let's replace bg-white with bg-slate-100 in app containers, EXCEPT where it is bg-white/10 etc.
  content = content.replace(/bg-white([^a-zA-Z0-9\/-])/g, 'bg-slate-100$1');
  
  // Replace dark:bg-slate-800 with dark:bg-slate-900 to match 0F172A
  content = content.replace(/bg-slate-800/g, 'bg-slate-900');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
