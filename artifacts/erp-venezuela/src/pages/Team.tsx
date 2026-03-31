import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Users, Plus, Edit2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: number;
  username: string;
  name: string;
  role: string;
  isActive: boolean;
  comercioId: number | null;
  createdAt: string;
}

function useTeam() {
  return useQuery<TeamMember[]>({
    queryKey: ["team"],
    queryFn: () => fetchWithAuth<TeamMember[]>("/users/team"),
  });
}

export default function Team() {
  const { data: team, isLoading } = useTeam();
  const qc = useQueryClient();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({ username: "", name: "", password: "", role: "CAJERA" });

  const createMember = useMutation({
    mutationFn: (data: typeof form) =>
      fetchWithAuth("/users/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["team"] }); setIsModalOpen(false); },
  });

  const updateMember = useMutation({
    mutationFn: ({ id, ...data }: { id: number; name?: string; isActive?: boolean; password?: string }) =>
      fetchWithAuth(`/users/team/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["team"] }); setIsModalOpen(false); },
  });

  const handleOpen = (member?: TeamMember) => {
    if (member) {
      setEditing(member);
      setForm({ username: member.username, name: member.name, password: "", role: member.role });
    } else {
      setEditing(null);
      setForm({ username: "", name: "", password: "", role: "CAJERA" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        const payload: any = { id: editing.id, name: form.name };
        if (form.password) payload.password = form.password;
        await updateMember.mutateAsync(payload);
        toast({ title: "Miembro actualizado", className: "bg-success text-white border-none" });
      } else {
        await createMember.mutateAsync(form);
        toast({ title: "Miembro añadido", className: "bg-success text-white border-none" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const toggleActive = async (member: TeamMember) => {
    try {
      await updateMember.mutateAsync({ id: member.id, isActive: !member.isActive });
      toast({ title: member.isActive ? "Usuario desactivado" : "Usuario activado" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Mi Equipo</h1>
            <p className="text-muted-foreground text-sm">Gestiona los usuarios de tu comercio.</p>
          </div>
        </div>
        <Button onClick={() => handleOpen()} className="rounded-xl gap-2">
          <Plus className="w-4 h-4" />
          Añadir Miembro
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="text-center py-12 text-muted-foreground">Cargando equipo...</p>
          ) : !team?.length ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No tienes miembros en tu equipo aún.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {team.map(member => (
                <div key={member.id} className={cn("flex items-center gap-4 p-4", !member.isActive && "opacity-60")}>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary flex-shrink-0">
                    {member.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">@{member.username} · <span className="font-medium">{member.role}</span></p>
                  </div>
                  <button
                    onClick={() => toggleActive(member)}
                    className={cn("text-xs font-bold px-3 py-1 rounded-full transition-all",
                      member.isActive ? "bg-success/15 text-success hover:bg-success/25" : "bg-destructive/15 text-destructive hover:bg-destructive/25"
                    )}
                  >
                    {member.isActive ? "ACTIVO" : "INACTIVO"}
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => handleOpen(member)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md w-full overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Miembro" : "Añadir Miembro"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">Username</label>
                <Input
                  required
                  disabled={!!editing}
                  placeholder="ej: vendedor01"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">Nombre Completo</label>
                <Input
                  required
                  placeholder="ej: Pedro González"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              {!editing && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Rol</label>
                  <Input
                    placeholder="ej: CAJERA, VENDEDOR, ALMACENISTA"
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">
                  Contraseña{editing && <span className="text-muted-foreground font-normal"> (vacío = no cambiar)</span>}
                </label>
                <Input
                  type="password"
                  required={!editing}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createMember.isPending || updateMember.isPending}>
                {editing ? "Guardar" : "Añadir"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
