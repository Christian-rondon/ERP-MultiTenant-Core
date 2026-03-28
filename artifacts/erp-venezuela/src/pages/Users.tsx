import React, { useState } from "react";
import { useUsers, useCreateUser, useUpdateUser } from "@/hooks/use-users";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit2, ShieldAlert } from "lucide-react";
import { User, UserRole } from "@/lib/types";

export default function Users() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    username: "", name: "", password: "", role: "CAJERA" as UserRole, isActive: true
  });

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        name: user.name,
        password: "", // Don't show password
        role: user.role,
        isActive: user.isActive
      });
    } else {
      setEditingUser(null);
      setFormData({ username: "", name: "", password: "", role: "CAJERA", isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const dataToUpdate: any = { id: editingUser.id, name: formData.name, isActive: formData.isActive };
      if (formData.password) dataToUpdate.password = formData.password;
      await updateUser.mutateAsync(dataToUpdate);
    } else {
      await createUser.mutateAsync(formData as any);
    }
    setIsModalOpen(false);
  };

  const toggleStatus = async (user: User) => {
    await updateUser.mutateAsync({ id: user.id, isActive: !user.isActive });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-primary/10 border border-primary/20 p-6 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-xl">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Gestión de Usuarios</h1>
            <p className="text-muted-foreground text-sm">Control de acceso y roles del sistema.</p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-xl shadow-xl shadow-primary/20">
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
        <Table>
          <TableHeader>
            <TableRow className="bg-background/50">
              <TableHead>Usuario</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Cargando...</TableCell></TableRow>
            ) : (
              users?.map((user) => (
                <TableRow key={user.id} className={!user.isActive ? "opacity-60" : ""}>
                  <TableCell className="font-semibold">{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary/50 font-bold tracking-wide">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <button 
                      onClick={() => toggleStatus(user)}
                      disabled={user.role === 'DEVELOPER'} // Don't allow disabling developers easily
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${user.isActive ? 'bg-success/20 text-success hover:bg-success/30' : 'bg-destructive/20 text-destructive hover:bg-destructive/30'}`}
                    >
                      {user.isActive ? "ACTIVO" : "BANEADO"}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(user)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input required disabled={!!editingUser} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre Completo</label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Rol</label>
                <select 
                  className="flex h-11 w-full rounded-xl border-2 border-input bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                >
                  <option value="CAJERA">Cajera</option>
                  <option value="DUENO">Dueño</option>
                  <option value="DEVELOPER">Desarrollador</option>
                </select>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Contraseña {editingUser && "(Dejar en blanco para no cambiar)"}</label>
              <Input type="password" required={!editingUser} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createUser.isPending || updateUser.isPending}>
                {editingUser ? "Guardar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
