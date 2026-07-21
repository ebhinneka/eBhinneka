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
    <div className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#3988d8] transition-opacity duration-500 ${stage === 2 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-slate-100/15 rounded-full z-0"></div>
      
      <div className={`relative z-10 flex flex-col items-center transition-all duration-[3000ms] ease-out ${stage === 0 ? 'scale-50 opacity-0' : 'scale-125 opacity-100'}`}>
        <img 
            src="https://i.imghippo.com/files/WXB3962h.png" 
            alt="Logo SMP Bhinneka" 
            className="w-40 h-40 object-contain drop-shadow-2xl"
        />
        <div className="mt-8 text-slate-100 text-center">
            <h1 className="text-3xl font-extrabold tracking-widest drop-shadow-lg">eBhinneka</h1>
            <p className="text-sm font-bold opacity-80 mt-2 tracking-wide">Digitalisasi Administrasi & Kinerja</p>
        </div>
      </div>
    </div>
  );
};
