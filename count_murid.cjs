const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://nuxpvdmhclxftbgytrsq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eHB2ZG1oY2x4ZnRiZ3l0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MTM5MTAsImV4cCI6MjEwMDE4OTkxMH0.JQ8a3oRnMGEhsv0szT3Zmr4n4mdyTcNA9y5I2kMlOok';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
async function run() {
    const res = await supabase.from('students').select('id', { count: 'exact' });
    console.log('Total students:', res.count);
}
run();
