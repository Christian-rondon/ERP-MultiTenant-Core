import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bcvRateTable } from "@workspace/db/schema";
import { authMiddleware, requireRole } from "../lib/auth";
import { getCurrentRate, invalidateRateCache } from "../lib/bcv-scraper";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/rate", async (_req, res) => {
  const rateInfo = await getCurrentRate();
  res.json({
    rate: rateInfo.rate,
    source: rateInfo.source,
    updatedAt: rateInfo.updatedAt.toISOString(),
  });
});

router.post("/rate", authMiddleware, requireRole("DEVELOPER"), async (req, res) => {
  const { rate } = req.body;
  if (!rate || isNaN(parseFloat(rate))) {
    res.status(400).json({ error: "Tasa inválida" });
    return;
  }

  const [updated] = await db
    .insert(bcvRateTable)
    .values({ rate: parseFloat(rate).toString(), source: "MANUAL" })
    .returning();

  invalidateRateCache();

  res.json({
    rate: parseFloat(updated.rate),
    source: updated.source,
    updatedAt: updated.updatedAt.toISOString(),
  });
});

export default router;
