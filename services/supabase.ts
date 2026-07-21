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