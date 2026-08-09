import { createClient } from '@supabase/supabase-js';

// Helper untuk mengambil Env Var dengan aman (mendukung Vite & Process.env)
const getEnvVar = (key: string) => {
  // Fix TS error: Property 'env' does not exist on type 'ImportMeta'
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  // Fallback untuk environment tertentu
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

// Default configuration from user input
const DEFAULT_SUPABASE_URL = 'https://nuxpvdmhclxftbgytrsq.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eHB2ZG1oY2x4ZnRiZ3l0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MTM5MTAsImV4cCI6MjEwMDE4OTkxMH0.JQ8a3oRnMGEhsv0szT3Zmr4n4mdyTcNA9y5I2kMlOok';

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL') || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== 'https://placeholder.supabase.co');

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase URL atau Anon Key belum diset. Aplikasi menggunakan Placeholder dan akan gagal jika melakukan request data.');
}

// Gunakan placeholder agar createClient tidak crash saat inisialisasi
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co', 
  SUPABASE_ANON_KEY || 'placeholder'
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
            .eq('academic_year', academicYear || '2025/2026')
            .range(page * pageSize, (page + 1) * pageSize - 1);
            
        if (error) {
            console.error('Error fetching students:', error);
            // Fallback for cases where academic_year column might not exist or causes error (some components had this fallback)
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
