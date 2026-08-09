import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let envStr = '';
try { envStr = fs.readFileSync('.env', 'utf-8'); } catch(e){}
if(!envStr) {
  try { envStr = fs.readFileSync('.env.local', 'utf-8'); } catch(e){}
}
envStr.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if(k && v) process.env[k.trim()] = v.join('=').trim().replace(/['"]/g, '');
});

const url = process.env.VITE_SUPABASE_URL || 'YOUR_URL';
const key = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_KEY';

if(url === 'YOUR_URL') { console.error("No env vars"); process.exit(1); }

const supabase = createClient(url, key);

async function run() {
    const d = new Date();
    const wibTime = d.getTime() + (7 * 60 * 60 * 1000);
    const date = new Date(wibTime).toISOString().split('T')[0]; 
    const startOfDay = `${date}T00:00:00+07:00`;
    const endOfDay = `${date}T23:59:59+07:00`;

    const { data: homeroom } = await supabase.from('homeroom_attendance').select('student_id, status, kelas').eq('date', date);
    const { data: attendance } = await supabase.from('attendance_logs').select('student_id, student_name, status, created_at').gte('created_at', startOfDay).lte('created_at', endOfDay).neq('status', 'D');

    console.log("Date:", date);
    console.log("HR length:", homeroom?.length);
    console.log("Att length:", attendance?.length);
    
    let a=0, b=0;
    homeroom?.forEach(h => { if(['S','I','A'].includes(h.status)) a++; });
    attendance?.forEach(h => { if(['S','I','A'].includes(h.status)) b++; });
    console.log("HR S/I/A:", a);
    console.log("Att S/I/A:", b);
}
run();
