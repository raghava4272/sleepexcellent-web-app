import type { CatalogueProduct } from "./types";

export type ProductMediaItem = {
  src: string;
  /** Product media has no supplied descriptive alt text. */
  alt: string;
  kind: "image" | "video";
  isPrimary: boolean;
};

const ceilingFiles = [
  "POP.jpg",
  "POP3.jpg",
  "acoustic.jpg",
  "acoustic2.jpg",
  "acoustic3.jpg",
  "acoustic4.jpg",
  "acoustic5.jpg",
  "glass.jpg",
  "glass2.jpg",
  "glass3.jpg",
  "glass4.jpg",
  "glass5.jpg",
  "grid.jpg",
  "grid2.jpg",
  "grid3.jpg",
  "grid4.jpg",
  "grid5.jpg",
  "gypsum.jpg",
  "gypsum2.jpg",
  "gypsum3.jpg",
  "gypsum4.jpg",
  "gypsum5.jpg",
  "metal.jpg",
  "metal2.jpg",
  "metal3.jpg",
  "metal4.jpg",
  "metal5.jpg",
  "pop2.jpg",
  "pop4.jpg",
  "pop5.jpg",
  "pvc.jpg",
  "pvc3.jpg",
  "pvc4.jpg",
  "pvc5.jpg",
  "wooden.jpg",
  "wooden2.jpg",
  "wooden3.jpg",
  "wooden4.jpg",
  "wooden5.jpg",
] as const;

const mattressFiles = [
  "Bonnel Spring.jpg",
  "Bonnel spring 2nd.jpg",
  "Bonnel spring close.jpg",
  "Bonnel spring layers.jpg",
  "Feel Good.jpg",
  "Feel good close.jpg",
  "Feel good layers.jpg",
  "Foam 2nd.jpg",
  "Foam Layers.jpg",
  "Foam close.jpg",
  "Foam.jpg",
  "Latex 2nd.jpg",
  "Latex Layers.jpg",
  "Latex Pro.jpg",
  "Latex pro close.jpg",
  "Latex pro layers.jpg",
  "Latex.jpg",
  "Memory Foam Layers.jpg",
  "Memory Foam.jpg",
  "Memory foam 2nd.jpg",
  "Ortho 2nd.jpg",
  "Ortho Layers.jpg",
  "Ortho Plus 2nd.jpg",
  "Ortho Plus close.jpg",
  "Ortho Plus.jpg",
  "Ortho close.jpg",
  "Ortho plus layers.jpg",
  "Ortho.jpg",
  "Pocketed Spring.jpg",
  "Shim 2nd.jpg",
  "Shim Layers.jpg",
  "Shim.jpg",
  "feel good 2nd.jpg",
  "latex close.jpg",
  "latex pro 2nd.jpg",
  "memory foam close.jpg",
  "pocketed spring 2nd.jpg",
  "pocketed spring close.jpg",
  "pocketed spring layers.jpg",
  "shim close.jpg",
] as const;

const mattressGuide = "sleep_excellent_mattress_guide.jpg";

// Folder identity is the authority for these newly supplied sofa/bed assets.
// Paths are explicit so normalisation never guesses a product association.
const directProductFiles: Partial<Record<string, readonly string[]>> = {
  "indian-traditional-sofa": ["Gemini_Generated_Image___60_.png", "Gemini_Generated_Image___61_.png", "Gemini_Generated_Image___62_.png", "Gemini_Generated_Image___63_.png", "Gemini_Generated_Image___64_.png", "Gemini_Generated_Image___65_.png"],
  "cabin-sofa": ["back_view.png", "detail_cushion_close.png", "front_view_1.png", "front_view_2.png", "side_view.png"],
  "camel-back-sofa": ["Gemini_Generated_Image___91_.png", "Gemini_Generated_Image___92_.png", "Gemini_Generated_Image___93_.png", "Gemini_Generated_Image___94_.png", "Gemini_Generated_Image___95_.png", "Gemini_Generated_Image___96_.png"],
  "chester-model-sofa": ["Gemini_Generated_Image___79_.png", "Gemini_Generated_Image___80_.png", "Gemini_Generated_Image___81_.png", "Gemini_Generated_Image___82_.png", "Gemini_Generated_Image___83_.png", "Gemini_Generated_Image___84_.png"],
  "corner-sofa": ["back_view.png", "detail_cushion_corner.png", "front_view_1.png", "front_view_2.png", "side_view.png"],
  "excellent-sofa": ["Gemini_Generated_Image_ (99).png", "Gemini_Generated_Image_ (100).png", "back_view.png", "detail_backrest_seam.png", "detail_cushion_arm.png", "front_view.png", "side_view.png"],
  "fiber-back-sofa": ["back_view.png", "detail_fabric_texture.png", "front_view_1.png", "front_view_2.png", "side_view_chaise.png", "top_view.png"],
  "l-shape-sofa": ["Gemini_Generated_Image_ddy3r4ddy3r4ddy3.png", "Gemini_Generated_Image_ (49).png", "Gemini_Generated_Image_ (51).png", "Gemini_Generated_Image_ (52).png", "Gemini_Generated_Image_ (53).png"],
  "modern-sofa": ["Gemini_Generated_Image___54_.png", "Gemini_Generated_Image___55_.png", "Gemini_Generated_Image___56_.png", "Gemini_Generated_Image___57_.png", "Gemini_Generated_Image___58_.png", "Gemini_Generated_Image___59_.png"],
  "u-shape-sofa": ["back_corner_view_beige.png", "back_view_cream.png", "front_view_cream_1.png", "front_view_cream_2.png", "top_view_cream.png"],
  "italian-model-sofa": ["Gemini_Generated_Image___72_.png", "Gemini_Generated_Image___73_.png", "Gemini_Generated_Image___74_.png", "Gemini_Generated_Image___75_.png", "Gemini_Generated_Image___76_.png", "Gemini_Generated_Image___77_.png", "Gemini_Generated_Image___78_.png"],
  "luxury-sofa": ["Gemini_Generated_Image___85_.png", "Gemini_Generated_Image___86_.png", "Gemini_Generated_Image___87_.png", "Gemini_Generated_Image___88_.png", "Gemini_Generated_Image___89_.png", "Gemini_Generated_Image___90_.png"],
  "premium-model-sofa": ["back_view_set.png", "detail_gold_piping.png", "front_view_set_1.png", "front_view_set_2.png", "side_view_armchair.png", "top_view_set.png"],
  "rock-style-sofa": ["back_view_set.png", "detail_tufted_button.png", "front_view_set.png", "side_view_armchair.png", "top_view_set.png"],
  "headrest-model-sofa": ["Gemini_Generated_Image___66_.png", "Gemini_Generated_Image___67_.png", "Gemini_Generated_Image___68_.png", "Gemini_Generated_Image___69_.png", "Gemini_Generated_Image___70_.png", "Gemini_Generated_Image___71_.png"],
  "classic-model-headboard-bed": ["back_view.png", "detail_tufting.png", "front_view_1.png", "front_view_2.png"],
  "colony-model-bed": ["Gemini_Generated_Image_9t76g9t76g9t76g9.png", "Gemini_Generated_Image_qnka23qnka23qnka.png", "Gemini_Generated_Image__-_2026-09-05T171814_570.png", "Gemini_Generated_Image__-_2026-09-05T171835_084.png"],
  "dream-night-bed": ["Gemini_Generated_Image_ - 2026-09-05T171710.899.png", "Gemini_Generated_Image_ - 2026-09-05T171721.500.png", "Gemini_Generated_Image_ - 2026-09-05T171729.454.png", "Gemini_Generated_Image_ - 2026-09-05T171737.799.png"],
  "roman-model-bed": ["Gemini_Generated_Image_ - 2026-09-05T171620.668.png", "Gemini_Generated_Image_ - 2026-09-05T171627.136.png", "Gemini_Generated_Image_ - 2026-09-05T171634.917.png", "Gemini_Generated_Image_ - 2026-09-05T171641.959.png"],
  "lifestyle-bed": ["Gemini_Generated_Image__-_2026-09-05T172112_230.png", "Gemini_Generated_Image__-_2026-09-05T172119_630.png", "Gemini_Generated_Image__-_2026-09-05T172127_529.png", "Gemini_Generated_Image__-_2026-09-05T172136_513.png"],
  "wood-rock-bed": ["Gemini_Generated_Image_gwrlbhgwrlbhgwrl.png", "Gemini_Generated_Image__-_2026-09-05T171900_457.png", "Gemini_Generated_Image__-_2026-09-05T171945_967.png", "Gemini_Generated_Image__-_2026-09-05T171956_704.png"],
  "teak-wood-bed": ["Gemini_Generated_Image_ (97).png", "Gemini_Generated_Image_ (98).png", "Gemini_Generated_Image_1tsa041tsa041tsa (1).png", "Gemini_Generated_Image_6vl5xg6vl5xg6vl5.png"],
  "kerala-teak-bed": ["Gemini_Generated_Image_ - 2026-09-05T171445.450.png", "Gemini_Generated_Image_ - 2026-09-05T171454.159.png", "Gemini_Generated_Image_ - 2026-09-05T171501.861.png", "Gemini_Generated_Image_ - 2026-09-05T171510.259.png"],
  "inbuilt-plywood-bed": ["Gemini_Generated_Image__-_2026-09-05T172033_883.png", "Gemini_Generated_Image__-_2026-09-05T172040_313.png", "Gemini_Generated_Image__-_2026-09-05T172050_124.png", "Gemini_Generated_Image__-_2026-09-05T172057_170.png"],
};

/**
 * Applies only safe filename formatting normalization. It intentionally does
 * not correct spelling or perform fuzzy matching, which could cross-map a
 * product to a different model.
 */
export function normalizeMediaName(value: string) {
  return value
    .replace(/\.(?:jpe?g|png|webp|mp4|mov|webm)$/i, "")
    .trim()
    .toLocaleLowerCase()
    .replace(/[\s_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function modelKey(product: CatalogueProduct) {
  // The client folder's sole `grid` series is the supplied Grid (Armstrong)
  // Ceiling series. This is an explicit canonical folder key, not fuzzy match.
  if (product.slug === "grid-armstrong-ceiling") return "grid";
  // Explicitly approved alias: this is the sole exception to the no-fuzzy
  // matching rule for the supplied Bonnel Spring media filenames.
  if (product.slug === "bonnell-spring-mattress") return "bonnel spring";
  return normalizeMediaName(product.name)
    .replace(/\s+(mattress|ceiling)$/, "")
    .trim();
}

function image(src: string, isPrimary = false): ProductMediaItem {
  const storageBase = process.env.NEXT_PUBLIC_PRODUCT_MEDIA_BASE_URL?.replace(/\/$/, "");
  const resolved = storageBase
    ? `${storageBase}/catalogue/${src.replace(/^\/media\//, "")}`
    : src;
  return { src: encodeURI(resolved), alt: "", kind: "image", isPrimary };
}

function ceilingMedia(product: CatalogueProduct) {
  const key = modelKey(product);
  const slots = [1, 2, 3, 4, 5];
  return slots.flatMap((slot) => {
    const filename = ceilingFiles.find((candidate) => {
      const normalized = normalizeMediaName(candidate);
      return normalized === `${key}${slot === 1 ? "" : slot}`;
    });
    return filename ? [image(`/media/ceiling/${filename}`, slot === 1)] : [];
  });
}

function mattressMedia(product: CatalogueProduct) {
  const key = modelKey(product);
  const semanticSuffixes = ["", " 2nd", " layers", " close"];
  const mapped = semanticSuffixes.flatMap((suffix, index) => {
    const filename = mattressFiles.find(
      (candidate) => normalizeMediaName(candidate) === `${key}${suffix}`,
    );
    return filename ? [image(`/media/mattresses/${filename}`, index === 0)] : [];
  });

  // The supplied guide is intentionally shared and always follows product media.
  return [...mapped, image(`/media/mattresses/${mattressGuide}`)];
}

function directMedia(product: CatalogueProduct) {
  const filenames = directProductFiles[product.slug] ?? [];
  const collection = product.category === "SOFA" ? "sofas" : "beds";
  const media = filenames.map((filename, index) => image(`/media/${collection}/${product.slug}/${filename}`, index === 0));
  if (product.category !== "BED") return media;

  // Every bed receives the client-approved shared guide exactly once, last.
  return [...media, image(`/media/mattresses/${mattressGuide}`)];
}

export function getProductMedia(product: CatalogueProduct): ProductMediaItem[] {
  if (product.category === "CEILING") return ceilingMedia(product);
  if (product.category === "MATTRESS") return mattressMedia(product);
  return directMedia(product);
}

export function getProductPrimaryMedia(product: CatalogueProduct) {
  return getProductMedia(product).find((media) => media.isPrimary) ?? null;
}
