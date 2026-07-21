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

for (const file of tsxFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace text-white with text-slate-100
  content = content.replace(/\btext-white\b/g, 'text-slate-100');
  
  // Replace bg-white/X with bg-slate-100/X
  content = content.replace(/bg-white(\/\d+)/g, 'bg-slate-100$1');
  
  // Replace border-white/X with border-slate-100/X
  content = content.replace(/border-white(\/\d+)/g, 'border-slate-100$1');

  // Replace ring-white with ring-slate-100
  content = content.replace(/ring-white\b/g, 'ring-slate-100');

  // Any remaining generic bg-white that I didn't catch before? (Just in case)
  // Actually, wait, some icons or things might need pure white? No, user said strictly combine those colors.
  content = content.replace(/\bbg-white\b/g, 'bg-slate-100');
  content = content.replace(/\bborder-white\b/g, 'border-slate-100');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
