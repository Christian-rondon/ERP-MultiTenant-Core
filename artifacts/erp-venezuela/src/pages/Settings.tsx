import React, { useState } from "react";
import { useBcvRate, useUpdateBcvRate } from "@/hooks/use-bcv";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Globe, Settings2 } from "lucide-react";

export default function Settings() {
  const { data: bcvRate, isLoading } = useBcvRate();
  const updateBcv = useUpdateBcvRate();
  const { toast } = useToast();
  
  const [manualRate, setManualRate] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualRate || isNaN(parseFloat(manualRate))) return;
    
    try {
      await updateBcv.mutateAsync(parseFloat(manualRate));
      toast({ title: "Tasa actualizada exitosamente", className: "bg-success text-white" });
      setManualRate("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold">Configuración Global</h1>
        <p className="text-muted-foreground mt-1">Ajustes del motor económico y sistema.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Tasa de Cambio BCV
          </CardTitle>
          <CardDescription>
            El sistema intenta obtener la tasa automáticamente. Usa esta opción solo en caso de fallo del scraper.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-secondary/30 p-4 rounded-xl border border-border flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Tasa Actual Sistema</p>
              <h3 className="text-3xl font-display font-bold text-foreground">
                {isLoading ? "..." : `${bcvRate?.rate.toFixed(2)} Bs/$`}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground font-medium mb-2">Origen</p>
              {bcvRate?.source === 'SCRAPER' ? (
                <Badge variant="success" className="bg-[#25D366]">Automático (BCV)</Badge>
              ) : (
                <Badge variant="warning">Manual</Badge>
              )}
            </div>
          </div>

          <form onSubmit={handleUpdate} className="bg-background/50 p-6 rounded-2xl border border-border space-y-4 shadow-inner">
            <h4 className="font-semibold flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-muted-foreground" />
              Sobreescritura Manual
            </h4>
            <div className="flex gap-4">
              <Input 
                placeholder="Ej. 36.50" 
                value={manualRate}
                onChange={e => setManualRate(e.target.value)}
                className="text-lg bg-background"
                required
              />
              <Button type="submit" disabled={updateBcv.isPending} className="px-8 shadow-xl">
                Forzar Tasa
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Advertencia: Al forzar la tasa, el sistema dejará de usar el scraper automático hasta que se reinicie el ciclo diario.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
