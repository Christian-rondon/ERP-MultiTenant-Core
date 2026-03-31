import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware, requireRole, hashPassword, IMMORTAL_USER_ID, type AuthRequest } from "../lib/auth";

const router: IRouter = Router();
router.use(authMiddleware);

function formatUser(u: typeof usersTable.$inferSelect) {
  return {
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    isActive: u.isActive,
    comercioId: u.comercioId ?? null,
    createdAt: u.createdAt.toISOString(),
  };
}

// ─── DEVELOPER: full user management ───────────────────────────────────────

router.get("/", requireRole("DEVELOPER"), async (_req, res) => {
  const users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  res.json(users.map(formatUser));
});

router.post("/", requireRole("DEVELOPER"), async (req, res) => {
  const { username, name, password, role, comercioId } = req.body;

  if (!username || !name || !password || !role) {
    res.status(400).json({ error: "Todos los campos son requeridos" });
    return;
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(usersTable)
    .values({ username, name, passwordHash, role, isActive: true, comercioId: comercioId ?? null })
    .returning();

  res.status(201).json(formatUser(user));
});

router.patch("/:id", requireRole("DEVELOPER"), async (req, res) => {
  const id = parseInt(req.params.id);

  // 🛡️ IMMORTAL GUARD: primary developer account is untouchable
  if (id === IMMORTAL_USER_ID) {
    res.status(403).json({ error: "Este usuario es el Super Admin Global y no puede ser modificado." });
    return;
  }

  const { name, isActive, password, role } = req.body;
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (isActive !== undefined) updates.isActive = isActive;
  if (role !== undefined) updates.role = role;
  if (password) updates.passwordHash = await hashPassword(password);

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "Nada que actualizar" });
    return;
  }

  const [user] = await db.update(usersTable).set(updates).where(eq(usersTable.id, id)).returning();
  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  res.json(formatUser(user));
});

// ─── DUENO: manage own comercio team ───────────────────────────────────────

router.get("/team", requireRole("DUENO"), async (req: AuthRequest, res) => {
  const { comercioId } = req.user!;
  if (!comercioId) {
    res.status(400).json({ error: "Tu cuenta no está vinculada a un comercio." });
    return;
  }

  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.comercioId, comercioId));

  res.json(users.map(formatUser));
});

router.post("/team", requireRole("DUENO"), async (req: AuthRequest, res) => {
  const { comercioId } = req.user!;
  if (!comercioId) {
    res.status(400).json({ error: "Tu cuenta no está vinculada a un comercio." });
    return;
  }

  const { username, name, password, role } = req.body;
  if (!username || !name || !password || !role) {
    res.status(400).json({ error: "Todos los campos son requeridos" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(usersTable)
    .values({ username, name, passwordHash, role, isActive: true, comercioId })
    .returning();

  res.status(201).json(formatUser(user));
});

router.patch("/team/:id", requireRole("DUENO"), async (req: AuthRequest, res) => {
  const { comercioId } = req.user!;
  const id = parseInt(req.params.id);

  // Verify user belongs to this comercio
  const [target] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
  if (!target || target.comercioId !== comercioId) {
    res.status(403).json({ error: "No tienes permiso para modificar este usuario." });
    return;
  }

  const { name, isActive, password } = req.body;
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (isActive !== undefined) updates.isActive = isActive;
  if (password) updates.passwordHash = await hashPassword(password);

  const [user] = await db.update(usersTable).set(updates).where(eq(usersTable.id, id)).returning();
  res.json(formatUser(user!));
});

export default router;
