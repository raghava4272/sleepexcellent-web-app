"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Minus, Plus, Quote, ShoppingBag, Zap } from "lucide-react";
import { useState } from "react";
import { productPrice } from "@/lib/catalogue/presentation";
import { categoryLabels, type CatalogueProduct } from "@/lib/catalogue/types";
import { useCart } from "@/components/cart-provider";
import { ProductMediaGallery } from "@/components/product-media-gallery";

type Props = {
  product: CatalogueProduct;
  source: "database" | "seed";
};

function QuantityControl({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="mt-7">
      <p className="text-[0.63rem] font-bold uppercase tracking-[0.18em] text-muted">Quantity</p>
      <div className="mt-3 inline-flex min-h-12 items-center border border-border bg-ivory">
        <button type="button" className="detail-quantity-button" aria-label="Decrease quantity" onClick={() => onChange(Math.max(1, value - 1))}>
          <Minus size={16} aria-hidden="true" />
        </button>
        <output className="flex min-w-12 justify-center font-semibold text-charcoal" aria-live="polite">{value}</output>
        <button type="button" className="detail-quantity-button" aria-label="Increase quantity" onClick={() => onChange(value + 1)}>
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function DirectPurchasePanel({ product }: { product: CatalogueProduct }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState<string | null>(null);
  const { addItem, beginBuyNow } = useCart();

  const addToCart = () => {
    addItem(product.slug, quantity);
    setNotice(`${quantity} ${quantity === 1 ? "item" : "items"} added to your persistent cart.`);
  };

  const buyNow = () => {
    beginBuyNow(product.slug, quantity);
    setNotice("Opening an isolated Buy Now checkout. Your normal cart remains preserved.");
    router.push("/checkout?mode=buy-now");
  };

  return (
    <div className="mt-8 border-t border-border pt-7">
      <QuantityControl value={quantity} onChange={setQuantity} />
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button type="button" className="button-primary" onClick={addToCart}>
          <ShoppingBag size={17} aria-hidden="true" /> Add to Cart
        </button>
        <button type="button" className="button-secondary" onClick={buyNow}>
          Buy Now <Zap size={16} aria-hidden="true" />
        </button>
      </div>
      {notice && <p role="status" className="detail-action-notice">{notice}</p>}
      {product.category === "SOFA" && (
        <a href="tel:+919849256799" className="text-link mt-6">
          Discuss a custom sofa <ArrowRight size={15} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

function CeilingPanel() {
  return (
    <div className="mt-8 border-t border-border pt-7">
      <div className="border border-burgundy/20 bg-cream/75 p-5 sm:p-6">
        <Quote className="text-burgundy" size={22} aria-hidden="true" />
        <p className="mt-4 font-serif text-2xl leading-tight text-charcoal">Request a consultation for a final quotation.</p>
        <p className="mt-3 text-sm leading-6 text-muted">The listed range is indicative per square foot.</p>
      </div>
      <a href="tel:+919849256799" className="button-primary mt-6 w-full sm:w-auto">
        Request consultation <ArrowRight size={17} aria-hidden="true" />
      </a>
    </div>
  );
}

export function ProductDetailPage({ product, source }: Props) {
  const reduceMotion = useReducedMotion();
  const isCeiling = product.category === "CEILING";

  return (
    <main id="main-content" className="min-h-screen bg-ivory pb-20 sm:pb-28">
      <section className="border-b border-border bg-cream/70 px-page py-5 sm:py-6">
        <div className="mx-auto flex max-w-container-site items-center justify-between gap-4">
          <Link href="/catalogue" className="text-link">
            <ArrowLeft size={15} aria-hidden="true" /> Back to catalogue
          </Link>
          <p className="hidden text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted sm:block">SleepExcellent product detail</p>
        </div>
      </section>

      <section className="px-page pt-8 sm:pt-12 lg:pt-16">
        <div className="mx-auto grid max-w-container-site gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(23rem,0.92fr)] lg:items-start lg:gap-14 xl:gap-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductMediaGallery product={product} />
          </motion.div>

          <motion.div
            className="lg:sticky lg:top-28"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.54, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-burgundy">{categoryLabels[product.category]}</p>
            <h1 className="mt-4 font-serif text-[clamp(3.4rem,6vw,6.35rem)] leading-[0.86] tracking-[-0.055em] text-charcoal">{product.name}</h1>
            <p className="mt-7 font-serif text-3xl tracking-[-0.03em] text-charcoal sm:text-4xl">{productPrice(product)}</p>
            {isCeiling && <p className="mt-2 text-sm text-muted">Indicative range per square foot</p>}

            {(product.configuration || product.size || product.suitability) && (
              <dl className="detail-facts mt-8">
                {product.configuration && <div><dt>Configuration</dt><dd>{product.configuration}</dd></div>}
                {product.size && <div><dt>Supplied size</dt><dd>{product.size}</dd></div>}
                {product.suitability && <div><dt>Best suited for</dt><dd>{product.suitability}</dd></div>}
              </dl>
            )}

            {isCeiling ? <CeilingPanel /> : <DirectPurchasePanel product={product} />}
            {source === "seed" && <p className="mt-6 text-xs leading-5 text-muted">Local authoritative seed preview. Supabase-backed reads activate when the server database connection is configured.</p>}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
