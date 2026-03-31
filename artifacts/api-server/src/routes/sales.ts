import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { salesTable, productsTable, usersTable, comerciosTable } from "@workspace/db/schema";
import { eq, and, gte, lte, sql, isNull, or } from "drizzle-orm";
import { authMiddleware, requireRole, type AuthRequest } from "../lib/auth";
import { getCurrentRate } from "../lib/bcv-scraper";

const router: IRouter = Router();
router.use(authMiddleware);

type SaleItemStored = {
  productId: number;
  productName: string;
  quantity: number;
  priceUsd: number;
  costUsd: number;
};

function formatSale(s: typeof salesTable.$inferSelect) {
  return {
    id: s.id,
    cashierId: s.cashierId,
    cashierName: s.cashierName,
    totalUsd: parseFloat(s.totalUsd),
    totalBs: parseFloat(s.totalBs),
    bcvRate: parseFloat(s.bcvRate),
    paymentMethod: s.paymentMethod,
    items: s.items as SaleItemStored[],
    comercioId: s.comercioId ?? null,
    createdAt: s.createdAt.toISOString(),
  };
}

function buildSummary(sales: typeof salesTable.$inferSelect[]) {
  const totalSalesUsd = sales.reduce((acc, s) => acc + parseFloat(s.totalUsd), 0);
  const totalSalesBs = sales.reduce((acc, s) => acc + parseFloat(s.totalBs), 0);

  let totalCostUsd = 0;
  const productTotals: Record<number, { productId: number; productName: string; totalQuantity: number; totalRevenue: number }> = {};

  for (const sale of sales) {
    const items = sale.items as SaleItemStored[];
    for (const item of items) {
      totalCostUsd += item.costUsd * item.quantity;
      if (!productTotals[item.productId]) {
        productTotals[item.productId] = { productId: item.productId, productName: item.productName, totalQuantity: 0, totalRevenue: 0 };
      }
      productTotals[item.productId].totalQuantity += item.quantity;
      productTotals[item.productId].totalRevenue += item.priceUsd * item.quantity;
    }
  }

  const topProducts = Object.values(productTotals).sort((a, b) => b.totalQuantity - a.totalQuantity).slice(0, 5);

  const dailyMap: Record<string, { totalUsd: number; totalBs: number }> = {};
  for (const sale of sales) {
    const date = sale.createdAt.toISOString().split("T")[0];
    if (!dailyMap[date]) dailyMap[date] = { totalUsd: 0, totalBs: 0 };
    dailyMap[date].totalUsd += parseFloat(sale.totalUsd);
    dailyMap[date].totalBs += parseFloat(sale.totalBs);
  }

  const dailySales = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({ date, ...vals }));

  return { totalSalesUsd, totalSalesBs, totalCostUsd, netProfitUsd: totalSalesUsd - totalCostUsd, salesCount: sales.length, topProducts, dailySales };
}

// ─── GLOBAL ANALYTICS (DEVELOPER only) ───────────────────────────────────────
router.get("/analytics/global", requireRole("DEVELOPER"), async (_req, res) => {
  const allSales = await db.select().from(salesTable).orderBy(salesTable.createdAt);
  const allComercios = await db.select().from(comerciosTable);

  // Per-comercio breakdown
  const comercioMap: Record<number, { name: string; totalUsd: number; totalBs: number; salesCount: number; netProfitUsd: number }> = {};
  for (const c of allComercios) {
    comercioMap[c.id] = { name: c.name, totalUsd: 0, totalBs: 0, salesCount: 0, netProfitUsd: 0 };
  }

  // Product intelligence across all tenants
  const productTotals: Record<number, { productName: string; totalQuantity: number; totalRevenue: number; totalCost: number }> = {};
  let globalRevenue = 0;
  let globalCost = 0;

  for (const sale of allSales) {
    const cid = sale.comercioId;
    if (cid && comercioMap[cid]) {
      comercioMap[cid].totalUsd += parseFloat(sale.totalUsd);
      comercioMap[cid].totalBs += parseFloat(sale.totalBs);
      comercioMap[cid].salesCount += 1;
    }

    globalRevenue += parseFloat(sale.totalUsd);

    const items = sale.items as SaleItemStored[];
    for (const item of items) {
      const cost = item.costUsd * item.quantity;
      globalCost += cost;
      if (cid && comercioMap[cid]) comercioMap[cid].netProfitUsd += (item.priceUsd - item.costUsd) * item.quantity;

      if (!productTotals[item.productId]) {
        productTotals[item.productId] = { productName: item.productName, totalQuantity: 0, totalRevenue: 0, totalCost: 0 };
      }
      productTotals[item.productId].totalQuantity += item.quantity;
      productTotals[item.productId].totalRevenue += item.priceUsd * item.quantity;
      productTotals[item.productId].totalCost += cost;
    }
  }

  const topItemGlobal = Object.values(productTotals).sort((a, b) => b.totalQuantity - a.totalQuantity)[0] || null;

  const comercioRanking = Object.entries(comercioMap)
    .map(([id, data]) => ({ comercioId: parseInt(id), ...data }))
    .sort((a, b) => b.totalUsd - a.totalUsd);

  res.json({
    globalRevenue,
    globalCost,
    globalNetProfit: globalRevenue - globalCost,
    totalSalesCount: allSales.length,
    topItemGlobal,
    comercioRanking,
  });
});

// ─── SUMMARY (tenant-scoped) ─────────────────────────────────────────────────
router.get("/summary", requireRole("DUENO", "DEVELOPER"), async (req: AuthRequest, res) => {
  const { from, to } = req.query as { from?: string; to?: string };
  const user = req.user!;

  const conditions: ReturnType<typeof gte>[] = [];
  if (from) conditions.push(gte(salesTable.createdAt, new Date(from)));
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    conditions.push(lte(salesTable.createdAt, toDate));
  }

  // Tenant scoping
  if (user.role !== "DEVELOPER" && user.comercioId) {
    conditions.push(eq(salesTable.comercioId, user.comercioId) as any);
  }

  const sales = await db
    .select()
    .from(salesTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(salesTable.createdAt);

  res.json(buildSummary(sales));
});

// ─── LIST (tenant-scoped) ────────────────────────────────────────────────────
router.get("/", async (req: AuthRequest, res) => {
  const { from, to } = req.query as { from?: string; to?: string };
  const user = req.user!;

  const conditions: any[] = [];
  if (from) conditions.push(gte(salesTable.createdAt, new Date(from)));
  if (to) conditions.push(lte(salesTable.createdAt, new Date(to)));
  if (user.role !== "DEVELOPER" && user.comercioId) {
    conditions.push(eq(salesTable.comercioId, user.comercioId));
  }

  const sales = await db
    .select()
    .from(salesTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(salesTable.createdAt);

  res.json(sales.map(formatSale));
});

// ─── CREATE SALE ─────────────────────────────────────────────────────────────
router.post("/", async (req: AuthRequest, res) => {
  const { paymentMethod, items } = req.body;

  if (!paymentMethod || !items || !items.length) {
    res.status(400).json({ error: "Método de pago e ítems requeridos" });
    return;
  }

  const rateInfo = await getCurrentRate();
  const rate = rateInfo.rate;
  const user = req.user!;

  const saleItems: SaleItemStored[] = [];
  let totalUsd = 0;

  for (const item of items) {
    const products = await db.select().from(productsTable).where(eq(productsTable.id, item.productId)).limit(1);
    const product = products[0];
    if (!product) {
      res.status(400).json({ error: `Producto ${item.productId} no encontrado` });
      return;
    }
    if (product.stock < item.quantity) {
      res.status(400).json({ error: `Stock insuficiente para ${product.name}` });
      return;
    }

    const priceUsd = parseFloat(product.priceUsd);
    const costUsd = parseFloat(product.costUsd);
    saleItems.push({ productId: product.id, productName: product.name, quantity: item.quantity, priceUsd, costUsd });
    totalUsd += priceUsd * item.quantity;
  }

  for (const item of saleItems) {
    await db.update(productsTable).set({ stock: sql`stock - ${item.quantity}` }).where(eq(productsTable.id, item.productId));
  }

  const totalBs = totalUsd * rate;
  const [sale] = await db
    .insert(salesTable)
    .values({
      cashierId: user.id,
      cashierName: user.name,
      totalUsd: totalUsd.toString(),
      totalBs: totalBs.toString(),
      bcvRate: rate.toString(),
      paymentMethod,
      items: saleItems,
      comercioId: user.comercioId ?? null,
    })
    .returning();

  res.status(201).json(formatSale(sale));
});

export default router;
