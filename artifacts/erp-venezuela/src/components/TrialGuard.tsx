import React, { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "./ui/button";

export function TrialGuard({ children }: { children: React.ReactNode }) {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // VITE_TRIAL_END_DATE should be in format YYYY-MM-DD
    const trialEndDateStr = import.meta.env.VITE_TRIAL_END_DATE;
    
    if (trialEndDateStr) {
      const trialEndDate = new Date(trialEndDateStr);
      const now = new Date();
      if (now > trialEndDate) {
        setIsExpired(true);
      }
    }
  }, []);

  if (isExpired) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white p-6 text-center">
        <Lock className="w-24 h-24 text-destructive mb-8 animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight">SISTEMA EN PAUSA</h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12">
          Periodo de prueba finalizado. Contacte al soporte para activar su licencia y continuar usando el sistema.
        </p>
        <Button 
          size="lg" 
          className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 h-16 text-lg rounded-2xl shadow-xl shadow-[#25D366]/20"
          onClick={() => window.open("https://wa.me/584120000000", "_blank")}
        >
          Contactar por WhatsApp
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
