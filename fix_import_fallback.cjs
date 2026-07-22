const fs = require('fs');
let content = fs.readFileSync('pages/ImportData.tsx', 'utf8');

const oldInsert = `             if (schedulesToInsert.length > 0) {
                const { error } = await supabase.from('schedules').insert(schedulesToInsert);
                if (error) throw error;
                successCount = schedulesToInsert.length;
            }`;

const newInsert = `             if (schedulesToInsert.length > 0) {
                let { error } = await supabase.from('schedules').insert(schedulesToInsert);
                if (error && (error.code === '42703' || error.message?.includes('academic_year') || error.message?.includes('semester') || error.message?.includes('schedule_version') || error.message?.includes('schema cache'))) {
                    // Fallback without academic_year and semester
                    let fallbackPayloads = schedulesToInsert.map(p => {
                        const { schedule_version, ...rest } = p as any;
                        return rest;
                    });
                    let fallbackRes = await supabase.from('schedules').insert(fallbackPayloads);
                    if (fallbackRes.error && fallbackRes.error.code === '42703') {
                        fallbackPayloads = fallbackPayloads.map(p => {
                            const { academic_year, semester, ...rest } = p as any;
                            return rest;
                        });
                        fallbackRes = await supabase.from('schedules').insert(fallbackPayloads);
                    }
                    error = fallbackRes.error;
                }
                
                // Fallback 2: Maybe teacher_id is required but null?
                if (error && (error.message?.includes('teacher_id') || error.message?.includes('null value in column "teacher_id"'))) {
                     throw new Error("Gagal menyimpan jadwal: Pastikan NIPY Guru di file Excel sama dengan NIPY di Data Guru.");
                }

                if (error) throw error;
                successCount = schedulesToInsert.length;
            }`;

content = content.replace(oldInsert, newInsert);

fs.writeFileSync('pages/ImportData.tsx', content);
