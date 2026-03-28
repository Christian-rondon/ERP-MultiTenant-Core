export type UserRole = "DEVELOPER" | "DUENO" | "CAJERA";

export interface User {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  costUsd: number;
  priceUsd: number;
  stock: number;
  minStock: number;
  createdAt: string;
}

export type PaymentMethod = "EFECTIVO_USD" | "PAGO_MOVIL" | "PUNTO_VENTA";

export interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  priceUsd: number;
  costUsd: number;
}

export interface Sale {
  id: number;
  cashierId: number;
  cashierName: string;
  totalUsd: number;
  totalBs: number;
  bcvRate: number;
  paymentMethod: PaymentMethod;
  items: SaleItem[];
  createdAt: string;
}

export interface BcvRate {
  rate: number;
  source: "SCRAPER" | "MANUAL";
  updatedAt: string;
}

export interface SalesSummary {
  totalSalesUsd: number;
  totalSalesBs: number;
  totalCostUsd: number;
  netProfitUsd: number;
  salesCount: number;
  topProducts: {
    productId: number;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
  }[];
  dailySales: {
    date: string;
    totalUsd: number;
    totalBs: number;
  }[];
}
