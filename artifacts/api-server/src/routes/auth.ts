import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware, comparePassword, generateToken, type AuthRequest } from "../lib/auth";

const router: IRouter = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Usuario y contraseña requeridos" });
    return;
  }

  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  const user = users[0];

  if (!user) {
    res.status(401).json({ error: "Credenciales inválidas" });
    return;
  }

  if (!user.isActive) {
    res.status(401).json({ error: "Cuenta desactivada. Contacte al administrador." });
    return;
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Credenciales inválidas" });
    return;
  }

  const token = generateToken(user.id, user.role);

  res.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      comercioId: user.comercioId ?? null,
      createdAt: user.createdAt.toISOString(),
    },
    token,
  });
});

router.post("/logout", (_req, res) => {
  res.json({ success: true, message: "Sesión cerrada" });
});

router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  const user = req.user!;
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, user.id))
    .limit(1);

  const dbUser = users[0];
  if (!dbUser) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  res.json({
    id: dbUser.id,
    username: dbUser.username,
    name: dbUser.name,
    role: dbUser.role,
    isActive: dbUser.isActive,
    comercioId: dbUser.comercioId ?? null,
    createdAt: dbUser.createdAt.toISOString(),
  });
});

export default router;
