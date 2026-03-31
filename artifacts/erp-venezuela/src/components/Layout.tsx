import React from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  History, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  Activity,
  Building2,
  TrendingUp,
  Globe,
  UsersRound
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useBcvRate } from "@/hooks/use-bcv";
import { useSalesSummary } from "@/hooks/use-sales";
import { cn, formatCurrencyUsd } from "@/lib/utils";
import { Button } from "./ui/button";

const sidebarLinks = {
  DEVELOPER: [
    { href: "/analytics", label: "Analytics Global", icon: Globe },
    { href: "/comercios", label: "Comercios", icon: Building2 },
    { href: "/users", label: "Usuarios", icon: Users },
    { href: "/settings", label: "Tasa BCV", icon: Settings },
  ],
  DUENO: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/inventory", label: "Inventario", icon: Package },
    { href: "/sales", label: "Historial de Ventas", icon: History },
    { href: "/reports", label: "Reportes PDF", icon: FileText },
    { href: "/team", label: "Mi Equipo", icon: UsersRound },
  ],
  CAJERA: [
    { href: "/pos", label: "Punto de Venta", icon: ShoppingCart },
    { href: "/inventory", label: "Consulta de Stock", icon: Package },
  ]
};

function DailyTicker() {
  const today = new Date().toISOString().split("T")[0];
  const { data: summary } = useSalesSummary(today, today);
  if (!summary) return null;
  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
      <TrendingUp className="w-3.5 h-3.5" />
      <span>Hoy: {formatCurrencyUsd(summary.totalSalesUsd)}</span>
      <span className="w-px h-3 bg-primary/30" />
      <span>{summary.salesCount} venta{summary.salesCount !== 1 ? "s" : ""}</span>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const { data: bcvRate } = useBcvRate();

  if (!user) return null;

  const links = sidebarLinks[user.role] || [];

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-3 text-primary">
          <Activity className="w-8 h-8" />
          <span className="font-display font-bold text-2xl tracking-tight text-white">ERP Vzla</span>
        </div>
      </div>
      <div className="px-4 py-2 flex flex-col gap-2 flex-1">
        <div className="mb-6 px-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Usuario</p>
          <p className="font-medium text-foreground">{user.name}</p>
          <p className="text-xs text-primary">{user.role}</p>
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href} onClick={() => setIsMobileOpen(false)} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              isActive 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}>
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="p-4 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-card border-r border-border h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
      
      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out md:hidden",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        <header className="h-20 glass sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-foreground p-2" onClick={() => setIsMobileOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-semibold hidden sm:block">
              {links.find(l => l.href === location)?.label || "ERP"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {user.role === "DUENO" && <DailyTicker />}
            <div className="px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center gap-2 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="font-semibold tracking-wide text-sm">
                BCV: {bcvRate ? `${Number(bcvRate.rate).toFixed(2)} Bs` : '...'}
              </span>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
