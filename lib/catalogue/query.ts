import type { CatalogueCategory, CatalogueSort } from "./types";
import { isCatalogueCategory, isCatalogueSort } from "./types";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseCatalogueQuery(searchParams: SearchParams) {
  const categoryValue = first(searchParams.category);
  const sortValue = first(searchParams.sort);
  const searchValue = first(searchParams.q)?.trim().replace(/\s+/g, " ");
  const category: CatalogueCategory | undefined = isCatalogueCategory(categoryValue) ? categoryValue : undefined;
  const sort: CatalogueSort = isCatalogueSort(sortValue) ? sortValue : "featured";

  return {
    category,
    sort,
    search: searchValue && searchValue.slice(0, 80),
  };
}
