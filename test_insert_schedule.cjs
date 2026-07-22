const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://nuxpvdmhclxftbgytrsq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eHB2ZG1oY2x4ZnRiZ3l0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MTM5MTAsImV4cCI6MjEwMDE4OTkxMH0.JQ8a3oRnMGEhsv0szT3Zmr4n4mdyTcNA9y5I2kMlOok';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
async function run() {
    const { error } = await supabase.from('schedules').insert([
        {
            day_of_week: 1,
            hour: '1',
            kelas: '7A',
            subject: 'Mapel Test',
            teacher_nip: 'dummy',
            teacher_id: null,
            academic_year: '2025/2026',
            semester: 'Ganjil',
            schedule_version: 'Utama'
        }
    ]);
    console.log(error);
}
run();
