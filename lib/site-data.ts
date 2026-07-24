import type { LucideIcon } from "lucide-react";
import { Armchair, BedDouble, Layers3, Sparkles } from "lucide-react";

export const contact = {
  primaryPhoneDisplay: "+91 98492 56799",
  primaryPhoneHref: "tel:+919849256799",
  secondaryPhoneDisplay: "+91 90442 57999",
  secondaryPhoneHref: "tel:+919044257999",
  email: "sleepexcellent999@gmail.com",
  emailHref: "mailto:sleepexcellent999@gmail.com",
} as const;

export const media = {
  mattress: "/photos/mattress.jpeg",
  sofa: "/photos/sofas.jpeg",
  bed: "/photos/padding beds.jpeg",
  interior: "/photos/interior.jpeg",
  mattressVideo: "/videos/mattress.mp4",
  sofaVideo: "/videos/sofa.mp4",
  bedVideo: "/videos/bed.mp4",
} as const;

export type Product = {
  id: string;
  name: string;
  category: "Beds" | "Sofas";
  price: number;
  image: string;
  alt: string;
};

export const products: Product[] = [
  {
    id: "1000151957",
    name: "Heritage Carved Bed — 1000151957",
    category: "Beds",
    price: 58990,
    image: "/products/1000151957.png",
    alt: "Heritage carved wooden bed with burgundy upholstered headboard",
  },
  {
    id: "1000151960",
    name: "Heritage Upholstered Bed — 1000151960",
    category: "Beds",
    price: 56990,
    image: "/products/1000151960.png",
    alt: "Close view of the upholstered heritage bed craftsmanship",
  },
  {
    id: "1000151961",
    name: "Panel Headboard Bed — 1000151961",
    category: "Beds",
    price: 54990,
    image: "/products/1000151961.png",
    alt: "Upholstered panel headboard bed in walnut and taupe",
  },
  {
    id: "1000151962",
    name: "Lift Storage Bed — 1000151962",
    category: "Beds",
    price: 64990,
    image: "/products/1000151962.png",
    alt: "Walnut lift storage bed with upholstered headboard",
  },
  {
    id: "1000151963",
    name: "Classic Storage Bed — 1000151963",
    category: "Beds",
    price: 62990,
    image: "/products/1000151963.png",
    alt: "Classic walnut storage bed with tufted headboard",
  },
  {
    id: "1000151964",
    name: "Grand Tufted Bed — 1000151964",
    category: "Beds",
    price: 59990,
    image: "/products/1000151964.png",
    alt: "Grand walnut bed with a taupe button-tufted headboard",
  },
  {
    id: "1000151965",
    name: "Regency Sofa — 1000151965",
    category: "Sofas",
    price: 48990,
    image: "/products/1000151965.png",
    alt: "Blue regency three-seater sofa with damask upholstery",
  },
  {
    id: "1000151966",
    name: "Regency Carved Sofa — 1000151966",
    category: "Sofas",
    price: 45990,
    image: "/products/1000151966.png",
    alt: "Carved wood detail on a blue regency sofa",
  },
  {
    id: "1000151967",
    name: "Regency Curve Sofa — 1000151967",
    category: "Sofas",
    price: 47990,
    image: "/products/1000151967.png",
    alt: "Curved back view of a blue damask regency sofa",
  },
  {
    id: "1000151968",
    name: "Regency Lounge Sofa — 1000151968",
    category: "Sofas",
    price: 49990,
    image: "/products/1000151968.png",
    alt: "Angled back view of a blue damask lounge sofa",
  },
  {
    id: "1000151969",
    name: "Regency Chester Sofa — 1000151969",
    category: "Sofas",
    price: 52990,
    image: "/products/1000151969.png",
    alt: "Blue damask Chester-style three-seater sofa",
  },
  {
    id: "1000151970",
    name: "Regency Grande Sofa — 1000151970",
    category: "Sofas",
    price: 54990,
    image: "/products/1000151970.png",
    alt: "Blue damask grand sofa in a warm wood-panelled room",
  },
  {
    id: "1000151971",
    name: "Olive Accent Sofa — 1000151971",
    category: "Sofas",
    price: 36990,
    image: "/products/1000151971.png",
    alt: "Side view of a modern olive velvet sofa",
  },
  {
    id: "1000151972",
    name: "Olive Luxe Sofa — 1000151972",
    category: "Sofas",
    price: 42990,
    image: "/products/1000151972.png",
    alt: "Modern olive velvet two-seater sofa with brass legs",
  },
];

export type Category = {
  eyebrow: string;
  title: string;
  description: string;
  count: string;
  href: string;
  image: string;
  alt: string;
  position: string;
};

export const categories: Category[] = [
  {
    eyebrow: "Rest, refined",
    title: "Mattresses",
    description: "Supportive comfort designed for every sleeping style.",
    count: "10 mattress collections",
    href: "#mattresses",
    image: media.mattress,
    alt: "Premium SleepExcellent mattress collection",
    position: "center 58%",
  },
  {
    eyebrow: "Live beautifully",
    title: "Sofas",
    description: "Statement seating created for comfort and conversation.",
    count: "16 sofa collections",
    href: "#sofas",
    image: media.sofa,
    alt: "SleepExcellent luxury sofa collection",
    position: "center 62%",
  },
  {
    eyebrow: "Made for retreat",
    title: "Beds",
    description: "Elegant beds that bring craftsmanship into the bedroom.",
    count: "10 bed collections",
    href: "#beds",
    image: media.bed,
    alt: "SleepExcellent designer bed collection",
    position: "center 58%",
  },
  {
    eyebrow: "Look upward",
    title: "Ceiling Interiors",
    description: "Refined ceiling solutions for distinctive modern spaces.",
    count: "8 ceiling solutions",
    href: "#interiors",
    image: media.interior,
    alt: "SleepExcellent decorative ceiling interior",
    position: "center 24%",
  },
];

export const mattressModels = [
  "Ortho Mattress",
  "Ortho Plus Mattress",
  "Latex Mattress",
  "Latex Pro Mattress",
  "Pocket Spring Mattress",
  "Bonnell Spring Mattress",
  "Foam Mattress",
  "Memory Foam Mattress",
  "Feel Good Memory Mattress",
  "Slim Mattress",
] as const;

export const sofaModels = [
  "“L” Shape Sofa — 3 Seater + Lounger",
  "Excellent 3 Seater",
  "Indian Traditional Sofa — 5 Seater",
  "Head Rest Model Sofa — 6 Seater",
  "Chester Model Sofa — 5 Seater",
  "Fiber Back Sofa — 5 Seater",
  "Luxury Sofa — 2 Seater",
  "Camel Back Sofa — 5 Seater",
  "Italian Model Sofa — 6 Seater",
  "Rock Star Sofa — 3 + 2 + 1",
  "Modern Sofa — 3 Seater",
  "Premium Model Sofa — 3 + 2 + 1",
  "Cabin Sofa — L Shape",
  "Section Sofa — 6 Seater",
  "“U” Shape Sofa — 9 Seater",
  "Corner Sofa — 4 Seater",
] as const;

export const bedModels = [
  "Classic Model Headboard Bed — King Size",
  "Roman Model Bed",
  "Luxury Headboard Bed",
  "Woody Model Bed",
  "Dream Night Bed",
  "Teak Wood Bed",
  "Life Style Bed",
  "Wood Rock Bed",
  "Kerala Teak Bed",
  "Inbuilt Ply Wood with Deccan Bed",
] as const;

export const ceilingTypes = [
  "Gypsum Ceiling",
  "POP Ceiling",
  "Wooden Ceiling",
  "PVC Ceiling",
  "Metal Ceiling",
  "Acoustic Ceiling",
  "Grid — Armstrong Ceiling",
  "Glass Ceiling",
] as const;

export type Benefit = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const benefits: Benefit[] = [
  {
    icon: BedDouble,
    title: "Thoughtful Comfort",
    description: "Designed for balanced support and everyday relaxation.",
  },
  {
    icon: Layers3,
    title: "Quality Materials",
    description: "Carefully selected materials for lasting performance.",
  },
  {
    icon: Sparkles,
    title: "Personal Guidance",
    description: "Expert assistance to help you choose the right product.",
  },
  {
    icon: Armchair,
    title: "Complete Interiors",
    description:
      "Mattresses, furniture and ceiling solutions under one brand.",
  },
];

export const principles = [
  {
    number: "01",
    title: "Comfort-led design",
    description:
      "Every collection begins with how it will support, seat or serve the people using it.",
  },
  {
    number: "02",
    title: "Refined visual details",
    description:
      "Balanced proportions, timeless silhouettes and carefully selected finishes.",
  },
  {
    number: "03",
    title: "Personalised assistance",
    description:
      "Guidance for choosing mattresses, furniture configurations and interior solutions.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "The mattress selection guidance was clear and helpful. The final product feels supportive, comfortable and very well finished.",
    label: "Homeowner, Hyderabad",
  },
  {
    quote:
      "Our sofa completely changed the feel of the living room. The proportions, comfort and finish look genuinely premium.",
    label: "Customer, Vijayawada",
  },
  {
    quote:
      "The team helped coordinate the bed and ceiling design beautifully. The overall room now feels much more complete.",
    label: "Interior Client, Chennai",
  },
] as const;
