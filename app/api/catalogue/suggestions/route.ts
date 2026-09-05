import { NextResponse } from "next/server";
import { parseCatalogueQuery } from "@/lib/catalogue/query";
import { readPersistedCatalogueSuggestions } from "@/lib/catalogue/repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const query = parseCatalogueQuery({ q: new URL(request.url).searchParams.get("q") ?? undefined });
  if (!query.search) return NextResponse.json({ suggestions: [] });

  const catalogue = await readPersistedCatalogueSuggestions(query.search);
  if (catalogue.error) {
    return NextResponse.json({ error: "Catalogue suggestions are unavailable." }, { status: 503 });
  }

  return NextResponse.json({
    suggestions: catalogue.products.slice(0, 6).map((product) => ({
      slug: product.slug,
      name: product.name,
      category: product.category,
    })),
  });
}
