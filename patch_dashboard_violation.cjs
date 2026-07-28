const fs = require('fs');
let dash = fs.readFileSync('pages/Dashboard.tsx', 'utf8');

// 1. Add interface for violations
dash = dash.replace(
  "interface WaliKelasAbsence {",
  "interface WaliKelasViolation {\n    student_id: string;\n    student_name: string;\n    category: string;\n    note: string;\n}\n\ninterface WaliKelasAbsence {"
);

// 2. Add state
dash = dash.replace(
  "const [homeroomAbsences, setHomeroomAbsences] = useState<WaliKelasAbsence[]>([]);",
  "const [homeroomAbsences, setHomeroomAbsences] = useState<WaliKelasAbsence[]>([]);\n  const [homeroomViolations, setHomeroomViolations] = useState<WaliKelasViolation[]>([]);"
);

// 3. Fetch data inside fetchDashboardData
// Wait, the fetch is inside toggleInputForm? No, fetchDashboardData is inside useEffect.
const oldFetch = `            if (students && students.length > 0) {
                const studentIds = students.map(s => s.id);
                const { data: homeroomLogs } = await supabase`;
const newFetch = `            if (students && students.length > 0) {
                const studentIds = students.map(s => s.id);
                
                // Fetch violations
                const { data: violationLogs } = await supabase
                    .from('journal_notes')
                    .select('student_id, student_name, category, note')
                    .eq('type', 'kedisiplinan')
                    .gte('created_at', \`\${filterDate}T00:00:00+07:00\`)
                    .lte('created_at', \`\${filterDate}T23:59:59+07:00\`)
                    .in('student_id', studentIds);
                    
                if (violationLogs) {
                    setHomeroomViolations(violationLogs as WaliKelasViolation[]);
                } else {
                    setHomeroomViolations([]);
                }

                const { data: homeroomLogs } = await supabase`;
dash = dash.replace(oldFetch, newFetch);

// 4. Update the widget rendering
const oldWidgetHeader = `{homeroomAbsences.length > 0 ? \`\${homeroomAbsences.length} Murid Absen\` : 'Semua Hadir'}`;
const newWidgetHeader = `{homeroomAbsences.length > 0 || homeroomViolations.length > 0 ? \`\${homeroomAbsences.length} Absen, \${homeroomViolations.length} Pelanggaran\` : 'Semua Hadir & Tertib'}`;
dash = dash.replace(oldWidgetHeader, newWidgetHeader);

const oldBellLogic = `{homeroomAbsences.length > 0 ? <Bell size={20} className="animate-pulse" /> : <CheckCircle2 size={22} />}`;
const newBellLogic = `{(homeroomAbsences.length > 0 || homeroomViolations.length > 0) ? <Bell size={20} className="animate-pulse text-red-500" /> : <CheckCircle2 size={22} />}`;
dash = dash.replace(oldBellLogic, newBellLogic);

const oldBellColor = `homeroomAbsences.length > 0 
                                    ? 'bg-sky-100 dark:bg-slate-900/30 border-blue-300 dark:border-slate-900 text-blue-600 dark:text-blue-500' 
                                    : 'bg-sky-100 dark:bg-blue-500/30 border-blue-300 dark:border-blue-500 text-blue-500 dark:text-blue-500'`;
const newBellColor = `(homeroomAbsences.length > 0 || homeroomViolations.length > 0)
                                    ? 'bg-red-100 dark:bg-slate-900/30 border-red-300 dark:border-slate-900 text-red-600 dark:text-red-500' 
                                    : 'bg-sky-100 dark:bg-blue-500/30 border-blue-300 dark:border-blue-500 text-blue-500 dark:text-blue-500'`;
dash = dash.replace(oldBellColor, newBellColor);

const oldEmptyMsg = `{homeroomAbsences.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-xs font-medium italic bg-slate-50/50 dark:bg-slate-900/50 rounded-xl px-4 py-8 border border-slate-100 dark:border-slate-700 border-dashed">
                                        <CheckCircle2 size={14} className="mr-2"/> Tidak ada laporan ketidakhadiran murid pada tanggal ini.
                                    </div>
                                ) : (`;
const newEmptyMsg = `{(homeroomAbsences.length === 0 && homeroomViolations.length === 0) ? (
                                    <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-xs font-medium italic bg-slate-50/50 dark:bg-slate-900/50 rounded-xl px-4 py-8 border border-slate-100 dark:border-slate-700 border-dashed">
                                        <CheckCircle2 size={14} className="mr-2"/> Tidak ada laporan ketidakhadiran murid atau pelanggaran pada tanggal ini.
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-6">
                                    {homeroomViolations.length > 0 && (
                                        <div className="animate-fade-in border border-red-100 bg-red-50 rounded-2xl p-4">
                                            <div className="flex items-center gap-2 mb-3 border-b border-red-100 pb-2">
                                                <AlertTriangle size={16} className="text-red-500" />
                                                <h4 className="font-extrabold text-red-700 text-xs uppercase">Pelanggaran Hari Ini</h4>
                                            </div>
                                            <div className="space-y-2">
                                                {homeroomViolations.map((v, idx) => (
                                                    <div key={idx} className="flex flex-col bg-white rounded-xl p-3 shadow-sm border border-red-50">
                                                        <span className="font-bold text-slate-800 text-sm">{v.student_name}</span>
                                                        <span className="text-xs text-red-600 font-bold">{v.category}</span>
                                                        {v.note && <span className="text-xs text-slate-500 mt-1">{v.note}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}`;
dash = dash.replace(oldEmptyMsg, newEmptyMsg);

const oldCloseDiv = `                                        <AbsenceSection title="SAKIT" list={listSakit} colorClass="text-blue-500 dark:text-blue-500" icon={Stethoscope} onEdit={handleEditSpecific} />
                                        <AbsenceSection title="DISPEN" list={listDispen} colorClass="text-blue-600 dark:text-blue-500" icon={Flag} onEdit={handleEditSpecific} />
                                    </div>
                                )}`;
const newCloseDiv = `                                        <AbsenceSection title="SAKIT" list={listSakit} colorClass="text-blue-500 dark:text-blue-500" icon={Stethoscope} onEdit={handleEditSpecific} />
                                        <AbsenceSection title="DISPEN" list={listDispen} colorClass="text-blue-600 dark:text-blue-500" icon={Flag} onEdit={handleEditSpecific} />
                                    </div>
                                    </div>
                                )}`;
dash = dash.replace(oldCloseDiv, newCloseDiv);


fs.writeFileSync('pages/Dashboard.tsx', dash);
console.log("Done");
