import React, { useState } from "react";
import { useSalesSummary } from "@/hooks/use-sales";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyUsd, formatCurrencyBs } from "@/lib/utils";
import { FileDown, Printer } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Reports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  
  const { data: summary, isLoading } = useSalesSummary(from || undefined, to || undefined);

  const generatePDF = () => {
    if (!summary) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 60, 150);
    doc.text("ERP Venezuela", 14, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("Reporte de Ventas", 14, 30);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Periodo: ${from || 'Inicio'} al ${to || 'Hoy'}`, 14, 38);
    
    // Summary Cards
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(14, 45, 85, 25, 3, 3, "F");
    doc.roundedRect(105, 45, 90, 25, 3, 3, "F");
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Ventas Totales (USD)", 20, 53);
    doc.text("Utilidad Neta (USD)", 111, 53);
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 60, 150);
    doc.text(formatCurrencyUsd(summary.totalSalesUsd), 20, 63);
    doc.setTextColor(34, 197, 94);
    doc.text(formatCurrencyUsd(summary.netProfitUsd), 111, 63);

    // Totals detail
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    doc.text(`Total en Bolívares: ${formatCurrencyBs(summary.totalSalesBs)}`, 14, 80);
    doc.text(`Costo Total: ${formatCurrencyUsd(summary.totalCostUsd)}`, 14, 86);
    doc.text(`Cantidad de Ventas: ${summary.salesCount}`, 14, 92);

    // Top Products Table
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Top Productos Más Vendidos", 14, 105);

    const tableData = summary.topProducts.map((p, index) => [
      index + 1,
      p.productName,
      p.totalQuantity.toString(),
      formatCurrencyUsd(p.totalRevenue)
    ]);

    (doc as any).autoTable({
      startY: 110,
      head: [['#', 'Producto', 'Cantidad Vendida', 'Ingreso Generado']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [30, 60, 150] },
      styles: { font: 'helvetica', fontSize: 10 },
    });

    doc.save(`Reporte_Ventas_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold">Reportes y Exportación</h1>
        <p className="text-muted-foreground mt-1">Genere reportes financieros en formato PDF.</p>
      </div>
      
      <Card className="bg-card">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-border rounded-2xl bg-background/50">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Fecha de Inicio</label>
              <Input type="date" value={from} onChange={e => setFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Fecha de Fin</label>
              <Input type="date" value={to} onChange={e => setTo(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              size="lg" 
              className="px-8 h-14 rounded-2xl text-lg font-bold gap-3"
              disabled={isLoading || !summary}
              onClick={generatePDF}
            >
              <FileDown className="w-6 h-6" />
              Generar Reporte PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {summary && (
        <div className="grid grid-cols-2 gap-4 opacity-70">
          <Card className="border-dashed bg-transparent shadow-none">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Previsualización Ventas USD</p>
              <p className="text-2xl font-bold font-display">{formatCurrencyUsd(summary.totalSalesUsd)}</p>
            </CardContent>
          </Card>
          <Card className="border-dashed bg-transparent shadow-none">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Previsualización Utilidad</p>
              <p className="text-2xl font-bold font-display text-success">{formatCurrencyUsd(summary.netProfitUsd)}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
