import { createClient } from '@supabase/supabase-js';

// Default configuration from user input
export const DEFAULT_SUPABASE_URL = 'https://nuxpvdmhclxftbgytrsq.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eHB2ZG1oY2x4ZnRiZ3l0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MTM5MTAsImV4cCI6MjEwMDE4OTkxMH0.JQ8a3oRnMGEhsv0szT3Zmr4n4mdyTcNA9y5I2kMlOok';

// Helper untuk mengambil Env Var dengan aman (mendukung Vite & Process.env)
const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return String((import.meta as any).env[key]).trim();
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return String(process.env[key]).trim();
  }
  return '';
};

// Normalizer agar format URL selalu valid (menangani input seperti 'nuxpvdmhclxftbgytrsq' atau URL tanpa https://)
export const normalizeSupabaseUrl = (inputUrl?: string): string => {
  let url = (inputUrl || '').trim();
  if (!url) return DEFAULT_SUPABASE_URL;

  // Jika pengguna hanya memasukkan project ref ID (contoh: "nuxpvdmhclxftbgytrsq")
  if (/^[a-z0-9_-]+$/i.test(url)) {
    return `https://${url}.supabase.co`;
  }

  // Jika tidak memiliki http:// atau https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // Validasi format URL
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return DEFAULT_SUPABASE_URL;
  }
};

const rawUrl = getEnvVar('VITE_SUPABASE_URL');
const rawKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

export const SUPABASE_URL = normalizeSupabaseUrl(rawUrl);
export const SUPABASE_ANON_KEY = rawKey || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== 'https://placeholder.supabase.co');

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase URL atau Anon Key belum diset. Aplikasi menggunakan Placeholder dan akan gagal jika melakukan request data.');
}

// Inisialisasi client dengan URL dan Anon Key yang sudah dinormalisasi dan valid
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Utility to fetch all students with pagination
export const fetchAllStudents = async (academicYear: string) => {
    let allStudents: any[] = [];
    let hasMore = true;
    let page = 0;
    const pageSize = 1000;
    
    while (hasMore) {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('academic_year', academicYear || (typeof localStorage !== 'undefined' ? localStorage.getItem('app_academic_year') : null) || '2026/2027')
            .range(page * pageSize, (page + 1) * pageSize - 1);
            
        if (error) {
            console.error('Error fetching students:', error);
            // Fallback for cases where academic_year column might not exist or causes error
            if (error.code === '42703' || error.message?.includes('academic_year')) {
               const fallbackRes = await supabase.from('students').select('*').range(page * pageSize, (page + 1) * pageSize - 1);
               if (fallbackRes.data) {
                   allStudents = [...allStudents, ...fallbackRes.data];
                   if (fallbackRes.data.length < pageSize) {
                       hasMore = false;
                   } else {
                       page++;
                   }
                   continue;
               } else {
                   break;
               }
            }
            break;
        }
        if (data) {
            allStudents = [...allStudents, ...data];
            if (data.length < pageSize) {
                hasMore = false;
            } else {
                page++;
            }
        } else {
            hasMore = false;
        }
    }
    
    return allStudents;
};
