const fs = require('fs');
let content = fs.readFileSync('pages/ImportData.tsx', 'utf8');

// Import papaparse
if (!content.includes("import Papa from 'papaparse';")) {
    content = content.replace(
        "import { createClient } from '@supabase/supabase-js';",
        "import { createClient } from '@supabase/supabase-js';\nimport Papa from 'papaparse';"
    );
}

// Replace parseCSV
const oldParseCSV = `  const parseCSV = (text: string) => {
    const lines = text.split(/\\r?\\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    // Deteksi delimiter (koma atau titik koma) berdasarkan baris pertama
    const firstLine = lines[0];
    const delimiter = firstLine.includes(';') ? ';' : ',';

    const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));

    return lines.slice(1).map(line => {
      const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
      const row: any = {};
      headers.forEach((header, index) => {
        // Handle jika values kurang dari headers
        row[header] = values[index] || '';
      });
      return row;
    });
  };`;

const newParseCSV = `  const parseCSV = (text: string) => {
    // Menggunakan papaparse dan memaksa delimiter ';' sesuai permintaan
    // sehingga koma di dalam nama/teks (seperti gelar) tidak memisahkan kolom
    const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: ';'
    });
    return result.data;
  };`;

content = content.replace(oldParseCSV, newParseCSV);

fs.writeFileSync('pages/ImportData.tsx', content);
