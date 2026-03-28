import { pgTable, serial, integer, numeric, text, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const paymentMethodEnum = pgEnum("payment_method", ["EFECTIVO_USD", "PAGO_MOVIL", "PUNTO_VENTA"]);

export const salesTable = pgTable("sales", {
  id: serial("id").primaryKey(),
  cashierId: integer("cashier_id").notNull().references(() => usersTable.id),
  cashierName: text("cashier_name").notNull(),
  totalUsd: numeric("total_usd", { precision: 12, scale: 4 }).notNull(),
  totalBs: numeric("total_bs", { precision: 16, scale: 4 }).notNull(),
  bcvRate: numeric("bcv_rate", { precision: 12, scale: 4 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  items: jsonb("items").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSaleSchema = createInsertSchema(salesTable).omit({ id: true, createdAt: true });
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Sale = typeof salesTable.$inferSelect;
