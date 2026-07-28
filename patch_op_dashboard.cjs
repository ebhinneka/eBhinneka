const fs = require('fs');
let op = fs.readFileSync('pages/OperatorDashboard.tsx', 'utf8');

const oldScheduleCode = `          const schedules = schedulesRes.data || [];
          const journals = journalsRes.data || [];`;

const newScheduleCode = `          let schedules = schedulesRes.data || [];
          const validHoursMap: Record<number, number[]> = {
              1: [3, 4, 5, 6],
              2: [1, 2, 3, 4, 5, 6],
              3: [1, 2, 3, 4, 5, 6, 7, 8],
              4: [3, 4, 5, 6],
              6: [1, 2, 3, 4, 5, 6, 7, 8],
              7: [1, 2, 3, 4, 5, 6]
          };
          if (validHoursMap[dbDay]) {
              const validHours = validHoursMap[dbDay];
              schedules = schedules.filter(sch => {
                  const schHours = sch.hour.split(',').map((h: any) => parseInt(h.trim())).filter((h: number) => !isNaN(h));
                  return schHours.some((h: number) => validHours.includes(h));
              });
          }

          const journals = journalsRes.data || [];`;

if (op.includes(oldScheduleCode)) {
    op = op.replace(oldScheduleCode, newScheduleCode);
} else {
    console.log("Not found in OperatorDashboard");
}
fs.writeFileSync('pages/OperatorDashboard.tsx', op);
console.log("Done");
