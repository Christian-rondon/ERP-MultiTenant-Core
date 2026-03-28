import React, { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { formatCurrencyUsd, cn } from "@/lib/utils";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Product } from "@/lib/types";

export default function Inventory() {
  const { user } = useAuth();
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "", category: "", costUsd: 0, priceUsd: 0, stock: 0, minStock: 0
  });

  const isReadonly = user?.role === "CAJERA";

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        costUsd: product.costUsd,
        priceUsd: product.priceUsd,
        stock: product.stock,
        minStock: product.minStock
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: "", category: "", costUsd: 0, priceUsd: 0, stock: 0, minStock: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, ...formData });
    } else {
      await createProduct.mutateAsync(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      await deleteProduct.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar productos..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {!isReadonly && (
          <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Producto
          </Button>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Costo</TableHead>
              <TableHead className="text-right">Precio Venta</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              {!isReadonly && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Cargando...</TableCell></TableRow>
            ) : filteredProducts?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">No se encontraron productos</TableCell></TableRow>
            ) : (
              filteredProducts?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                  <TableCell><Badge variant="secondary">{product.category}</Badge></TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrencyUsd(product.costUsd)}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">{formatCurrencyUsd(product.priceUsd)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={product.stock <= product.minStock ? "destructive" : "success"} className="text-sm w-16 justify-center">
                      {product.stock}
                    </Badge>
                  </TableCell>
                  {!isReadonly && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(product)} className="hover:text-primary">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Nombre del producto</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Categoría</label>
                <Input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Costo (USD)</label>
                <Input type="number" step="0.01" min="0" required value={formData.costUsd} onChange={e => setFormData({...formData, costUsd: parseFloat(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio Venta (USD)</label>
                <Input type="number" step="0.01" min="0" required value={formData.priceUsd} onChange={e => setFormData({...formData, priceUsd: parseFloat(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Actual</label>
                <Input type="number" min="0" required value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Mínimo</label>
                <Input type="number" min="0" required value={formData.minStock} onChange={e => setFormData({...formData, minStock: parseInt(e.target.value)})} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
                {editingProduct ? "Guardar Cambios" : "Crear Producto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
