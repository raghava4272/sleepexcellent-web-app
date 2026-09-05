import type { CatalogueProduct } from "./types";

type SeedProduct = Omit<CatalogueProduct, "publicationState" | "availability">;

const direct = (
  slug: string,
  category: "SOFA" | "BED" | "MATTRESS",
  name: string,
  fixedPriceMinor: number,
  configuration: string | null = null,
  size: string | null = null,
): SeedProduct => ({
  slug,
  category,
  name,
  configuration,
  size,
  suitability: null,
  fixedPriceMinor,
  indicativeMinMinor: null,
  indicativeMaxMinor: null,
  indicativeMaxOpenEnded: false,
});

const ceiling = (
  slug: string,
  name: string,
  suitability: string,
  indicativeMinMinor: number,
  indicativeMaxMinor: number,
  indicativeMaxOpenEnded = false,
): SeedProduct => ({
  slug,
  category: "CEILING",
  name,
  configuration: null,
  size: null,
  suitability,
  fixedPriceMinor: null,
  indicativeMinMinor,
  indicativeMaxMinor,
  indicativeMaxOpenEnded,
});

// This is the single checked-in transcription of docs/product/CATALOGUE.md.
// It intentionally carries no availability, media mappings, variants, or inferred fields.
export const catalogueSeed: readonly SeedProduct[] = [
  direct("l-shape-sofa", "SOFA", "L-Shape Sofa", 6350000, "3-seater + lounger"),
  direct("excellent-sofa", "SOFA", "Excellent Sofa", 3630000, "3-seater"),
  direct("indian-traditional-sofa", "SOFA", "Indian Traditional Sofa", 4980000, "5-seater"),
  direct("headrest-model-sofa", "SOFA", "Headrest Model Sofa", 5960000, "6-seater"),
  direct("chester-model-sofa", "SOFA", "Chester Model Sofa", 8690000, "5-seater"),
  direct("fiber-back-sofa", "SOFA", "Fiber Back Sofa", 6365000, "5-seater"),
  direct("luxury-sofa", "SOFA", "Luxury Sofa", 3690000, "2-seater"),
  direct("camel-back-sofa", "SOFA", "Camel Back Sofa", 5659000, "5-seater"),
  direct("italian-model-sofa", "SOFA", "Italian Model Sofa", 9020000, "6-seater"),
  direct("rock-style-sofa", "SOFA", "Rock Style Sofa", 7569000, "3 + 2 + 1 configuration"),
  direct("modern-sofa", "SOFA", "Modern Sofa", 3650000, "3-seater"),
  direct("premium-model-sofa", "SOFA", "Premium Model Sofa", 7590000, "3 + 2 + 1 configuration"),
  direct("cabin-sofa", "SOFA", "Cabin Sofa", 6230000, "L-shape"),
  direct("sectional-sofa", "SOFA", "Sectional Sofa", 6690000, "6-seater"),
  direct("u-shape-sofa", "SOFA", "U-Shape Sofa", 12590000, "9-seater"),
  direct("corner-sofa", "SOFA", "Corner Sofa", 7150000, "4-seater"),
  direct("classic-model-headboard-bed", "BED", "Classic Model Headboard Bed", 4960000, "King size"),
  direct("roman-model-bed", "BED", "Roman Model Bed", 6690000),
  direct("luxury-headboard-bed", "BED", "Luxury Headboard Bed", 3530000),
  direct("colony-model-bed", "BED", "Colony Model Bed", 2500000),
  direct("dream-night-bed", "BED", "Dream Night Bed", 3300000),
  direct("teak-wood-bed", "BED", "Teak Wood Bed", 2850000),
  direct("lifestyle-bed", "BED", "Lifestyle Bed", 1690000),
  direct("wood-rock-bed", "BED", "Wood Rock Bed", 2160000),
  direct("kerala-teak-bed", "BED", "Kerala Teak Bed", 3599500),
  direct("inbuilt-plywood-bed", "BED", "Inbuilt Plywood Bed", 5590000, "Premium model"),
  direct("ortho-mattress", "MATTRESS", "Ortho Mattress", 1269900, null, "72 × 75 × 6 in"),
  direct("ortho-plus-mattress", "MATTRESS", "Ortho Plus Mattress", 1639500, null, "72 × 75 × 6 in"),
  direct("latex-mattress", "MATTRESS", "Latex Mattress", 1597500, null, "72 × 75 × 6 in"),
  direct("latex-pro-mattress", "MATTRESS", "Latex Pro Mattress", 2831500, null, "72 × 75 × 6 in"),
  direct("pocketed-spring-mattress", "MATTRESS", "Pocketed Spring Mattress", 1559500, null, "72 × 75 × 6 in"),
  direct("bonnell-spring-mattress", "MATTRESS", "Bonnell Spring Mattress", 1722200, null, "72 × 75 × 6 in"),
  direct("foam-mattress", "MATTRESS", "Foam Mattress", 1447500, null, "72 × 75 × 6 in"),
  direct("memory-foam-mattress", "MATTRESS", "Memory Foam Mattress", 1661900, null, "72 × 75 × 6 in"),
  direct("feel-good-mattress", "MATTRESS", "Feel Good Mattress", 2692900, null, "72 × 75 × 6 in"),
  direct("shim-mattress", "MATTRESS", "Shim Mattress", 211900, null, "72 × 75 × 1 in"),
  ceiling("gypsum-ceiling", "Gypsum Ceiling", "Best suited for living rooms, bedrooms and offices", 8000, 18000),
  ceiling("pop-ceiling", "POP Ceiling", "Best suited for decorative and custom designs", 6000, 16000),
  ceiling("wooden-ceiling", "Wooden Ceiling", "Best suited for premium interiors and villas", 15000, 40000),
  ceiling("pvc-ceiling", "PVC Ceiling", "Best suited for kitchens, bathrooms and balconies", 5000, 15000),
  ceiling("metal-ceiling", "Metal Ceiling", "Best suited for offices and commercial spaces", 10000, 25000),
  ceiling("acoustic-ceiling", "Acoustic Ceiling", "Best suited for studios, conference rooms and theatres", 12000, 35000),
  ceiling("grid-armstrong-ceiling", "Grid (Armstrong) Ceiling", "Best suited for offices, hospitals and commercial buildings", 7000, 10000),
  ceiling("glass-ceiling", "Glass Ceiling", "Best suited for luxury homes, hotels and showrooms", 30000, 70000, true),
];

export const publishedCatalogueSeed: readonly CatalogueProduct[] = catalogueSeed.map((product) => ({
  ...product,
  publicationState: "PUBLISHED",
  availability: null,
}));
