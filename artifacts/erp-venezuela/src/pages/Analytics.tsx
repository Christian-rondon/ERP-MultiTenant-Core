import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyUsd } from "@/lib/utils";
import { Globe, TrendingUp, Package, Building2, Trophy } from "lucide-react";

interface GlobalAnalytics {
  globalRevenue: number;
  globalCost: number;
  globalNetProfit: number;
  totalSalesCount: number;
  topItemGlobal: {
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
    totalCost: number;
  } | null;
  comercioRanking: {
    comercioId: number;
    name: string;
    totalUsd: number;
    totalBs: number;
    salesCount: number;
    netProfitUsd: number;
  }[];
}

function useGlobalAnalytics() {
  return useQuery<GlobalAnalytics>({
    queryKey: ["analytics", "global"],
    queryFn: () => fetchWithAuth<GlobalAnalytics>("/sales/analytics/global"),
    refetchInterval: 30000,
  });
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Analytics() {
  const { data, isLoading } = useGlobalAnalytics();

  if (isLoading || !data) {
    return <div className="text-center p-12 text-muted-foreground">Cargando inteligencia de red...</div>;
  }

  const margin = data.globalRevenue > 0
    ? ((data.globalNetProfit / data.globalRevenue) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/20 rounded-xl">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold">Inteligencia Global de Red</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Visión consolidada de todos los comercios en tiempo real.</p>
        </div>
      </div>

      {/* KPIs globales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Facturación Total Red</p>
            <p className="text-2xl font-display font-bold text-primary">{formatCurrencyUsd(data.globalRevenue)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-success/5 border-success/20">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Utilidad Neta Global</p>
            <p className="text-2xl font-display font-bold text-success">{formatCurrencyUsd(data.globalNetProfit)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Margen Neto</p>
            <p className="text-2xl font-display font-bold text-accent">{margin}%</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-blue-500/5 border-blue-500/20">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ventas Totales Red</p>
            <p className="text-2xl font-display font-bold text-blue-400">{data.totalSalesCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Item Global */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5 text-primary" />
              Ítem Más Vendido de la Red
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topItemGlobal ? (
              <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                <div className="text-4xl">🏆</div>
                <div className="flex-1">
                  <p className="font-display font-bold text-xl">{data.topItemGlobal.productName}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-semibold text-foreground">{data.topItemGlobal.totalQuantity}</span> unidades vendidas
                  </p>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Ingreso</p>
                      <p className="font-bold text-primary text-sm">{formatCurrencyUsd(data.topItemGlobal.totalRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Margen</p>
                      <p className="font-bold text-success text-sm">
                        {formatCurrencyUsd(data.topItemGlobal.totalRevenue - data.topItemGlobal.totalCost)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Sin datos de ventas aún.</p>
            )}
          </CardContent>
        </Card>

        {/* Ranking de Comercios */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="w-5 h-5 text-primary" />
              Ranking por Facturación
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.comercioRanking.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No hay comercios con ventas aún.</p>
            ) : (
              <div className="space-y-3">
                {data.comercioRanking.slice(0, 8).map((c, idx) => (
                  <div key={c.comercioId} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                    <span className="text-xl w-8 text-center flex-shrink-0">
                      {MEDALS[idx] ?? `#${idx + 1}`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.salesCount} ventas</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display font-bold text-primary text-sm">{formatCurrencyUsd(c.totalUsd)}</p>
                      <p className="text-xs text-success">+{formatCurrencyUsd(c.netProfitUsd)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
