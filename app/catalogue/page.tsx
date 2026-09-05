import type { Metadata } from "next";
import { CataloguePage } from "@/components/catalogue-page";
import { parseCatalogueQuery } from "@/lib/catalogue/query";
import { readCatalogue } from "@/lib/catalogue/repository";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Browse the supplied SleepExcellent mattress, sofa, bed, and ceiling collections.",
};

export const dynamic = "force-dynamic";

export default async function CatalogueRoute({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = parseCatalogueQuery(await searchParams);
  const catalogue = await readCatalogue(query);
  return <CataloguePage {...catalogue} activeCategory={query.category} activeSearch={query.search} activeSort={query.sort} />;
}
