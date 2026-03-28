import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { useLocation } from "wouter";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn, user } = useAuth();
  const [_, setLocation] = useLocation();
  const [error, setError] = useState("");

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === "DEVELOPER") setLocation("/users");
      else if (user.role === "DUENO") setLocation("/dashboard");
      else setLocation("/pos");
    }
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login({ username, password });
      if (data.user.role === "DEVELOPER") setLocation("/users");
      else if (data.user.role === "DUENO") setLocation("/dashboard");
      else setLocation("/pos");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/login-bg.png`} 
          alt="Abstract dark background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="glass rounded-3xl p-8 sm:p-10 shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-2">ERP Vzla</h1>
            <p className="text-muted-foreground text-center">Inicie sesión para continuar al panel de control</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Usuario</label>
              <Input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su usuario"
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Contraseña</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base mt-4" disabled={isLoggingIn}>
              {isLoggingIn ? "Ingresando..." : "Ingresar al sistema"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
