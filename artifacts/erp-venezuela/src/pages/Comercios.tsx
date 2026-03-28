import React, { useState } from "react";
import { useComercios, useCreateComercio, useToggleComercio } from "@/hooks/use-comercios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Building2, Plus, CheckCircle, XCircle, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Comercio } from "@/lib/types";

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
      isActive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
    )}>
      {isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      {isActive ? "Activo" : "Suspendido"}
    </span>
  );
}

export default function Comercios() {
  const { data: comercios, isLoading } = useComercios();
  const createComercio = useCreateComercio();
  const toggleComercio = useToggleComercio();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    uniqueCode: "",
    ownerUsername: "",
    ownerPassword: "",
  });

  const handleCreate = async () => {
    if (!form.name || !form.ownerName || !form.uniqueCode || !form.ownerUsername || !form.ownerPassword) {
      toast({ title: "Complete todos los campos", variant: "destructive" });
      return;
    }
    try {
      await createComercio.mutateAsync(form);
      toast({ title: `Comercio "${form.name}" creado con éxito`, className: "bg-success text-white border-none" });
      setForm({ name: "", ownerName: "", uniqueCode: "", ownerUsername: "", ownerPassword: "" });
      setShowForm(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleToggle = async (comercio: Comercio) => {
    try {
      await toggleComercio.mutateAsync({ id: comercio.id, isActive: !comercio.isActive });
      toast({
        title: comercio.isActive ? `"${comercio.name}" suspendido` : `"${comercio.name}" activado`,
        className: comercio.isActive ? "bg-destructive text-white border-none" : "bg-success text-white border-none",
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            Panel de Comercios
          </h1>
          <p className="text-muted-foreground mt-1">Gestiona los negocios registrados en el sistema.</p>
        </div>
        <Button onClick={() => setShowForm(v => !v)} className="gap-2 rounded-xl h-11 px-6">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancelar" : "Nuevo Comercio"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/30 shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Registrar Nuevo Comercio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Nombre del Negocio</label>
                <Input
                  placeholder="Ej: Bodega El Amanecer"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Nombre del Dueño</label>
                <Input
                  placeholder="Ej: Juan Pérez"
                  value={form.ownerName}
                  onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Código Único (slug)</label>
                <Input
                  placeholder="Ej: bodega-amanecer"
                  value={form.uniqueCode}
                  onChange={e => setForm(f => ({ ...f, uniqueCode: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Usuario del Dueño</label>
                <Input
                  placeholder="Ej: dueno_amanecer"
                  value={form.ownerUsername}
                  onChange={e => setForm(f => ({ ...f, ownerUsername: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold">Contraseña del Dueño</label>
                <Input
                  type="password"
                  placeholder="Contraseña inicial"
                  value={form.ownerPassword}
                  onChange={e => setForm(f => ({ ...f, ownerPassword: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleCreate}
                disabled={createComercio.isPending}
                className="px-8 h-11 rounded-xl gap-2"
              >
                {createComercio.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Crear Comercio
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">Cargando comercios...</div>
      ) : !comercios?.length ? (
        <Card className="border-dashed bg-transparent shadow-none">
          <CardContent className="py-16 text-center text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No hay comercios registrados</p>
            <p className="text-sm mt-1">Crea el primero con el botón de arriba.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {comercios.map(comercio => (
            <Card
              key={comercio.id}
              className={cn(
                "transition-all duration-300",
                !comercio.isActive && "opacity-60 grayscale"
              )}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg leading-tight truncate">{comercio.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{comercio.ownerName}</p>
                  </div>
                  <StatusBadge isActive={comercio.isActive} />
                </div>

                <div className="text-xs text-muted-foreground space-y-1 bg-secondary/30 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span>Código:</span>
                    <span className="font-mono font-semibold text-foreground">{comercio.uniqueCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registrado:</span>
                    <span className="font-medium text-foreground">
                      {new Date(comercio.createdAt).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                <Button
                  variant={comercio.isActive ? "destructive" : "default"}
                  size="sm"
                  className="w-full rounded-xl"
                  disabled={toggleComercio.isPending}
                  onClick={() => handleToggle(comercio)}
                >
                  {toggleComercio.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : comercio.isActive ? (
                    <><XCircle className="w-4 h-4 mr-2" /> Suspender Comercio</>
                  ) : (
                    <><CheckCircle className="w-4 h-4 mr-2" /> Activar Comercio</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
