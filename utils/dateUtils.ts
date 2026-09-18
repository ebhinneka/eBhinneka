
// Utility untuk menangani Waktu Indonesia Barat (WIB / Asia/Jakarta)

// Mendapatkan objek Date saat ini dalam WIB
export const getWIBDate = (): Date => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const wibOffset = 7 * 60 * 60000; // UTC+7
  return new Date(utc + wibOffset);
};

// Mendapatkan String ISO (YYYY-MM-DD) berdasarkan WIB
// Berguna untuk query database filter tanggal hari ini
export const getWIBISOString = (dateInput?: Date | string): string => {
  const d = dateInput 
    ? (typeof dateInput === 'string' 
        ? (dateInput.includes('T') ? new Date(dateInput) : new Date(`${dateInput}T12:00:00+07:00`)) 
        : dateInput) 
    : new Date();
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d);
};

// Format Tanggal Lengkap Indonesia (Contoh: Senin, 20 Januari 2025)
export const formatDateIndo = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  }).format(date);
};

// Format Tanggal Tanda Tangan (Contoh: 20 Januari 2025) - Tanpa Nama Hari
export const formatDateSignature = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  }).format(date);
};

// Format Jam (Contoh: 07:30)
export const formatTimeIndo = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
    hour12: false
  }).format(date).replace(/\./g, ':');
};
