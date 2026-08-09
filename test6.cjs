const { createClient } = require('@supabase/supabase-js');
const url = 'https://nuxpvdmhclxftbgytrsq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eHB2ZG1oY2x4ZnRiZ3l0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MTM5MTAsImV4cCI6MjEwMDE4OTkxMH0.JQ8a3oRnMGEhsv0szT3Zmr4n4mdyTcNA9y5I2kMlOok';
const supabase = createClient(url, key);

async function run() {
    const validHours = [1, 2, 3, 4, 5, 6];
    const { data: schedulesRes } = await supabase.from('schedules').select('kelas, hour').eq('day_of_week', '7').eq('schedule_version', 'Utama');
    
    let classJPs = {};
    (schedulesRes || []).forEach(sch => {
        const schHours = sch.hour.split(',').map((h) => parseInt(h.trim())).filter((h) => !isNaN(h));
        if (schHours.some(h => validHours.includes(h))) {
            classJPs[sch.kelas] = (classJPs[sch.kelas] || 0) + schHours.length;
        }
    });

    for(const cls in classJPs) {
        if(classJPs[cls] !== 6) {
            console.log("Class", cls, "has", classJPs[cls], "JPs");
        }
    }
}
run();
