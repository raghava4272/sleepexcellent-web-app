export const catalogueCategories = ["SOFA", "BED", "MATTRESS", "CEILING"] as const;

export type CatalogueCategory = (typeof catalogueCategories)[number];
export type CatalogueSort = "featured" | "price-asc" | "price-desc" | "name-asc";

export type CatalogueProduct = {
  slug: string;
  category: CatalogueCategory;
  name: string;
  configuration: string | null;
  size: string | null;
  suitability: string | null;
  fixedPriceMinor: number | null;
  indicativeMinMinor: number | null;
  indicativeMaxMinor: number | null;
  indicativeMaxOpenEnded: boolean;
  publicationState: "PUBLISHED" | "UNPUBLISHED";
  availability: "IN_STOCK" | "OUT_OF_STOCK" | null;
};

export const categoryLabels: Record<CatalogueCategory, string> = {
  SOFA: "Sofas",
  BED: "Beds",
  MATTRESS: "Mattresses",
  CEILING: "Ceiling Solutions",
};

export function isCatalogueCategory(value: string | undefined): value is CatalogueCategory {
  return catalogueCategories.includes(value as CatalogueCategory);
}

export function isCatalogueSort(value: string | undefined): value is CatalogueSort {
  return ["featured", "price-asc", "price-desc", "name-asc"].includes(value ?? "");
}
