"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { ArrowRight, ImageOff, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import type { CatalogueRead } from "@/lib/catalogue/repository";
import { productPrice } from "@/lib/catalogue/presentation";
import { getProductPrimaryMedia } from "@/lib/catalogue/media";
import { categoryLabels, catalogueCategories, type CatalogueCategory, type CatalogueSort } from "@/lib/catalogue/types";

type Props = CatalogueRead & {
  activeCategory?: CatalogueCategory;
  activeSearch?: string;
  activeSort: CatalogueSort;
};

function toHref(category?: CatalogueCategory, q?: string, sort: CatalogueSort = "featured") {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q) params.set("q", q);
  if (sort !== "featured") params.set("sort", sort);
  const query = params.toString();
  return query ? `/catalogue?${query}` : "/catalogue";
}

export function CataloguePage({ products, source, error, activeCategory, activeSearch, activeSort }: Props) {
  const searchInput = useRef<HTMLInputElement>(null);
  const resultLabel = useMemo(() => `${products.length} ${products.length === 1 ? "listed option" : "listed options"}`, [products.length]);

  useEffect(() => {
    if (window.location.hash === "search") searchInput.current?.focus();
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-ivory pb-24">
      <h1 className="sr-only">SleepExcellent catalogue</h1>
      <section aria-labelledby="catalogue-controls" className="px-page pt-8 sm:pt-10">
        <div className="mx-auto max-w-container-site">
          <h2 id="catalogue-controls" className="sr-only">Catalogue controls</h2>
          <form action="/catalogue" className="rounded-sm border border-border bg-white p-4 shadow-[0_12px_38px_rgba(36,35,33,0.05)] sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_13rem]">
              <label className="relative block">
                <span className="sr-only">Search by product or model name</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-burgundy" size={18} aria-hidden="true" />
                <input ref={searchInput} id="search" name="q" defaultValue={activeSearch} placeholder="Search by product or model name" className="catalogue-input pl-11" />
              </label>
              <label className="relative block">
                <span className="sr-only">Sort catalogue</span>
                <select name="sort" defaultValue={activeSort} className="catalogue-input appearance-none pr-10">
                  <option value="featured">Featured order</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
                <SlidersHorizontal className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-burgundy" size={17} aria-hidden="true" />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <span className="mr-1 text-[0.65rem] font-bold uppercase tracking-[0.17em] text-muted">Collection</span>
              <Link href={toHref(undefined, activeSearch, activeSort)} aria-current={!activeCategory ? "page" : undefined} className={`filter-chip ${!activeCategory ? "filter-chip-active" : ""}`}>All collections</Link>
              {catalogueCategories.map((category) => (
                <Link key={category} href={toHref(category, activeSearch, activeSort)} aria-current={activeCategory === category ? "page" : undefined} className={`filter-chip ${activeCategory === category ? "filter-chip-active" : ""}`}>
                  {categoryLabels[category]}
                </Link>
              ))}
              <button type="submit" className="ml-auto button-primary min-h-10 px-4 py-2 text-[0.6rem]">Apply</button>
              {(activeCategory || activeSearch || activeSort !== "featured") && <Link href="/catalogue" className="catalogue-reset"><RotateCcw size={14} aria-hidden="true" /> Clear</Link>}
            </div>
          </form>
        </div>
      </section>

      <section aria-live="polite" className="px-page pt-8 sm:pt-10">
        <div className="mx-auto max-w-container-site">
          <div className="mb-6 flex items-end justify-between gap-5">
            <div>
              <p className="text-[0.67rem] font-bold uppercase tracking-[0.2em] text-burgundy">{activeCategory ? categoryLabels[activeCategory] : "All collections"}</p>
              <h2 className="mt-2 font-serif text-4xl tracking-[-0.035em] text-charcoal sm:text-5xl">{resultLabel}</h2>
            </div>
            {source === "seed" && <p className="max-w-xs text-right text-xs leading-5 text-muted">Local authoritative seed preview. Supabase-backed reads activate when the server database connection is configured.</p>}
          </div>

          {error ? (
            <div role="alert" className="catalogue-state">
              <p className="font-serif text-3xl text-charcoal">The catalogue is temporarily unavailable.</p>
              <p className="mt-3 max-w-lg leading-7 text-muted">Please refresh or contact the SleepExcellent team for product guidance.</p>
              <a href="tel:+919849256799" className="button-primary mt-6">Call SleepExcellent</a>
            </div>
          ) : products.length === 0 ? (
            <div className="catalogue-state">
              <p className="font-serif text-3xl text-charcoal">No matching models found.</p>
              <p className="mt-3 max-w-lg leading-7 text-muted">Try another product or model name, or reset the collection and sort controls.</p>
              <Link href="/catalogue" className="button-primary mt-6">Reset catalogue <RotateCcw size={15} aria-hidden="true" /></Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <CatalogueCardMedia key={product.slug} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function CatalogueCardMedia({ product, index }: { product: Props["products"][number]; index: number }) {
  const primary = getProductPrimaryMedia(product);
  return (
    <article className="catalogue-card group">
      <div className="catalogue-media" aria-label={primary ? undefined : "Product media pending client mapping"}>
        {primary ? <Image src={primary.src} alt="" fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.035]" /> : <div className="relative z-10 flex h-full flex-col justify-between p-5"><span className="w-fit border border-burgundy/25 bg-ivory/85 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.17em] text-burgundy">Media pending</span><ImageOff className="text-burgundy/55" size={30} strokeWidth={1.2} aria-hidden="true" /></div>}
        <span aria-hidden="true" className="catalogue-number">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.19em] text-burgundy">{categoryLabels[product.category]}</p>
        <h3 className="mt-3 min-h-14 font-serif text-[2rem] leading-[0.92] tracking-[-0.035em] text-charcoal">{product.name}</h3>
        {(product.configuration || product.size || product.suitability) && <p className="mt-4 min-h-10 text-sm leading-6 text-muted">{product.configuration ?? product.size ?? product.suitability}</p>}
        <p className="mt-5 text-lg font-semibold tracking-[-0.025em] text-charcoal">{productPrice(product)}</p>
        <div className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted">{product.category === "CEILING" ? "Indicative range. Request a consultation for a final quotation." : "Standard listed configuration. Final ordering is completed in the approved commerce journey."}</div>
        <Link href={`/products/${product.slug}`} className="text-link mt-5">View details <ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
