import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Sequence animations
    const t1 = setTimeout(() => setStage(1), 100); // Start scale up
    const t2 = setTimeout(() => setStage(2), 4000); // Start fade out
    const t3 = setTimeout(() => onComplete(), 4500); // Complete
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white dark:bg-slate-900 transition-opacity duration-500 ${stage === 2 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-blue-600/5 dark:bg-blue-500/10 rounded-full z-0"></div>
      
      <div className={`relative z-10 flex flex-col items-center transition-all duration-[3000ms] ease-out ${stage === 0 ? 'scale-50 opacity-0' : 'scale-125 opacity-100'}`}>
        <img 
            src="https://i.imghippo.com/files/WXB3962h.png" 
            alt="Logo SMP Bhinneka" 
            className="w-40 h-40 object-contain drop-shadow-2xl"
        />
        <div className="mt-8 text-slate-800 dark:text-slate-100 text-center">
            <h1 className="text-3xl font-extrabold tracking-widest text-blue-700 dark:text-blue-500 drop-shadow-sm">eBhinneka</h1>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 opacity-90 mt-2 tracking-wide">Digitalisasi Administrasi & Kinerja</p>
        </div>
      </div>
    </div>
  );
};
