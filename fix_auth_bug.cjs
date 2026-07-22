const fs = require('fs');
let content = fs.readFileSync('contexts/AuthContext.tsx', 'utf8');

// Fix infinite recursion in refreshClasses
content = content.replace(
    `  const refreshClasses = async () => {
    try {
        if (!isSupabaseConfigured) return;
        await refreshClasses();`,
    `  const refreshClasses = async () => {
    try {
        if (!isSupabaseConfigured) return;`
);

// Add to fetchSettings if missing
if (!content.includes('await refreshClasses();')) {
    content = content.replace(
        `    const fetchSettings = async () => {
      try {
        if (!isSupabaseConfigured) return;`,
        `    const fetchSettings = async () => {
      try {
        if (!isSupabaseConfigured) return;
        await refreshClasses();`
    );
}

fs.writeFileSync('contexts/AuthContext.tsx', content);
