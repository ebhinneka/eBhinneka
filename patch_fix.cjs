const fs = require('fs');
let content = fs.readFileSync('pages/Dashboard.tsx', 'utf-8');

// 1. Fix the error messages for early vs late
content = content.replace(
    /let isAllowed = false;\s*let isOutOfTime = false;/,
    `let isAllowed = false;
                  let isTooEarly = false;
                  let isTooLate = false;`
);

content = content.replace(
    /if \(timeAllowed\) \{\s*isAllowed = true;\s*break;\s*\} else \{\s*isOutOfTime = true;\s*\}/g,
    `if (timeAllowed) {
                              isAllowed = true;
                              break;
                          } else {
                              if (targetStartTime) {
                                  const [sh, sm] = targetStartTime.split(':').map(Number);
                                  if (currentTimeMinutes < sh * 60 + sm) isTooEarly = true;
                              }
                              if (targetEndTime) {
                                  const [eh, em] = targetEndTime.split(':').map(Number);
                                  if (currentTimeMinutes > eh * 60 + em) isTooLate = true;
                              }
                          }`
);

content = content.replace(
    /if \(\!isAllowed\) \{\s*if \(isOutOfTime\) \{\s*setAttendanceErrorModal\('Anda hadir sangat terlambat, data anda tidak tersimpan'\);\s*\} else \{\s*setAttendanceErrorModal\('Anda berada di luar kantor, data anda tidak tersimpan'\);\s*\}\s*setSavingStaffAttendance\(false\);\s*return;\s*\}/,
    `if (!isAllowed) {
                      if (isTooEarly) {
                          setAttendanceErrorModal('Belum waktunya presensi untuk lokasi ini.');
                      } else if (isTooLate) {
                          setAttendanceErrorModal('Waktu presensi sudah habis untuk lokasi ini.');
                      } else {
                          setAttendanceErrorModal('Anda berada di luar jangkauan lokasi kantor.');
                      }
                      setSavingStaffAttendance(false);
                      return;
                  }`
);

// 2. Fix Datang button text and logic
content = content.replace(
    /isDatangMissed \? \(\s*<><XCircle size=\{20\} \/> Anda tidak Presensi Datang<\/>\s*\) : \(\s*<><CheckCircle2 size=\{20\} \/> Presensi Datang<\/>\s*\)/,
    `isDatangMissed ? (
                                <><XCircle size={20} /> Anda tidak Presensi</>
                            ) : (
                                <><CheckCircle2 size={20} /> Presensi Datang</>
                            )`
);

// 3. Fix Pulang button text and logic (Remove !staffAttendanceDatang from disabled, and fix text)
// The original UI has:
// disabled={!!staffAttendancePulang || savingStaffAttendance || !staffAttendanceDatang || (!staffAttendancePulang && isPulangMissed)}
// We will replace it with:
// disabled={!!staffAttendancePulang || savingStaffAttendance || (!staffAttendancePulang && isPulangMissed)}

content = content.replace(
    /disabled=\{!!staffAttendancePulang \|\| savingStaffAttendance \|\| !staffAttendanceDatang \|\| \(\!staffAttendancePulang && isPulangMissed\)\}/,
    `disabled={!!staffAttendancePulang || savingStaffAttendance || (!staffAttendancePulang && isPulangMissed)}`
);

// In className:
content = content.replace(
    /staffAttendancePulang \|\| !staffAttendanceDatang \|\| \(\!staffAttendancePulang && isPulangMissed\)/,
    `staffAttendancePulang || (!staffAttendancePulang && isPulangMissed)`
);

// In conditional rendering:
content = content.replace(
    /\{savingStaffAttendance && !!staffAttendanceDatang && !staffAttendancePulang \? \(/,
    `{savingStaffAttendance && !staffAttendancePulang ? (`
);

content = content.replace(
    /isPulangMissed \? \(\s*<><XCircle size=\{20\} \/> Anda tidak Presensi Pulang<\/>\s*\) : \(\s*<><CheckCircle2 size=\{20\} \/> Presensi Pulang<\/>\s*\)/,
    `isPulangMissed ? (
                                <><XCircle size={20} /> Anda tidak Presensi</>
                            ) : (
                                <><CheckCircle2 size={20} /> Presensi Pulang</>
                            )`
);

fs.writeFileSync('pages/Dashboard.tsx', content);
console.log("Done patching fix");
