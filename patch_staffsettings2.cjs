const fs = require('fs');
let content = fs.readFileSync('pages/StaffSettings.tsx', 'utf-8');

// I will just add the closing div after the inputs.
content = content.replace(
    /<\/div>\s*<\/div>\s*<button\s*onClick=\{handleAddLocation\}/,
    `</div>
                            </div>
                        </div>
                        <button 
                            onClick={handleAddLocation}`
);

// I will also fix the list item display.
content = content.replace(
    /\{\(loc\.startTime \|\| loc\.endTime\) && \(\s*<div className="text-\[10px\] font-bold mt-1 ml-2 bg-green-100 text-green-700 px-2 py-0\.5 rounded-full inline-block">\s*Waktu: \{loc\.startTime \|\| '00:00'\} - \{loc\.endTime \|\| '23:59'\}\s*<\/div>\s*\)\}/,
    `{(loc.startTime || loc.endTime) && (
                                            <div className="text-[10px] font-bold mt-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block mr-1">
                                                Datang: {loc.startTime || '...'} - {loc.endTime || '...'}
                                            </div>
                                        )}
                                        {(loc.pulangStartTime || loc.pulangEndTime) && (
                                            <div className="text-[10px] font-bold mt-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full inline-block">
                                                Pulang: {loc.pulangStartTime || '...'} - {loc.pulangEndTime || '...'}
                                            </div>
                                        )}`
);

fs.writeFileSync('pages/StaffSettings.tsx', content);
console.log("Done patching StaffSettings.tsx again");
