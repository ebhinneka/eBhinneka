import { supabase } from './services/supabase.ts';

async function check() {
  const { data, error } = await supabase.from('profiles')
    .select('id, nip, full_name, jabatan_tambahan')
    .eq('nip', '2026011');
  console.log(JSON.stringify({ data, error }, null, 2));
}
check();
