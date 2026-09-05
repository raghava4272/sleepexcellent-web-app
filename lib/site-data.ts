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
  homepageVideo: "/videos/homepagevid.mp4",
  sofaVideo: "/videos/sofa.mp4",
  bedVideo: "/videos/bed.mp4",
} as const;

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
    description: "Explore ten listed mattress models in the supplied sizes.",
    count: "10 listed models",
    href: "/catalogue?category=MATTRESS",
    image: media.mattress,
    alt: "Premium SleepExcellent mattress collection",
    position: "center 58%",
  },
  {
    eyebrow: "Live beautifully",
    title: "Sofas",
    description: "Discover sixteen sofa models and their supplied configurations.",
    count: "16 listed models",
    href: "/catalogue?category=SOFA",
    image: media.sofa,
    alt: "SleepExcellent luxury sofa collection",
    position: "center 62%",
  },
  {
    eyebrow: "Made for retreat",
    title: "Beds",
    description: "Browse ten bed models from the current catalogue.",
    count: "10 listed models",
    href: "/catalogue?category=BED",
    image: media.bed,
    alt: "SleepExcellent designer bed collection",
    position: "center 58%",
  },
  {
    eyebrow: "Look upward",
    title: "Ceiling Interiors",
    description: "Compare eight indicative ceiling options before consultation.",
    count: "8 ceiling solutions",
    href: "/catalogue?category=CEILING",
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
  "Pocketed Spring Mattress",
  "Bonnell Spring Mattress",
  "Foam Mattress",
  "Memory Foam Mattress",
  "Feel Good Mattress",
  "Shim Mattress",
] as const;

export const sofaModels = [
  "L-Shape Sofa",
  "Excellent Sofa",
  "Indian Traditional Sofa",
  "Headrest Model Sofa",
  "Chester Model Sofa",
  "Fiber Back Sofa",
  "Luxury Sofa",
  "Camel Back Sofa",
  "Italian Model Sofa",
  "Rock Style Sofa",
  "Modern Sofa",
  "Premium Model Sofa",
  "Cabin Sofa",
  "Sectional Sofa",
  "U-Shape Sofa",
  "Corner Sofa",
] as const;

export const bedModels = [
  "Classic Model Headboard Bed",
  "Roman Model Bed",
  "Luxury Headboard Bed",
  "Colony Model Bed",
  "Dream Night Bed",
  "Teak Wood Bed",
  "Lifestyle Bed",
  "Wood Rock Bed",
  "Kerala Teak Bed",
  "Inbuilt Plywood Bed",
] as const;

export const ceilingTypes = [
  "Gypsum Ceiling",
  "POP Ceiling",
  "Wooden Ceiling",
  "PVC Ceiling",
  "Metal Ceiling",
  "Acoustic Ceiling",
  "Grid (Armstrong) Ceiling",
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
    title: "Four Collections",
    description: "Mattresses, sofas, beds and ceiling solutions in one catalogue.",
  },
  {
    icon: Layers3,
    title: "44 Listed Options",
    description: "Catalogue names, supplied configurations and listed prices stay authoritative.",
  },
  {
    icon: Sparkles,
    title: "Direct Contact",
    description: "Call or email the SleepExcellent team using the confirmed contact details.",
  },
  {
    icon: Armchair,
    title: "Ceiling Consultation",
    description: "Ceiling options remain separate from direct product purchasing.",
  },
];

export const principles = [
  {
    number: "01",
    title: "Browse by collection",
    description:
      "Move directly between mattresses, sofas, beds and ceiling solutions.",
  },
  {
    number: "02",
    title: "Review listed models",
    description:
      "See the catalogue-authoritative names in every collection menu and section.",
  },
  {
    number: "03",
    title: "Continue with the team",
    description:
      "Use the confirmed phone and email details when you are ready to discuss a selection.",
  },
] as const;
