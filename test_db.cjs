const { createClient } = require('@supabase/supabase-js');
const url = 'https://nuxpvdmhclxftbgytrsq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eHB2ZG1oY2x4ZnRiZ3l0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MTM5MTAsImV4cCI6MjEwMDE4OTkxMH0.JQ8a3oRnMGEhsv0szT3Zmr4n4mdyTcNA9y5I2kMlOok';
const supabase = createClient(url, key);

async function run() {
    const { data } = await supabase.from('app_settings').select('value').eq('key', 'staff_geolocations').single();
    console.log(data?.value);
}
run();
