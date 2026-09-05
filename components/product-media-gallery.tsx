"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { getProductMedia } from "@/lib/catalogue/media";
import type { CatalogueProduct } from "@/lib/catalogue/types";

function MediaFallback({ product }: { product: CatalogueProduct }) {
  const categoryTone = product.category === "CEILING" ? "detail-media-ceiling" : "detail-media-product";

  return (
    <div className={`detail-media ${categoryTone}`} aria-label="Product media pending client mapping">
      <div className="detail-media-orb detail-media-orb-one" aria-hidden="true" />
      <div className="detail-media-orb detail-media-orb-two" aria-hidden="true" />
      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8">
        <span className="w-fit border border-burgundy/25 bg-ivory/90 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.17em] text-burgundy">Media pending</span>
        <div className="max-w-xs">
          <ImageOff className="mb-5 text-burgundy/65" size={34} strokeWidth={1.1} aria-hidden="true" />
          <p className="font-serif text-4xl leading-none tracking-[-0.04em] text-charcoal sm:text-5xl">{product.name}</p>
          <p className="mt-4 text-sm leading-6 text-muted">Authoritative product media will appear here when its client mapping is confirmed.</p>
        </div>
      </div>
      <span aria-hidden="true" className="detail-media-mark">SE</span>
    </div>
  );
}

export function ProductMediaGallery({ product }: { product: CatalogueProduct }) {
  const media = getProductMedia(product);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  if (!media.length) return <MediaFallback product={product} />;
  const active = media[Math.min(activeIndex, media.length - 1)];

  return (
    <section aria-label={`${product.name} gallery`} className="product-gallery">
      <div className="product-gallery-stage">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={active.src}
            className="absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={active.src} alt={active.alt} fill priority sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>

      {media.length > 1 && (
        <div className="product-gallery-thumbnails" aria-label="Choose gallery image">
          {media.map((item, index) => (
            <button
              key={item.src}
              type="button"
              aria-label={`View image ${index + 1} of ${media.length}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`product-gallery-thumb ${index === activeIndex ? "product-gallery-thumb-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <Image src={item.src} alt="" fill sizes="6rem" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
