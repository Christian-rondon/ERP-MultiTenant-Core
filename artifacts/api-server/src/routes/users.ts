import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware, requireRole, hashPassword, type AuthRequest } from "../lib/auth";

const router: IRouter = Router();

router.use(authMiddleware);
router.use(requireRole("DEVELOPER"));

router.get("/", async (_req, res) => {
  const users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  res.json(
    users.map((u) => ({
      id: u.id,
      username: u.username,
      name: u.name,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt.toISOString(),
    }))
  );
});

router.post("/", async (req, res) => {
  const { username, name, password, role } = req.body;

  if (!username || !name || !password || !role) {
    res.status(400).json({ error: "Todos los campos son requeridos" });
    return;
  }

  if (!["DEVELOPER", "DUENO", "CAJERA"].includes(role)) {
    res.status(400).json({ error: "Rol inválido" });
    return;
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(usersTable)
    .values({ username, name, passwordHash, role, isActive: true })
    .returning();

  res.status(201).json({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
  });
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, isActive, password } = req.body;

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (isActive !== undefined) updates.isActive = isActive;
  if (password) updates.passwordHash = await hashPassword(password);

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "Nada que actualizar" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
  });
});

export default router;
