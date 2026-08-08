import { supabase } from './services/supabase.ts';

async function check() {
  const { data, error } = await supabase.from('journals')
    .select('id, created_at, teacher_id, kelas, subject')
    .eq('kelas', 'STAFF');
  console.log(JSON.stringify({ data, error }, null, 2));
}
check();
