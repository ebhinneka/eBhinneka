const fs = require('fs');
const file = './contexts/AuthContext.tsx';
let code = fs.readFileSync(file, 'utf8');

const newSignIn = `  const signIn = async (userId: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: "Konfigurasi Supabase belum diset. Hubungi Admin." } };
    }

    const cleanId = userId.trim();
    const idOnly = cleanId.split('@')[0];
    const email = \`\${idOnly}@sekolah.id\`; 

    const result = await supabase.auth.signInWithPassword({ email, password });
    return result;
  };

  const signOut =`;

code = code.replace(/const signIn = async \(userId: string, password: string\) => {[\s\S]*?const signOut =/, newSignIn);

fs.writeFileSync(file, code);
