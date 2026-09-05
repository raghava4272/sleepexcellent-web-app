import type { CatalogueCategory } from "@/lib/catalogue/types";
import type { CheckoutLineInput } from "./contracts";

export type AuthoritativeCheckoutProduct = {
  id: string;
  slug: string;
  name: string;
  category: CatalogueCategory;
  configuration: string | null;
  size: string | null;
  fixedPriceMinor: number | null;
};

export type CheckoutQuoteLine = AuthoritativeCheckoutProduct & {
  quantity: number;
  lineTotalMinor: number;
};

export type CheckoutQuote = {
  currency: "INR";
  lines: CheckoutQuoteLine[];
  subtotalMinor: number;
  shippingMinor: number;
  totalMinor: number;
};

export function calculateCheckoutQuote(
  requested: CheckoutLineInput[],
  products: AuthoritativeCheckoutProduct[],
  shippingMinor: number,
): CheckoutQuote {
  if (!Number.isSafeInteger(shippingMinor) || shippingMinor < 0) throw new Error("INVALID_SHIPPING_CONFIGURATION");
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const lines = requested.map((request) => {
    const product = bySlug.get(request.slug);
    if (!product || product.category === "CEILING" || !product.fixedPriceMinor || product.fixedPriceMinor < 1) {
      throw new Error("INELIGIBLE_PRODUCT");
    }
    const lineTotalMinor = product.fixedPriceMinor * request.quantity;
    if (!Number.isSafeInteger(lineTotalMinor)) throw new Error("INVALID_TOTAL");
    return { ...product, quantity: request.quantity, lineTotalMinor };
  });
  const subtotalMinor = lines.reduce((total, line) => total + line.lineTotalMinor, 0);
  const totalMinor = subtotalMinor + shippingMinor;
  if (!Number.isSafeInteger(subtotalMinor) || subtotalMinor < 1 || !Number.isSafeInteger(totalMinor)) throw new Error("INVALID_TOTAL");
  return { currency: "INR", lines, subtotalMinor, shippingMinor, totalMinor };
}
