import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("..", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const store = await read("components/cart-provider.tsx");
const drawer = await read("components/home-page.tsx");
const detail = await read("components/product-detail-page.tsx");
const cartRoute = await read("app/api/cart/products/route.ts");
const repository = await read("lib/catalogue/repository.ts");

test("F004 persists only normal-cart product identity and positive quantity", () => {
  assert.match(store, /CART_STORAGE_KEY = "sleepexcellent\.cart\.v1"/);
  assert.match(store, /BUY_NOW_STORAGE_KEY = "sleepexcellent\.buy-now\.v1"/);
  assert.match(store, /Number\.isSafeInteger\(candidate\.quantity\)/);
  assert.match(store, /line\.slug === slug/);
  assert.doesNotMatch(store, /fixedPriceMinor|lineTotal|subtotalMinor|totalMinor/);
});

test("F004 keeps Buy Now separate and excludes ceilings from cart display resolution", () => {
  assert.match(store, /beginBuyNow/);
  assert.match(store, /sessionStorage/);
  assert.match(repository, /export async function readCartProducts/);
  assert.match(repository, /product\.category !== "CEILING"/);
  assert.match(repository, /\["SOFA", "BED", "MATTRESS"\]/);
  assert.match(cartRoute, /readCartProducts/);
  assert.match(detail, /addItem\(product\.slug, quantity\)/);
  assert.match(detail, /beginBuyNow\(product\.slug, quantity\)/);
});

test("F004 cart surface retains quantity, removal, recovery, and hands off to F005 checkout", () => {
  assert.match(drawer, /Decrease quantity for/);
  assert.match(drawer, /Increase quantity for/);
  assert.match(drawer, /Clear every item from your cart/);
  assert.match(drawer, /href="\/checkout"/);
  assert.match(drawer, /server rebuilds every price and total/i);
  assert.match(drawer, /Product media pending client mapping/);
  assert.doesNotMatch(drawer, /In Stock|Out of Stock/);
});
