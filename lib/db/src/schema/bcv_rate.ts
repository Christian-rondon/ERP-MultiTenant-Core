import { pgTable, serial, numeric, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rateSourceEnum = pgEnum("rate_source", ["SCRAPER", "MANUAL"]);

export const bcvRateTable = pgTable("bcv_rate", {
  id: serial("id").primaryKey(),
  rate: numeric("rate", { precision: 12, scale: 4 }).notNull(),
  source: rateSourceEnum("source").notNull().default("SCRAPER"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBcvRateSchema = createInsertSchema(bcvRateTable).omit({ id: true, updatedAt: true });
export type InsertBcvRate = z.infer<typeof insertBcvRateSchema>;
export type BcvRate = typeof bcvRateTable.$inferSelect;
