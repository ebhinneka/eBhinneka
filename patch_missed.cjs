const fs = require('fs');
let content = fs.readFileSync('pages/Dashboard.tsx', 'utf-8');

// We can add a hook or just calculate it before rendering the return
const calculationCode = `
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(() => {
      const now = new Date();
      return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
      const interval = setInterval(() => {
          const now = new Date();
          setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
      }, 60000); // update every minute
      return () => clearInterval(interval);
  }, []);

  let isDatangMissed = false;
  let isPulangMissed = false;

  if (staffGeolocations.length > 0) {
      const hasDatangEndTime = staffGeolocations.some((g: any) => g.endTime);
      if (hasDatangEndTime) {
          isDatangMissed = staffGeolocations.every((g: any) => {
              if (!g.endTime) return false;
              const [h, m] = g.endTime.split(':').map(Number);
              return currentTimeMinutes > h * 60 + m;
          });
      }

      const hasPulangEndTime = staffGeolocations.some((g: any) => g.pulangEndTime);
      if (hasPulangEndTime) {
          isPulangMissed = staffGeolocations.every((g: any) => {
              if (!g.pulangEndTime) return false;
              const [h, m] = g.pulangEndTime.split(':').map(Number);
              return currentTimeMinutes > h * 60 + m;
          });
      }
  }

  // Handle staff rendering logic
`;

content = content.replace(
    /const progressPercentage = stats && stats\.targetJp > 0/,
    calculationCode + "\n  const progressPercentage = stats && stats.targetJp > 0"
);

fs.writeFileSync('pages/Dashboard.tsx', content);
console.log("Done adding time tracking");
