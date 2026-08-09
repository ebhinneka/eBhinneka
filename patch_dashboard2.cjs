const fs = require('fs');
let content = fs.readFileSync('pages/Dashboard.tsx', 'utf-8');

// Replace the time check logic
content = content.replace(
    /if \(loc\.startTime\) \{\s*const \[h, m\] = loc\.startTime\.split\(':'\)\.map\(Number\);\s*if \(currentTimeMinutes < h \* 60 \+ m\) timeAllowed = false;\s*\}\s*if \(loc\.endTime\) \{\s*const \[h, m\] = loc\.endTime\.split\(':'\)\.map\(Number\);\s*if \(currentTimeMinutes > h \* 60 \+ m\) timeAllowed = false;\s*\}/,
    `const targetStartTime = type === 'DATANG' ? loc.startTime : loc.pulangStartTime;
                          const targetEndTime = type === 'DATANG' ? loc.endTime : loc.pulangEndTime;
                          
                          if (targetStartTime) {
                              const [h, m] = targetStartTime.split(':').map(Number);
                              if (currentTimeMinutes < h * 60 + m) timeAllowed = false;
                          }
                             
                          if (targetEndTime) {
                              const [h, m] = targetEndTime.split(':').map(Number);
                              if (currentTimeMinutes > h * 60 + m) timeAllowed = false;
                          }`
);

fs.writeFileSync('pages/Dashboard.tsx', content);
console.log("Done patching Dashboard.tsx time logic");
