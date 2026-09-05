import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("the homepage uses confirmed contact destinations and no dead hash links", () => {
  const source = read("components/home-page.tsx");
  const data = read("lib/site-data.ts");

  assert.match(data, /tel:\+919849256799/);
  assert.match(data, /tel:\+919044257999/);
  assert.match(data, /mailto:sleepexcellent999@gmail\.com/);
  assert.doesNotMatch(source, /href=["']#["']/);
});

test("homepage search uses authoritative suggestions and opens the selected product", () => {
  const source = read("components/home-page.tsx");
  const suggestionRoute = read("app/api/catalogue/suggestions/route.ts");
  const catalogueRepository = read("lib/catalogue/repository.ts");

  assert.match(source, /api\/catalogue\/suggestions/);
  assert.match(source, /action="\/catalogue"/);
  assert.match(source, /Search catalogue/);
  assert.match(source, /role="listbox"/);
  assert.match(source, /href=\{`\/products\/\$\{suggestion\.slug\}`\}/);
  assert.match(suggestionRoute, /readPersistedCatalogueSuggestions/);
  assert.match(catalogueRepository, /export async function readPersistedCatalogueSuggestions/);
  assert.match(catalogueRepository, /eq\(products\.publicationState, "PUBLISHED"\)/);
  assert.match(catalogueRepository, /\.limit\(6\)/);
  assert.doesNotMatch(suggestionRoute, /availability|fixedPriceMinor|media/i);
});

test("desktop category menus reveal on hover and close after pointer exit", () => {
  const source = read("components/home-page.tsx");

  assert.match(source, /onMouseEnter=\{\(event\) => event\.currentTarget\.setAttribute\("open", ""\)\}/);
  assert.match(source, /onMouseLeave=\{\(event\) =>/);
  assert.match(source, /removeAttribute\("open"\)/);
  assert.match(source, /:focus-within/);
});

test("approved homepage media and video fallbacks remain available", () => {
  const assets = [
    "public/photos/mattress.jpeg",
    "public/photos/sofas.jpeg",
    "public/photos/padding beds.jpeg",
    "public/photos/interior.jpeg",
    "public/videos/mattress.mp4",
    "public/videos/homepagevid.mp4",
    "public/videos/sofa.mp4",
    "public/videos/bed.mp4",
    "public/brand/logo.png",
  ];

  for (const asset of assets) {
    assert.ok(existsSync(new URL(asset, root)), asset + " should exist");
  }

  const source = read("components/home-page.tsx");
  assert.match(source, /autoPlay/);
  assert.match(source, /muted/);
  assert.match(source, /loop/);
  assert.match(source, /playsInline/);
  assert.match(source, /poster=/);
  assert.match(source, /homepageVideo/);
  assert.match(source, /\/brand\/logo\.png/);
});

test("homepage displays both supplied partner images without creating biography copy", () => {
  const assets = [
    "public/photos/partners/Ceo-pratap_reddy_snapareddy.jpg",
    "public/photos/partners/Managing_director_Merva_Obaiah.jpg",
  ];
  for (const asset of assets) assert.ok(existsSync(new URL(asset, root)), `${asset} should exist`);

  const source = read("components/home-page.tsx");
  assert.match(source, /Meet the Partners/);
  assert.match(source, /Pratap Reddy Snapareddy/);
  assert.match(source, /Managing Director/);
  assert.match(source, /object-contain/);
  assert.match(source, /PartnersSection/);
});

test("the standard Next.js runtime is the only configured application runtime", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.equal(packageJson.scripts.dev, "next dev --webpack");
  assert.equal(packageJson.scripts.build, "next build --webpack");
  assert.equal(packageJson.scripts.start, "next start");

  for (const dependency of [
    "vinext",
    "vite",
    "wrangler",
    "@cloudflare/vite-plugin",
  ]) {
    assert.equal(packageJson.dependencies?.[dependency], undefined);
    assert.equal(packageJson.devDependencies?.[dependency], undefined);
  }

  for (const legacyPath of [
    ".openai/hosting.json",
    "vite.config.ts",
    "worker/index.ts",
    "app/chatgpt-auth.ts",
  ]) {
    assert.equal(existsSync(new URL(legacyPath, root)), false);
  }
});
