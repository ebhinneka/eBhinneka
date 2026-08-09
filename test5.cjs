const { createClient } = require('@supabase/supabase-js');
const url = 'https://nuxpvdmhclxftbgytrsq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eHB2ZG1oY2x4ZnRiZ3l0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MTM5MTAsImV4cCI6MjEwMDE4OTkxMH0.JQ8a3oRnMGEhsv0szT3Zmr4n4mdyTcNA9y5I2kMlOok';
const supabase = createClient(url, key);

async function run() {
    const d = new Date();
    const wibTime = d.getTime() + (7 * 60 * 60 * 1000);
    const date = new Date(wibTime).toISOString().split('T')[0]; 
    const startOfDay = `${date}T00:00:00+07:00`;
    const endOfDay = `${date}T23:59:59+07:00`;

    const { data: attendanceOp } = await supabase.from('attendance_logs').select('id').gte('created_at', startOfDay).lte('created_at', endOfDay);
    console.log("Att length today:", attendanceOp?.length);
}
run();
