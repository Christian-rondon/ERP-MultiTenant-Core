import React, { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { useCreateSale } from "@/hooks/use-sales";
import { useBcvRate } from "@/hooks/use-bcv";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatCurrencyUsd, formatCurrencyBs } from "@/lib/utils";
import { Search, Plus, Minus, Trash2, ShoppingCart, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/types";

interface CartItem extends Product {
  cartQuantity: number;
}

export default function Pos() {
  const { data: products } = useProducts();
  const { data: bcvRate } = useBcvRate();
  const createSale = useCreateSale();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"EFECTIVO_USD" | "PAGO_MOVIL" | "PUNTO_VENTA">("PAGO_MOVIL");

  const filteredProducts = products?.filter(p => 
    (p.name.toLowerCase().includes(search.toLowerCase()) || 
     p.category.toLowerCase().includes(search.toLowerCase())) &&
    p.stock > 0
  ) || [];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.cartQuantity >= product.stock) {
          toast({ title: "Stock insuficiente", variant: "destructive" });
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item);
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.cartQuantity + delta;
        if (newQ <= 0) return item;
        if (newQ > item.stock) {
          toast({ title: "Stock máximo alcanzado", variant: "destructive" });
          return item;
        }
        return { ...item, cartQuantity: newQ };
      }
      return item;
    }));
  };

  const removeRow = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalUsd = cart.reduce((sum, item) => sum + (item.priceUsd * item.cartQuantity), 0);
  const totalBs = totalUsd * (bcvRate?.rate || 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      await createSale.mutateAsync({
        paymentMethod,
        items: cart.map(item => ({ productId: item.id, quantity: item.cartQuantity }))
      });
      toast({ title: "Venta registrada con éxito", className: "bg-success text-white border-none" });
      setCart([]);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      
      {/* Product List (Left) */}
      <div className="flex-1 flex flex-col bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar productos (nombre, categoría)..." 
              className="pl-10 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <Card 
              key={product.id} 
              className="cursor-pointer hover:border-primary transition-all duration-200 active:scale-95 group relative overflow-hidden bg-gradient-to-b from-card to-secondary/30"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4 flex flex-col h-full justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1 font-medium">{product.category}</div>
                  <h4 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{product.name}</h4>
                </div>
                <div>
                  <div className="font-display font-bold text-lg text-primary">{formatCurrencyUsd(product.priceUsd)}</div>
                  <div className="text-xs text-muted-foreground">
                    Stock: <span className={product.stock <= product.minStock ? "text-destructive font-bold" : "text-foreground"}>{product.stock}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart (Right) */}
      <div className="w-full lg:w-96 flex flex-col bg-card rounded-2xl border border-border shadow-xl overflow-hidden shrink-0">
        <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito actual
          </h2>
          <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-bold">
            {cart.length} items
          </span>
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <Receipt className="w-16 h-16 mb-4" />
              <p>El carrito está vacío</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex flex-col gap-2 p-3 bg-background rounded-xl border border-border">
                <div className="flex justify-between items-start">
                  <h5 className="font-semibold text-sm leading-tight flex-1 mr-2">{item.name}</h5>
                  <button onClick={() => removeRow(item.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 border border-border">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-background rounded-md text-foreground">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.cartQuantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-background rounded-md text-foreground">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{formatCurrencyUsd(item.priceUsd * item.cartQuantity)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-border bg-secondary/20 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Total USD</span>
              <span className="font-bold text-foreground">{formatCurrencyUsd(totalUsd)}</span>
            </div>
            <div className="flex justify-between items-end border-t border-border pt-2">
              <span className="text-sm font-medium">Total a Pagar (Bs)</span>
              <span className="text-3xl font-display font-bold text-accent">
                {formatCurrencyBs(totalBs).replace('VES', 'Bs')}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Método de Pago</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "PAGO_MOVIL", label: "Pago Móvil" },
                { id: "PUNTO_VENTA", label: "Punto de Venta" },
                { id: "EFECTIVO_USD", label: "Efectivo $" }
              ].map(pm => (
                <button
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id as any)}
                  className={cn(
                    "px-2 py-3 text-xs font-semibold rounded-xl border text-center transition-all duration-200",
                    paymentMethod === pm.id 
                      ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "bg-background border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          <Button 
            className="w-full h-14 text-lg font-bold shadow-xl rounded-2xl" 
            size="lg"
            disabled={cart.length === 0 || createSale.isPending}
            onClick={handleCheckout}
          >
            {createSale.isPending ? "Procesando..." : "Completar Venta"}
          </Button>
        </div>
      </div>
    </div>
  );
}
