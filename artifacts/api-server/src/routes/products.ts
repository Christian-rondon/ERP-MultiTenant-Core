import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db/schema";
import { eq, or, isNull } from "drizzle-orm";
import { authMiddleware, requireRole, type AuthRequest } from "../lib/auth";

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
    comercioId: p.comercioId ?? null,
    createdAt: p.createdAt.toISOString(),
  };
}

// Tenant-scoped or global depending on role
router.get("/", async (req: AuthRequest, res) => {
  const user = req.user!;
  let products;

  if (user.role === "DEVELOPER") {
    // Global: see all products
    products = await db.select().from(productsTable).orderBy(productsTable.name);
  } else if (user.comercioId) {
    // Tenant: only products belonging to this comercio or global (null) products
    products = await db
      .select()
      .from(productsTable)
      .where(or(eq(productsTable.comercioId, user.comercioId), isNull(productsTable.comercioId)))
      .orderBy(productsTable.name);
  } else {
    // No tenant assigned: show global products only
    products = await db
      .select()
      .from(productsTable)
      .where(isNull(productsTable.comercioId))
      .orderBy(productsTable.name);
  }

  res.json(products.map(formatProduct));
});

router.post("/", requireRole("DUENO", "DEVELOPER"), async (req: AuthRequest, res) => {
  const user = req.user!;
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
      comercioId: user.role === "DEVELOPER" ? null : (user.comercioId ?? null),
    })
    .returning();

  res.status(201).json(formatProduct(product));
});

router.put("/:id", requireRole("DUENO", "DEVELOPER"), async (req: AuthRequest, res) => {
  const user = req.user!;
  const id = parseInt(req.params.id);

  // Tenant guard: DUENO can only edit own products
  if (user.role === "DUENO" && user.comercioId) {
    const [existing] = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
    if (existing && existing.comercioId !== user.comercioId) {
      res.status(403).json({ error: "No puedes editar productos de otro comercio." });
      return;
    }
  }

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

router.delete("/:id", requireRole("DUENO", "DEVELOPER"), async (req: AuthRequest, res) => {
  const user = req.user!;
  const id = parseInt(req.params.id);

  if (user.role === "DUENO" && user.comercioId) {
    const [existing] = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
    if (existing && existing.comercioId !== user.comercioId) {
      res.status(403).json({ error: "No puedes eliminar productos de otro comercio." });
      return;
    }
  }

  const [product] = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();
  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  res.json({ success: true, message: "Producto eliminado" });
});

export default router;
