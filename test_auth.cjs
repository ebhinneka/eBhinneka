const { createClient } = require('@supabase/supabase-js');
const url = 'https://nuxpvdmhclxftbgytrsq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eHB2ZG1oY2x4ZnRiZ3l0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MTM5MTAsImV4cCI6MjEwMDE4OTkxMH0.JQ8a3oRnMGEhsv0szT3Zmr4n4mdyTcNA9y5I2kMlOok';
const supabase = createClient(url, key);

(async () => {
  const emails = [
    '234567@sekolah.id',
    '234567@smpbtipasuruan.sch.id',
    'admin@sekolah.id',
    'admin@smpbtipasuruan.sch.id',
    'admin@bhinnekatunggalika.sch.id',
    '19870101@sekolah.id'
  ];
  for (const email of emails) {
    const res = await supabase.auth.signInWithPassword({ email, password: 'admin_sekolah' });
    console.log(email, 'admin_sekolah', res.error ? res.error.message : 'SUCCESS');
  }
})();
