import React from "react";
import { useSalesSummary } from "@/hooks/use-sales";
import { useProducts } from "@/hooks/use-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyUsd, formatCurrencyBs } from "@/lib/utils";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { DollarSign, AlertTriangle, TrendingUp, ShoppingBag } from "lucide-react";

export default function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useSalesSummary();
  const { data: products } = useProducts();

  const criticalStock = products?.filter(p => p.stock <= p.minStock) || [];

  if (isLoadingSummary || !summary) {
    return <div className="text-center p-12 text-muted-foreground">Cargando dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Alert Banner */}
      {criticalStock.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center gap-4 text-destructive shadow-lg shadow-destructive/5">
          <AlertTriangle className="w-8 h-8 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-lg">Alerta de Inventario Crítico</h4>
            <p className="text-sm opacity-90">Hay {criticalStock.length} productos por debajo del stock mínimo. Revise el inventario.</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Ventas Totales (USD)</p>
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><DollarSign className="w-5 h-5" /></div>
            </div>
            <h3 className="text-3xl font-bold font-display">{formatCurrencyUsd(summary.totalSalesUsd)}</h3>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Ventas Totales (Bs)</p>
              <div className="p-2 bg-accent/10 rounded-lg text-accent"><DollarSign className="w-5 h-5" /></div>
            </div>
            <h3 className="text-3xl font-bold font-display">{formatCurrencyBs(summary.totalSalesBs).replace('VES', 'Bs')}</h3>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Utilidad Neta</p>
              <div className="p-2 bg-success/10 rounded-lg text-success"><TrendingUp className="w-5 h-5" /></div>
            </div>
            <h3 className="text-3xl font-bold font-display text-success">{formatCurrencyUsd(summary.netProfitUsd)}</h3>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Cant. Ventas</p>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><ShoppingBag className="w-5 h-5" /></div>
            </div>
            <h3 className="text-3xl font-bold font-display">{summary.salesCount}</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Ventas Diarias (USD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.dailySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                    formatter={(value: number) => [formatCurrencyUsd(value), "Ventas"]}
                  />
                  <Area type="monotone" dataKey="totalUsd" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorUsd)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top 5 Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {summary.topProducts.slice(0, 5).map((product, idx) => (
                <div key={product.productId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-sm text-muted-foreground border border-border">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm line-clamp-1">{product.productName}</p>
                      <p className="text-xs text-muted-foreground">{product.totalQuantity} vendidos</p>
                    </div>
                  </div>
                  <div className="font-semibold font-display text-primary">
                    {formatCurrencyUsd(product.totalRevenue)}
                  </div>
                </div>
              ))}
              {summary.topProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No hay ventas registradas</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
