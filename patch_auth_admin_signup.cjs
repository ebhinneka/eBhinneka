const fs = require('fs');
const file = './contexts/AuthContext.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'const result = await supabase.auth.signInWithPassword({ email, password: finalPassword });',
  `const result = await supabase.auth.signInWithPassword({ email, password: finalPassword });
    
    // Auto-create admin if not exists
    if (result.error && result.error.message.includes('Invalid login credentials') && cleanId === '234567') {
        console.log("Admin account not found, attempting to create...");
        const signUpResult = await supabase.auth.signUp({
            email,
            password: finalPassword,
            options: {
                data: {
                    full_name: 'Administrator',
                    nip: '234567',
                    role: 'admin'
                }
            }
        });
        
        if (signUpResult.error) {
            console.error("SignUp error:", signUpResult.error.message);
            if (signUpResult.error.message.includes('Signups not allowed') || signUpResult.error.message.toLowerCase().includes('signups are disabled')) {
                 return { error: { message: 'Gagal membuat akun: "Email Signups" di Supabase Anda sedang OFF. Aktifkan di Auth > Providers.' } };
            }
            return signUpResult; 
        }
        
        if (signUpResult.data?.user?.id) {
           await supabase.from('profiles').upsert({
               id: signUpResult.data.user.id,
               nip: '234567',
               full_name: 'Administrator',
               role: 'admin'
           });
           
           return await supabase.auth.signInWithPassword({ email, password: finalPassword });
        }
    }`
);

fs.writeFileSync(file, code);
