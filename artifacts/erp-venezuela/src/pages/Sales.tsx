import React, { useState } from "react";
import { useSales } from "@/hooks/use-sales";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyUsd, formatCurrencyBs, formatDate } from "@/lib/utils";

export default function Sales() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  
  const { data: sales, isLoading } = useSales(from || undefined, to || undefined);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Historial de Ventas</h1>
          <p className="text-muted-foreground mt-1">Revise todas las transacciones realizadas.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-card p-2 rounded-2xl border border-border shadow-md">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground px-1">Desde</label>
            <Input type="date" value={from} onChange={e => setFrom(e.target.value)} className="h-9 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground px-1">Hasta</label>
            <Input type="date" value={to} onChange={e => setTo(e.target.value)} className="h-9 text-sm" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha y Hora</TableHead>
              <TableHead>Cajero</TableHead>
              <TableHead>Método</TableHead>
              <TableHead className="text-center">Tasa BCV</TableHead>
              <TableHead className="text-right">Total Bs</TableHead>
              <TableHead className="text-right">Total USD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Cargando...</TableCell></TableRow>
            ) : sales?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">No se encontraron ventas en este periodo</TableCell></TableRow>
            ) : (
              sales?.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{formatDate(sale.createdAt)}</TableCell>
                  <TableCell className="text-muted-foreground">{sale.cashierName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase bg-secondary/50">
                      {sale.paymentMethod.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground text-xs">
                    {formatCurrencyBs(sale.bcvRate)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground font-medium">
                    {formatCurrencyBs(sale.totalBs)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary font-display text-lg">
                    {formatCurrencyUsd(sale.totalUsd)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
