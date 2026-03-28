import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { comerciosTable, usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware, requireRole, hashPassword } from "../lib/auth";

const router: IRouter = Router();

router.use(authMiddleware);
router.use(requireRole("DEVELOPER"));

function formatComercio(c: typeof comerciosTable.$inferSelect) {
  return {
    id: c.id,
    name: c.name,
    ownerName: c.ownerName,
    uniqueCode: c.uniqueCode,
    isActive: c.isActive,
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/", async (_req, res) => {
  const comercios = await db.select().from(comerciosTable).orderBy(comerciosTable.createdAt);
  res.json(comercios.map(formatComercio));
});

router.post("/", async (req, res) => {
  const { name, ownerName, uniqueCode, ownerUsername, ownerPassword } = req.body;

  if (!name || !ownerName || !uniqueCode || !ownerUsername || !ownerPassword) {
    res.status(400).json({ error: "Todos los campos son requeridos" });
    return;
  }

  const existing = await db.select().from(comerciosTable).where(eq(comerciosTable.uniqueCode, uniqueCode)).limit(1);
  if (existing.length) {
    res.status(400).json({ error: "El código único ya está en uso" });
    return;
  }

  const [comercio] = await db.insert(comerciosTable).values({ name, ownerName, uniqueCode, isActive: true }).returning();

  const passwordHash = await hashPassword(ownerPassword);
  await db.insert(usersTable).values({
    username: ownerUsername,
    name: ownerName,
    passwordHash,
    role: "DUENO",
    isActive: true,
    comercioId: comercio.id,
  });

  res.status(201).json(formatComercio(comercio));
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { isActive, name } = req.body;

  const updates: Record<string, unknown> = {};
  if (isActive !== undefined) updates.isActive = isActive;
  if (name !== undefined) updates.name = name;

  const [comercio] = await db.update(comerciosTable).set(updates).where(eq(comerciosTable.id, id)).returning();
  if (!comercio) {
    res.status(404).json({ error: "Comercio no encontrado" });
    return;
  }

  res.json(formatComercio(comercio));
});

router.post("/:id/users", async (req, res) => {
  const comercioId = parseInt(req.params.id);
  const { username, name, password, role } = req.body;

  if (!username || !name || !password || !role) {
    res.status(400).json({ error: "Todos los campos son requeridos" });
    return;
  }

  if (!["DUENO", "CAJERA"].includes(role)) {
    res.status(400).json({ error: "Rol inválido. Use DUENO o CAJERA" });
    return;
  }

  const comercios = await db.select().from(comerciosTable).where(eq(comerciosTable.id, comercioId)).limit(1);
  if (!comercios.length) {
    res.status(404).json({ error: "Comercio no encontrado" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db.insert(usersTable).values({
    username, name, passwordHash, role, isActive: true, comercioId,
  }).returning();

  res.status(201).json({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    comercioId: user.comercioId,
    createdAt: user.createdAt.toISOString(),
  });
});

router.get("/:id/users", async (req, res) => {
  const comercioId = parseInt(req.params.id);
  const users = await db.select().from(usersTable).where(eq(usersTable.comercioId, comercioId));
  res.json(users.map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    isActive: u.isActive,
    comercioId: u.comercioId,
    createdAt: u.createdAt.toISOString(),
  })));
});

export default router;
