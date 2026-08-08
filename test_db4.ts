import { supabase } from './services/supabase.ts';
async function check() {
  const geoRes = await supabase.from('app_settings').select('value').eq('key', 'staff_geolocations').single();
  console.log(geoRes);
}
check();
