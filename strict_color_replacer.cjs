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

  // Map strong colors (red, rose) to blue-600
  content = content.replace(/\bred-50\b/g, 'sky-100');
  content = content.replace(/\bred-[1-3]00\b/g, 'blue-300');
  content = content.replace(/\bred-[4-5]00\b/g, 'blue-500');
  content = content.replace(/\bred-[6-9]00\b/g, 'blue-600');
  
  content = content.replace(/\brose-50\b/g, 'sky-100');
  content = content.replace(/\brose-[1-3]00\b/g, 'blue-300');
  content = content.replace(/\brose-[4-5]00\b/g, 'blue-500');
  content = content.replace(/\brose-[6-9]00\b/g, 'blue-600');

  // Map positive colors (green, emerald, teal) to blue-500
  content = content.replace(/\bgreen-50\b/g, 'sky-100');
  content = content.replace(/\bgreen-[1-3]00\b/g, 'blue-300');
  content = content.replace(/\bgreen-[4-9]00\b/g, 'blue-500');

  content = content.replace(/\bemerald-50\b/g, 'sky-100');
  content = content.replace(/\bemerald-[1-3]00\b/g, 'blue-300');
  content = content.replace(/\bemerald-[4-9]00\b/g, 'blue-500');

  content = content.replace(/\bteal-50\b/g, 'sky-100');
  content = content.replace(/\bteal-[1-3]00\b/g, 'blue-300');
  content = content.replace(/\bteal-[4-9]00\b/g, 'blue-500');

  // Map warning colors (yellow) to blue-300 or blue-500
  content = content.replace(/\byellow-50\b/g, 'sky-100');
  content = content.replace(/\byellow-[1-2]00\b/g, 'blue-300');
  content = content.replace(/\byellow-[3-9]00\b/g, 'blue-500');

  // Map other blues (cyan, indigo, sky) just in case
  content = content.replace(/\bcyan-50\b/g, 'sky-100');
  content = content.replace(/\bcyan-[1-3]00\b/g, 'blue-300');
  content = content.replace(/\bcyan-[4-6]00\b/g, 'blue-500');
  content = content.replace(/\bcyan-[7-9]00\b/g, 'blue-600');

  content = content.replace(/\bindigo-50\b/g, 'sky-100');
  content = content.replace(/\bindigo-[1-3]00\b/g, 'blue-300');
  content = content.replace(/\bindigo-[4-6]00\b/g, 'blue-500');
  content = content.replace(/\bindigo-[7-9]00\b/g, 'blue-600');
  
  // Clean up any weird sky mapping except sky-100
  content = content.replace(/\bsky-(?!100)[2-9]00\b/g, 'blue-300'); // simplify

  // Remove generic whites inside app containers where slate-100 fits better,
  // but wait, I already replaced bg-white with bg-slate-100.
  // We need to ensure we don't have bg-white/20 etc if the user wants strict colors.
  // Actually bg-white/20 is just a white overlay, which is fine in glassmorphism.

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
