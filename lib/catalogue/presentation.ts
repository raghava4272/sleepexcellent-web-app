import type { CatalogueProduct } from "./types";

export function formatInr(minor: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(minor / 100);
}

export function productPrice(product: CatalogueProduct) {
  if (product.category !== "CEILING") return formatInr(product.fixedPriceMinor ?? 0);

  const maximum = `${formatInr(product.indicativeMaxMinor ?? 0)}${product.indicativeMaxOpenEnded ? "+" : ""}`;
  return `${formatInr(product.indicativeMinMinor ?? 0)} – ${maximum} / sq. ft.`;
}
