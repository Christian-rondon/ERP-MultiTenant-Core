import { db } from "@workspace/db";
import { usersTable, productsTable, bcvRateTable } from "@workspace/db/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const existing = await db.select().from(usersTable).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded. Skipping...");
    process.exit(0);
  }

  const devHash = await bcrypt.hash("dev2024!", 10);
  const duenoHash = await bcrypt.hash("dueno2024!", 10);
  const cajeraHash = await bcrypt.hash("cajera2024!", 10);

  await db.insert(usersTable).values([
    {
      username: "developer",
      name: "Super Administrador",
      passwordHash: devHash,
      role: "DEVELOPER",
      isActive: true,
    },
    {
      username: "dueno",
      name: "Dueño del Negocio",
      passwordHash: duenoHash,
      role: "DUENO",
      isActive: true,
    },
    {
      username: "cajera",
      name: "María Cajera",
      passwordHash: cajeraHash,
      role: "CAJERA",
      isActive: true,
    },
  ]);

  await db.insert(productsTable).values([
    { name: "Harina PAN 1kg", category: "Alimentos", costUsd: "0.50", priceUsd: "0.80", stock: 50, minStock: 10 },
    { name: "Aceite 1L", category: "Alimentos", costUsd: "1.20", priceUsd: "1.80", stock: 30, minStock: 5 },
    { name: "Arroz 1kg", category: "Alimentos", costUsd: "0.60", priceUsd: "0.95", stock: 40, minStock: 8 },
    { name: "Azúcar 1kg", category: "Alimentos", costUsd: "0.45", priceUsd: "0.70", stock: 25, minStock: 5 },
    { name: "Leche 1L", category: "Lácteos", costUsd: "0.80", priceUsd: "1.20", stock: 3, minStock: 10 },
    { name: "Café 250g", category: "Bebidas", costUsd: "1.50", priceUsd: "2.20", stock: 15, minStock: 5 },
    { name: "Jabón de baño", category: "Higiene", costUsd: "0.30", priceUsd: "0.55", stock: 60, minStock: 10 },
    { name: "Detergente 500g", category: "Limpieza", costUsd: "0.70", priceUsd: "1.10", stock: 20, minStock: 5 },
  ]);

  await db.insert(bcvRateTable).values({
    rate: "36.50",
    source: "MANUAL",
  });

  console.log("✅ Seed complete!");
  console.log("Accounts created:");
  console.log("  Developer: developer / dev2024!");
  console.log("  Dueño:     dueno / dueno2024!");
  console.log("  Cajera:    cajera / cajera2024!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
