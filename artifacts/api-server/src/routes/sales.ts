import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { salesTable, productsTable } from "@workspace/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
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
    createdAt: s.createdAt.toISOString(),
  };
}

router.get("/summary", requireRole("DUENO", "DEVELOPER"), async (req, res) => {
  const { from, to } = req.query as { from?: string; to?: string };

  const conditions = [];
  if (from) conditions.push(gte(salesTable.createdAt, new Date(from)));
  if (to) conditions.push(lte(salesTable.createdAt, new Date(to)));

  const sales = await db
    .select()
    .from(salesTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(salesTable.createdAt);

  const totalSalesUsd = sales.reduce((acc, s) => acc + parseFloat(s.totalUsd), 0);
  const totalSalesBs = sales.reduce((acc, s) => acc + parseFloat(s.totalBs), 0);

  let totalCostUsd = 0;
  const productTotals: Record<
    number,
    { productId: number; productName: string; totalQuantity: number; totalRevenue: number }
  > = {};

  for (const sale of sales) {
    const items = sale.items as SaleItemStored[];
    for (const item of items) {
      totalCostUsd += item.costUsd * item.quantity;
      if (!productTotals[item.productId]) {
        productTotals[item.productId] = {
          productId: item.productId,
          productName: item.productName,
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }
      productTotals[item.productId].totalQuantity += item.quantity;
      productTotals[item.productId].totalRevenue += item.priceUsd * item.quantity;
    }
  }

  const topProducts = Object.values(productTotals)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);

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

  res.json({
    totalSalesUsd,
    totalSalesBs,
    totalCostUsd,
    netProfitUsd: totalSalesUsd - totalCostUsd,
    salesCount: sales.length,
    topProducts,
    dailySales,
  });
});

router.get("/", async (req, res) => {
  const { from, to } = req.query as { from?: string; to?: string };

  const conditions = [];
  if (from) conditions.push(gte(salesTable.createdAt, new Date(from)));
  if (to) conditions.push(lte(salesTable.createdAt, new Date(to)));

  const sales = await db
    .select()
    .from(salesTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(salesTable.createdAt);

  res.json(sales.map(formatSale));
});

router.post("/", async (req: AuthRequest, res) => {
  const { paymentMethod, items } = req.body;

  if (!paymentMethod || !items || !items.length) {
    res.status(400).json({ error: "Método de pago e ítems requeridos" });
    return;
  }

  const rateInfo = await getCurrentRate();
  const rate = rateInfo.rate;

  const saleItems: SaleItemStored[] = [];
  let totalUsd = 0;

  for (const item of items) {
    const products = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, item.productId))
      .limit(1);

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

    saleItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      priceUsd,
      costUsd,
    });
    totalUsd += priceUsd * item.quantity;
  }

  for (const item of saleItems) {
    await db
      .update(productsTable)
      .set({ stock: sql`stock - ${item.quantity}` })
      .where(eq(productsTable.id, item.productId));
  }

  const totalBs = totalUsd * rate;

  const [sale] = await db
    .insert(salesTable)
    .values({
      cashierId: req.user!.id,
      cashierName: req.user!.name,
      totalUsd: totalUsd.toString(),
      totalBs: totalBs.toString(),
      bcvRate: rate.toString(),
      paymentMethod,
      items: saleItems,
    })
    .returning();

  res.status(201).json(formatSale(sale));
});

export default router;
