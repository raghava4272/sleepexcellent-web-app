import "server-only";
import { and, asc, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { publishedCatalogueSeed } from "./data";
import type { CatalogueCategory, CatalogueProduct, CatalogueSort } from "./types";

export type CatalogueQuery = {
  category?: CatalogueCategory;
  search?: string;
  sort: CatalogueSort;
};

export type CatalogueRead = {
  products: CatalogueProduct[];
  source: "database" | "seed";
  error: boolean;
};

export type CatalogueProductRead = {
  product: CatalogueProduct | null;
  source: "database" | "seed";
  error: boolean;
};

function sortProducts(items: CatalogueProduct[], sort: CatalogueSort) {
  const value = (product: CatalogueProduct) => product.fixedPriceMinor ?? product.indicativeMinMinor ?? 0;
  return [...items].sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "price-asc") return value(a) - value(b) || a.name.localeCompare(b.name);
    if (sort === "price-desc") return value(b) - value(a) || a.name.localeCompare(b.name);
    return 0;
  });
}

function filterSeed(query: CatalogueQuery) {
  const search = query.search?.trim().toLocaleLowerCase();
  return sortProducts(
    publishedCatalogueSeed.filter((product) =>
      (!query.category || product.category === query.category) &&
      (!search || product.name.toLocaleLowerCase().includes(search)),
    ),
    query.sort,
  );
}

function toCatalogueProduct(product: typeof products.$inferSelect): CatalogueProduct {
  return {
    slug: product.slug,
    category: product.category,
    name: product.name,
    configuration: product.configuration,
    size: product.size,
    suitability: product.suitability,
    fixedPriceMinor: product.fixedPriceMinor,
    indicativeMinMinor: product.indicativeMinMinor,
    indicativeMaxMinor: product.indicativeMaxMinor,
    indicativeMaxOpenEnded: product.indicativeMaxOpenEnded,
    publicationState: product.publicationState,
    availability: product.availability,
  };
}

export async function readCatalogue(query: CatalogueQuery): Promise<CatalogueRead> {
  const db = getDb();
  if (!db) return { products: filterSeed(query), source: "seed", error: false };

  const predicates = [eq(products.publicationState, "PUBLISHED")];
  if (query.category) predicates.push(eq(products.category, query.category));
  if (query.search) predicates.push(ilike(products.name, `%${query.search}%`));

  const price = sql<number>`coalesce(${products.fixedPriceMinor}, ${products.indicativeMinMinor})`;
  const order = query.sort === "price-asc"
    ? [asc(price), asc(products.name)]
    : query.sort === "price-desc"
      ? [desc(price), asc(products.name)]
      : query.sort === "name-asc"
        ? [asc(products.name)]
        : [asc(products.createdAt)];

  try {
    const rows = await db.select().from(products).where(and(...predicates)).orderBy(...order);
    return {
      source: "database",
      error: false,
      products: rows.map(toCatalogueProduct),
    };
  } catch {
    return { products: [], source: "database", error: true };
  }
}

export async function readPersistedCatalogueSuggestions(search: string): Promise<CatalogueRead> {
  const db = getDb();
  if (!db) return { products: [], source: "database", error: true };

  try {
    const rows = await db
      .select()
      .from(products)
      .where(and(eq(products.publicationState, "PUBLISHED"), ilike(products.name, `%${search}%`)))
      .orderBy(asc(products.name))
      .limit(6);
    return { products: rows.map(toCatalogueProduct), source: "database", error: false };
  } catch {
    return { products: [], source: "database", error: true };
  }
}

export async function readCartProducts(slugs: string[]): Promise<CatalogueRead> {
  const uniqueSlugs = [...new Set(slugs)].slice(0, 40);
  if (!uniqueSlugs.length) return { products: [], source: "database", error: false };

  const db = getDb();
  if (!db) {
    return {
      products: publishedCatalogueSeed.filter((product) =>
        uniqueSlugs.includes(product.slug) && product.category !== "CEILING",
      ),
      source: "seed",
      error: false,
    };
  }

  try {
    const rows = await db
      .select()
      .from(products)
      .where(and(
        eq(products.publicationState, "PUBLISHED"),
        inArray(products.slug, uniqueSlugs),
        inArray(products.category, ["SOFA", "BED", "MATTRESS"]),
      ));
    return { products: rows.map(toCatalogueProduct), source: "database", error: false };
  } catch {
    return { products: [], source: "database", error: true };
  }
}

export async function readCatalogueProduct(slug: string): Promise<CatalogueProductRead> {
  const db = getDb();
  if (!db) {
    return {
      product: publishedCatalogueSeed.find((product) => product.slug === slug) ?? null,
      source: "seed",
      error: false,
    };
  }

  try {
    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, slug), eq(products.publicationState, "PUBLISHED")))
      .limit(1);

    return { product: product ? toCatalogueProduct(product) : null, source: "database", error: false };
  } catch {
    return { product: null, source: "database", error: true };
  }
}
