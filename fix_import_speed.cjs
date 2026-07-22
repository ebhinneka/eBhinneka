const fs = require('fs');
let content = fs.readFileSync('pages/ImportData.tsx', 'utf8');

const oldSchedulesBlock = `        } else if (activeTab === 'schedules') {
            const schedulesToInsert = [];
            
            for (const row of previewData) {`;

const newSchedulesBlock = `        } else if (activeTab === 'schedules') {
            const schedulesToInsert = [];
            
            // Prefetch profiles to avoid N+1 queries
            const { data: profilesData } = await supabase.from('profiles').select('id, nip');
            const nipToIdMap = {};
            if (profilesData) {
                profilesData.forEach(p => {
                    if (p.nip) nipToIdMap[p.nip] = p.id;
                });
            }

            for (const row of previewData) {`;

content = content.replace(oldSchedulesBlock, newSchedulesBlock);

const oldTeacherLookup = `                // Cari ID Guru dari profiles
                let teacherId = null;
                if (nip) {
                    const { data: t } = await supabase.from('profiles').select('id').eq('nip', nip).single();
                    if(t) teacherId = t.id;
                }`;

const newTeacherLookup = `                // Cari ID Guru dari map
                let teacherId = null;
                if (nip && nipToIdMap[nip]) {
                    teacherId = nipToIdMap[nip];
                }`;

content = content.replace(oldTeacherLookup, newTeacherLookup);
fs.writeFileSync('pages/ImportData.tsx', content);
