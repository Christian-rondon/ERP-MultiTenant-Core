import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const comerciosTable = pgTable("comercios", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ownerName: text("owner_name").notNull(),
  uniqueCode: text("unique_code").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertComercioSchema = createInsertSchema(comerciosTable).omit({ id: true, createdAt: true });
export type InsertComercio = z.infer<typeof insertComercioSchema>;
export type Comercio = typeof comerciosTable.$inferSelect;
