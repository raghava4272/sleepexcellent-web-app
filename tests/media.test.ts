import assert from "node:assert/strict";
import test from "node:test";
import { getProductMedia, getProductPrimaryMedia, normalizeMediaName } from "../lib/catalogue/media";
import type { CatalogueProduct } from "../lib/catalogue/types";

function product(name: string, category: CatalogueProduct["category"]): CatalogueProduct {
  return {
    slug: name.toLowerCase().replaceAll(" ", "-"),
    name,
    category,
    configuration: null,
    size: null,
    suitability: null,
    fixedPriceMinor: category === "CEILING" ? null : 100,
    indicativeMinMinor: category === "CEILING" ? 100 : null,
    indicativeMaxMinor: category === "CEILING" ? 200 : null,
    indicativeMaxOpenEnded: false,
    publicationState: "PUBLISHED",
    availability: null,
  };
}

test("ceiling media follows filename slots and safely skips missing numbered slots", () => {
  assert.deepEqual(
    getProductMedia(product("PVC Ceiling", "CEILING")).map((media) => media.src),
    ["/media/ceiling/pvc.jpg", "/media/ceiling/pvc3.jpg", "/media/ceiling/pvc4.jpg", "/media/ceiling/pvc5.jpg"],
  );
  assert.deepEqual(
    getProductMedia(product("POP Ceiling", "CEILING")).map((media) => media.src),
    ["/media/ceiling/POP.jpg", "/media/ceiling/pop2.jpg", "/media/ceiling/POP3.jpg", "/media/ceiling/pop4.jpg", "/media/ceiling/pop5.jpg"],
  );
});

test("mattress media preserves main, second, layers, close, then shared guide", () => {
  assert.deepEqual(
    getProductMedia(product("Ortho Plus Mattress", "MATTRESS")).map((media) => media.src),
    [
      "/media/mattresses/Ortho%20Plus.jpg",
      "/media/mattresses/Ortho%20Plus%202nd.jpg",
      "/media/mattresses/Ortho%20plus%20layers.jpg",
      "/media/mattresses/Ortho%20Plus%20close.jpg",
      "/media/mattresses/sleep_excellent_mattress_guide.jpg",
    ],
  );
  const grid = { ...product("Grid (Armstrong) Ceiling", "CEILING"), slug: "grid-armstrong-ceiling" };
  assert.deepEqual(
    getProductMedia(grid).map((media) => media.src),
    ["/media/ceiling/grid.jpg", "/media/ceiling/grid2.jpg", "/media/ceiling/grid3.jpg", "/media/ceiling/grid4.jpg", "/media/ceiling/grid5.jpg"],
  );
});

test("mapping accepts formatting-only filename differences and the one approved Bonnell alias", () => {
  assert.equal(normalizeMediaName("Ortho_Plus--Layers.JPG"), "ortho plus layers");
  const bonnell = { ...product("Bonnell Spring Mattress", "MATTRESS"), slug: "bonnell-spring-mattress" };
  assert.deepEqual(getProductMedia(bonnell).map((media) => media.src), [
    "/media/mattresses/Bonnel%20Spring.jpg",
    "/media/mattresses/Bonnel%20spring%202nd.jpg",
    "/media/mattresses/Bonnel%20spring%20layers.jpg",
    "/media/mattresses/Bonnel%20spring%20close.jpg",
    "/media/mattresses/sleep_excellent_mattress_guide.jpg",
  ]);
  assert.equal(getProductPrimaryMedia(bonnell)?.src, "/media/mattresses/Bonnel%20Spring.jpg");
});

test("confident sofa folders supply ordered primary and gallery media only for their model", () => {
  const lShape = product("L-Shape Sofa", "SOFA");
  assert.deepEqual(getProductMedia(lShape).map((media) => media.src), [
    "/media/sofas/l-shape-sofa/Gemini_Generated_Image_ddy3r4ddy3r4ddy3.png",
    "/media/sofas/l-shape-sofa/Gemini_Generated_Image_%20(49).png",
    "/media/sofas/l-shape-sofa/Gemini_Generated_Image_%20(51).png",
    "/media/sofas/l-shape-sofa/Gemini_Generated_Image_%20(52).png",
    "/media/sofas/l-shape-sofa/Gemini_Generated_Image_%20(53).png",
  ]);
  assert.equal(getProductPrimaryMedia(lShape)?.src, "/media/sofas/l-shape-sofa/Gemini_Generated_Image_ddy3r4ddy3r4ddy3.png");
  assert.equal(getProductPrimaryMedia(product("Italian Model Sofa", "SOFA"))?.src, "/media/sofas/italian-model-sofa/Gemini_Generated_Image___72_.png");
});

test("every bed ends with one shared guide and approved mapped folders get a primary card image", () => {
  const classic = product("Classic Model Headboard Bed", "BED");
  const classicMedia = getProductMedia(classic);
  assert.equal(classicMedia.length, 5);
  assert.equal(classicMedia.at(-1)?.src, "/media/mattresses/sleep_excellent_mattress_guide.jpg");
  assert.equal(getProductPrimaryMedia(classic)?.src, "/media/beds/classic-model-headboard-bed/back_view.png");

  const teak = product("Teak Wood Bed", "BED");
  assert.deepEqual(getProductMedia(teak).map((media) => media.src), [
    "/media/beds/teak-wood-bed/Gemini_Generated_Image_%20(97).png",
    "/media/beds/teak-wood-bed/Gemini_Generated_Image_%20(98).png",
    "/media/beds/teak-wood-bed/Gemini_Generated_Image_1tsa041tsa041tsa%20(1).png",
    "/media/beds/teak-wood-bed/Gemini_Generated_Image_6vl5xg6vl5xg6vl5.png",
    "/media/mattresses/sleep_excellent_mattress_guide.jpg",
  ]);
  assert.equal(getProductPrimaryMedia(teak)?.src, "/media/beds/teak-wood-bed/Gemini_Generated_Image_%20(97).png");
});
