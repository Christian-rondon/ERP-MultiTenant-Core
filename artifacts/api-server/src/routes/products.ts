import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware, requireRole } from "../lib/auth";

const router: IRouter = Router();

router.use(authMiddleware);

function formatProduct(p: typeof productsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    costUsd: parseFloat(p.costUsd),
    priceUsd: parseFloat(p.priceUsd),
    stock: p.stock,
    minStock: p.minStock,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/", async (_req, res) => {
  const products = await db.select().from(productsTable).orderBy(productsTable.name);
  res.json(products.map(formatProduct));
});

router.post("/", requireRole("DUENO", "DEVELOPER"), async (req, res) => {
  const { name, category, costUsd, priceUsd, stock, minStock } = req.body;

  if (!name || !category || costUsd === undefined || priceUsd === undefined) {
    res.status(400).json({ error: "Campos requeridos: nombre, categoría, costo, precio" });
    return;
  }

  const [product] = await db
    .insert(productsTable)
    .values({
      name,
      category,
      costUsd: costUsd.toString(),
      priceUsd: priceUsd.toString(),
      stock: stock ?? 0,
      minStock: minStock ?? 5,
    })
    .returning();

  res.status(201).json(formatProduct(product));
});

router.put("/:id", requireRole("DUENO", "DEVELOPER"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, category, costUsd, priceUsd, stock, minStock } = req.body;

  const [product] = await db
    .update(productsTable)
    .set({
      name,
      category,
      costUsd: costUsd?.toString(),
      priceUsd: priceUsd?.toString(),
      stock,
      minStock,
    })
    .where(eq(productsTable.id, id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  res.json(formatProduct(product));
});

router.delete("/:id", requireRole("DUENO", "DEVELOPER"), async (req, res) => {
  const id = parseInt(req.params.id);

  const [product] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  res.json({ success: true, message: "Producto eliminado" });
});

export default router;
