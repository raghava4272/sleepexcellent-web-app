import { closeDb, getDb } from "../db/connection";
import { products } from "../db/schema";
import { catalogueSeed } from "../lib/catalogue/data";

async function seedCatalogue() {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is required to seed the Supabase PostgreSQL catalogue.");

  for (const product of catalogueSeed) {
    await db
      .insert(products)
      .values({ ...product, publicationState: "PUBLISHED", availability: null })
      .onConflictDoUpdate({
        target: products.slug,
        set: { ...product, publicationState: "PUBLISHED", availability: null, updatedAt: new Date() },
      });
  }

  console.log(`Seeded ${catalogueSeed.length} authoritative SleepExcellent catalogue records.`);
}

seedCatalogue()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Catalogue seed failed.");
    process.exitCode = 1;
  })
  .finally(closeDb);
