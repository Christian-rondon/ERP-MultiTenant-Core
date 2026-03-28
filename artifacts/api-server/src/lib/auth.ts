import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable, comerciosTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.SESSION_SECRET || "erp-venezuela-secret-key";

export function generateToken(userId: number, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: number; role: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface AuthRequest extends Request {
  user?: { id: number; role: string; name: string; username: string; comercioId?: number | null };
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  const token = authHeader.substring(7);
  try {
    const payload = verifyToken(token);
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, payload.userId))
      .limit(1);

    if (!users.length || !users[0].isActive) {
      res.status(401).json({ error: "Usuario inactivo o no encontrado" });
      return;
    }

    const user = users[0];

    // Cascade block: if user is linked to a comercio, verify it's still active
    if (user.comercioId) {
      const comercios = await db
        .select()
        .from(comerciosTable)
        .where(eq(comerciosTable.id, user.comercioId))
        .limit(1);

      if (!comercios.length || !comercios[0].isActive) {
        res.status(401).json({ error: "COMERCIO_SUSPENDIDO: Acceso bloqueado. Contacte al administrador." });
        return;
      }
    }

    req.user = {
      id: user.id,
      role: user.role,
      name: user.name,
      username: user.username,
      comercioId: user.comercioId,
    };
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }
    next();
  };
}
