import React from "react";
import { ShieldOff, Phone } from "lucide-react";
import { Button } from "./ui/button";

export function SuspendedScreen() {
  const handleWhatsApp = () => {
    window.open("https://wa.me/584121234567?text=Hola,%20mi%20comercio%20fue%20suspendido%20en%20ERP%20Venezuela.%20Necesito%20ayuda.", "_blank");
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="w-24 h-24 mx-auto rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center">
          <ShieldOff className="w-12 h-12 text-destructive" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Comercio Suspendido
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            El acceso a este sistema ha sido suspendido por el administrador.
            Por favor, contacta al soporte para reactivar tu cuenta.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full h-14 rounded-2xl text-lg font-bold gap-3 bg-[#25D366] hover:bg-[#20b858] text-white border-none"
          onClick={handleWhatsApp}
        >
          <Phone className="w-5 h-5" />
          Contactar Soporte por WhatsApp
        </Button>

        <button
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => {
            localStorage.removeItem("erp_token");
            window.location.href = "/login";
          }}
        >
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
}
