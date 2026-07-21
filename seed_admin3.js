import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://nuxpvdmhclxftbgytrsq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eHB2ZG1oY2x4ZnRiZ3l0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MTM5MTAsImV4cCI6MjEwMDE4OTkxMH0.JQ8a3oRnMGEhsv0szT3Zmr4n4mdyTcNA9y5I2kMlOok');
async function run() {
  console.log("Attempting to sign up...");
  const { data, error } = await supabase.auth.signUp({
    email: '234567@sekolah.id',
    password: 'admin_sekolah',
  });
  console.log('Error:', error?.message);
  console.log('Data:', data?.user?.id);
  
  if (data?.user?.id) {
       const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: data.user.id,
            nip: '234567',
            full_name: 'Administrator',
            role: 'admin'
        });
       if (profileError) {
          console.error('Error updating profile:', profileError.message);
       } else {
          console.log('Profile updated to admin successfully.');
       }
  }
}
run();
