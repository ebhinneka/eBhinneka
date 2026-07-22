const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://nuxpvdmhclxftbgytrsq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eHB2ZG1oY2x4ZnRiZ3l0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MTM5MTAsImV4cCI6MjEwMDE4OTkxMH0.JQ8a3oRnMGEhsv0szT3Zmr4n4mdyTcNA9y5I2kMlOok';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mimic ImportData.tsx logic
async function run() {
    const rawDay = 'Senin';
    const d = rawDay.toLowerCase().trim();
    let dayNum = 0;
    if (d === 'senin') dayNum = 1;

    const schedulesToInsert = [{
        day_of_week: dayNum,
        hour: '1, 2',
        kelas: '7A',
        subject: 'Matematika',
        teacher_nip: '198001012010011001',
        teacher_id: null,
        academic_year: '2025/2026',
        semester: 'Ganjil',
        schedule_version: 'Utama'
    }];
    console.log(schedulesToInsert);
}
run();
