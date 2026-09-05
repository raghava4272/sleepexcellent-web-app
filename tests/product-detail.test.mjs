import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("..", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const route = await read("app/products/[slug]/page.tsx");
const detail = await read("components/product-detail-page.tsx");
const repository = await read("lib/catalogue/repository.ts");
const catalogue = await read("components/catalogue-page.tsx");

test("F003 resolves stable published product routes through the existing catalogue repository", () => {
  assert.match(route, /readCatalogueProduct/);
  assert.match(route, /notFound/);
  assert.match(repository, /export async function readCatalogueProduct/);
  assert.match(repository, /eq\(products\.slug, slug\)/);
  assert.match(repository, /eq\(products\.publicationState, "PUBLISHED"\)/);
  assert.match(catalogue, /href=\{`\/products\/\$\{product\.slug\}`\}/);
});

test("F003 detail presentation preserves the direct-purchase and ceiling CTA boundary", () => {
  assert.match(detail, /QuantityControl/);
  assert.match(detail, /Add to Cart/);
  assert.match(detail, /Buy Now/);
  assert.match(detail, /product\.category === "SOFA"/);
  assert.match(detail, /Request consultation/);
  assert.match(detail, /isCeiling \? <CeilingPanel \/> : <DirectPurchasePanel/);
  assert.doesNotMatch(detail, /availability|In Stock|Out of Stock|discount|warranty/i);
});

test("F003 delegates authoritative mapped media and preserves its premium fallback", async () => {
  const gallery = await read("components/product-media-gallery.tsx");
  assert.match(detail, /ProductMediaGallery/);
  assert.match(gallery, /Media pending/);
  assert.match(gallery, /Authoritative product media will appear here when its client mapping is confirmed/);
  assert.match(gallery, /useReducedMotion/);
  assert.doesNotMatch(gallery, /public\/products|mediaPath/);
  assert.match(detail, /useReducedMotion/);
  assert.match(detail, /aria-label="Increase quantity"/);
  assert.match(detail, /aria-label="Decrease quantity"/);
});
