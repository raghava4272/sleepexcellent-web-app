"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ChevronDown,
  Mail,
  Menu,
  MessageCircle,
  Minus,
  Phone,
  Play,
  Plus,
  Search,
  ShoppingBag,
  ThumbsUp,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  bedModels,
  benefits,
  categories,
  ceilingTypes,
  contact,
  mattressModels,
  media,
  principles,
  products,
  sofaModels,
  testimonials,
  type Category,
  type Product,
} from "@/lib/site-data";

const navItems = [
  {
    label: "Mattresses",
    href: "#mattresses",
    submenu: mattressModels,
  },
  { label: "Sofas", href: "#sofas", submenu: sofaModels },
  { label: "Beds", href: "#beds", submenu: bedModels },
  { label: "Interiors", href: "#interiors", submenu: ceilingTypes },
  { label: "Shop", href: "#products", submenu: null },
  { label: "About Us", href: "#about", submenu: null },
] as const;

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a
      href="#top"
      className="group inline-flex shrink-0 flex-col leading-none outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-4"
      aria-label="SleepExcellent home"
    >
      <span
        className={`font-serif text-[1.8rem] italic tracking-[-0.045em] sm:text-[2.12rem] ${
          light ? "text-ivory" : "text-charcoal"
        }`}
      >
        Sleep <span className="font-semibold text-burgundy">EX</span>
        <span>cellent</span>
      </span>
      <span
        className={`mt-1 flex items-center gap-2 text-[0.43rem] font-semibold tracking-[0.3em] ${
          light ? "text-stone-400" : "text-muted"
        }`}
      >
        <i
          aria-hidden="true"
          className={`h-px w-5 ${light ? "bg-stone-600" : "bg-border"}`}
        />
        MATTRESSES &amp; INTERIORS
        <i
          aria-hidden="true"
          className={`h-px w-5 ${light ? "bg-stone-600" : "bg-border"}`}
        />
      </span>
    </a>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`min-w-0 ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <div
      className={`mb-5 flex items-center gap-3 text-[0.69rem] font-bold uppercase tracking-[0.24em] ${
        light ? "text-stone-300" : "text-burgundy"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-px w-8 ${light ? "bg-burgundy" : "bg-burgundy"}`}
      />
      {children}
    </div>
  );
}

function TopContactBar() {
  return (
    <div className="bg-footer text-stone-200">
      <div className="mx-auto flex h-[35px] max-w-site items-center justify-between gap-4 px-page text-[0.67rem] font-medium tracking-[0.04em] sm:text-xs">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Phone size={13} strokeWidth={1.7} aria-hidden="true" />
          <a
            className="whitespace-nowrap transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
            href={contact.primaryPhoneHref}
          >
            {contact.primaryPhoneDisplay}
          </a>
          <span
            aria-hidden="true"
            className="hidden h-3 w-px bg-stone-600 sm:block"
          />
          <a
            className="hidden whitespace-nowrap transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy sm:block"
            href={contact.secondaryPhoneHref}
          >
            {contact.secondaryPhoneDisplay}
          </a>
        </div>
        <a
          className="flex min-w-0 items-center gap-2 whitespace-nowrap transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
          href={contact.emailHref}
        >
          <Mail
            size={13}
            strokeWidth={1.7}
            aria-hidden="true"
            className="shrink-0"
          />
          <span className="max-w-[47vw] truncate">{contact.email}</span>
        </a>
      </div>
    </div>
  );
}

function SiteHeader({
  cartCount,
  onCartOpen,
}: {
  cartCount: number;
  onCartOpen: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-border/80 bg-ivory/95 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "shadow-[0_8px_30px_rgba(36,35,33,0.07)]" : ""
        }`}
      >
        <div
          className={`mx-auto flex max-w-site items-center justify-between gap-6 px-page transition-[height] duration-300 ${
            scrolled ? "h-[72px] lg:h-[76px]" : "h-[76px] lg:h-[92px]"
          }`}
        >
          <Logo />
          <nav
            className="hidden h-full items-center gap-7 xl:flex"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => (
              <div
                key={item.href}
                className="nav-menu relative flex h-full items-center"
              >
                <a
                  href={item.href}
                  className="nav-link relative py-4 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-charcoal outline-none transition-colors hover:text-burgundy focus-visible:text-burgundy"
                >
                  {item.label}
                </a>
                {item.submenu && (
                  <div
                    className="nav-dropdown pointer-events-none invisible absolute left-1/2 top-full z-[60] w-[min(920px,88vw)] pt-2 opacity-0 transition-all duration-200"
                    aria-label={`${item.label} categories`}
                  >
                    <div className="border border-border bg-ivory px-8 py-7 shadow-[0_24px_70px_rgba(36,35,33,0.16)]">
                      <div className="mb-5 flex items-end justify-between gap-6 border-b border-border pb-4">
                        <div>
                          <span className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-burgundy">
                            Explore collection
                          </span>
                          <p className="mt-1 font-serif text-3xl text-charcoal">
                            {item.label}
                          </p>
                        </div>
                        <a
                          href={item.href}
                          className="inline-flex min-h-11 items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-charcoal transition-colors hover:text-burgundy"
                        >
                          View all
                          <ArrowRight size={14} />
                        </a>
                      </div>
                      <ul
                        className={
                          item.submenu.length > 10
                            ? "grid grid-cols-4 gap-x-8"
                            : "grid grid-cols-2 gap-x-10"
                        }
                      >
                        {item.submenu.map((model, index) => (
                          <li key={model}>
                            <a
                              href={item.href}
                              className="group/item flex min-h-10 items-center gap-3 border-b border-border/80 py-2.5 text-[0.74rem] leading-5 text-muted transition-colors hover:text-burgundy"
                            >
                              <span className="w-5 shrink-0 text-[0.55rem] font-bold tracking-[0.1em] text-burgundy/70">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="flex-1">{model}</span>
                              <ArrowRight
                                size={12}
                                className="shrink-0 opacity-0 transition-all group-hover/item:translate-x-0.5 group-hover/item:opacity-100"
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Search (coming soon)"
              className="icon-button hidden sm:inline-flex"
            >
              <Search size={18} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              aria-label="Account (coming soon)"
              className="icon-button hidden lg:inline-flex"
            >
              <UserRound size={18} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              aria-label={`Open shopping cart with ${cartCount} ${
                cartCount === 1 ? "item" : "items"
              }`}
              className="icon-button relative"
              onClick={onCartOpen}
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-burgundy px-1 text-[0.58rem] font-bold leading-none text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <span
              aria-hidden="true"
              className="mx-1 hidden h-5 w-px bg-border sm:block xl:hidden"
            />
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="icon-button xl:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-[70] bg-charcoal/50 backdrop-blur-sm xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="fixed right-0 top-0 z-[80] flex h-dvh w-[min(90vw,420px)] flex-col bg-ivory px-6 py-6 shadow-2xl xl:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
                <Logo />
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  className="icon-button"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={21} strokeWidth={1.6} />
                </button>
              </div>

              <nav className="mt-7 flex-1" aria-label="Mobile navigation">
                <details className="group border-b border-border py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.2em]">
                    Collections
                    <ChevronDown
                      size={17}
                      className="transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <div className="mt-4 grid gap-1 pl-3">
                    {navItems.slice(0, 4).map((item) => (
                      <a
                        key={item.href}
                        className="min-h-11 py-3 font-serif text-2xl text-charcoal transition-colors hover:text-burgundy"
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </details>
                <a
                  className="flex min-h-14 items-center border-b border-border py-4 text-xs font-bold uppercase tracking-[0.2em]"
                  href="#products"
                  onClick={() => setMenuOpen(false)}
                >
                  Shop Products
                </a>
                <a
                  className="flex min-h-14 items-center border-b border-border py-4 text-xs font-bold uppercase tracking-[0.2em]"
                  href="#about"
                  onClick={() => setMenuOpen(false)}
                >
                  About Us
                </a>
                <a
                  className="flex min-h-14 items-center border-b border-border py-4 text-xs font-bold uppercase tracking-[0.2em]"
                  href="#consultation"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </a>
              </nav>

              <div className="border-t border-border pt-6 text-sm text-muted">
                <p className="mb-3 font-serif text-xl text-charcoal">
                  Exceptional comfort.
                  <br />
                  Beautifully crafted.
                </p>
                <a
                  className="mb-2 flex items-center gap-2"
                  href={contact.primaryPhoneHref}
                >
                  <Phone size={15} />
                  {contact.primaryPhoneDisplay}
                </a>
                <a
                  className="flex items-center gap-2"
                  href={contact.emailHref}
                >
                  <Mail size={15} />
                  {contact.email}
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [heroSlide, setHeroSlide] = useState(0);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const activeHeroSlide = reduceMotion ? 1 : heroSlide;

  useEffect(() => {
    if (reduceMotion) return;
    const timeout = window.setTimeout(() => {
      setHeroSlide((current) => (current === 0 ? 1 : 0));
    }, 6500);
    return () => window.clearTimeout(timeout);
  }, [heroSlide, reduceMotion]);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    if (activeHeroSlide === 0) {
      void video.play().catch(() => {
        // The mattress poster remains visible if autoplay is unavailable.
      });
    } else {
      video.pause();
    }
  }, [activeHeroSlide]);

  const heroItems = {
    hidden: { opacity: 0, y: 18 },
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reduceMotion ? 0 : 0.12 + index * 0.1,
        duration: reduceMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-[660px] overflow-hidden bg-charcoal sm:min-h-[700px] lg:h-[calc(100svh-92px)] lg:min-h-[680px] lg:max-h-[940px]"
    >
      <div className="absolute inset-0">
        <Image
          unoptimized
          src={media.mattress}
          alt="Premium SleepExcellent mattress collection in a refined bedroom"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[61%_center] sm:object-[58%_center] lg:object-center"
        />
        {!reduceMotion && (
          <video
            ref={heroVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={media.mattress}
            aria-hidden="true"
            tabIndex={-1}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
              activeHeroSlide === 0 ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src={media.mattressVideo} type="video/mp4" />
            Your browser does not support this background video. The mattress
            image remains available as a fallback.
          </video>
        )}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,22,20,0.86)_0%,rgba(24,22,20,0.66)_42%,rgba(24,22,20,0.12)_78%)] max-sm:bg-[linear-gradient(90deg,rgba(24,22,20,0.83)_0%,rgba(24,22,20,0.6)_70%,rgba(24,22,20,0.28)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
      <div className="relative mx-auto flex h-full min-h-[660px] max-w-site items-end px-page pb-20 pt-24 sm:min-h-[700px] sm:items-center sm:pb-16 lg:min-h-[680px]">
        <div className="max-w-[730px] text-white">
          <motion.div
            custom={0}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            variants={heroItems}
            className="mb-6 flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.26em] text-stone-200"
          >
            <span className="h-px w-9 bg-burgundy" />
            SleepExcellent Collection
          </motion.div>
          <motion.h1
            id="hero-title"
            custom={1}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            variants={heroItems}
            className="text-balance font-serif text-[clamp(3.3rem,7vw,6.85rem)] leading-[0.88] tracking-[-0.045em]"
          >
            Comfort, crafted to elevate every room.
          </motion.h1>
          <motion.p
            custom={2}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            variants={heroItems}
            className="mt-7 max-w-[640px] text-[0.98rem] leading-7 text-stone-200 sm:text-lg sm:leading-8"
          >
            Discover premium mattresses, beautifully designed sofas,
            handcrafted beds and refined ceiling solutions created for modern
            living.
          </motion.p>
          <motion.div
            custom={3}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            variants={heroItems}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a className="button-primary" href="#collections">
              Explore Collections
              <ArrowRight size={17} />
            </a>
            <a className="button-ghost-light" href={contact.primaryPhoneHref}>
              Talk to Our Experts
            </a>
          </motion.div>
          <motion.a
            custom={4}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            variants={heroItems}
            className="mt-6 inline-flex items-center gap-2 text-xs tracking-[0.04em] text-stone-300 transition-colors hover:text-white"
            href={contact.primaryPhoneHref}
          >
            <Phone size={14} />
            Need guidance? Call {contact.primaryPhoneDisplay}
          </motion.a>
        </div>
      </div>
      <a
        href="#introduction"
        aria-label="Scroll to introduction"
        className="absolute bottom-8 right-page hidden items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/75 lg:flex"
      >
        Discover
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30">
          <ChevronDown size={16} />
        </span>
      </a>
    </section>
  );
}

function BrandIntroduction() {
  return (
    <section
      id="introduction"
      aria-labelledby="introduction-title"
      className="bg-ivory px-page py-section"
    >
      <Reveal className="mx-auto max-w-[850px] text-center">
        <div className="mb-6 text-[0.68rem] font-bold uppercase tracking-[0.26em] text-burgundy">
          Designed for better living
        </div>
        <span
          aria-hidden="true"
          className="mx-auto mb-8 block h-px w-12 bg-burgundy"
        />
        <h2
          id="introduction-title"
          className="text-balance font-serif text-display text-charcoal"
        >
          Premium comfort, from your bedroom to your interiors.
        </h2>
        <p className="mx-auto mt-7 max-w-[780px] text-pretty text-base leading-8 text-muted sm:text-lg">
          At SleepExcellent, every product combines thoughtful design,
          dependable materials and carefully considered comfort. From
          supportive mattresses to statement furniture and elegant ceiling
          finishes, our collections are designed to make everyday spaces feel
          exceptional.
        </p>
      </Reveal>
    </section>
  );
}

function CategoryCard({
  category,
  className = "",
}: {
  category: Category;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <a
        href={category.href}
        className="group relative block h-full min-h-[480px] overflow-hidden bg-charcoal outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-4 sm:min-h-[540px]"
      >
        <Image
          unoptimized
          src={category.image}
          alt={category.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          style={{ objectPosition: category.position }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/18 to-transparent transition-colors group-hover:from-black/90" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9 lg:p-10">
          <div className="mb-3 text-[0.64rem] font-bold uppercase tracking-[0.24em] text-stone-300">
            {category.eyebrow}
          </div>
          <h3 className="font-serif text-4xl tracking-[-0.025em] sm:text-5xl">
            {category.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-stone-200 sm:text-base">
            {category.description}
          </p>
          <div className="mt-7 flex items-end justify-between gap-6 border-t border-white/25 pt-5">
            <span className="text-[0.66rem] font-bold uppercase tracking-[0.17em] text-stone-300">
              {category.count}
            </span>
            <span className="inline-flex items-center gap-2 text-[0.67rem] font-bold uppercase tracking-[0.16em]">
              Explore
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>
      </a>
    </Reveal>
  );
}

function CategoryShowcase() {
  return (
    <section
      id="collections"
      aria-labelledby="collections-title"
      className="bg-white px-page py-section"
    >
      <div className="mx-auto max-w-site">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end lg:mb-16">
          <div>
            <SectionLabel>Explore by collection</SectionLabel>
            <h2
              id="collections-title"
              className="max-w-3xl text-balance font-serif text-display text-charcoal"
            >
              Four ways to make a space feel exceptional.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-muted">
            From the way you rest to the rooms you gather in, discover
            considered comfort for every part of home.
          </p>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          <CategoryCard
            category={categories[0]}
            className="lg:col-span-7"
          />
          <CategoryCard
            category={categories[1]}
            className="lg:col-span-5"
          />
          <CategoryCard
            category={categories[2]}
            className="lg:col-span-5"
          />
          <CategoryCard
            category={categories[3]}
            className="lg:col-span-7"
          />
        </div>
      </div>
    </section>
  );
}

type CartLine = {
  product: Product;
  quantity: number;
};

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function ProductCard({
  product,
  onAdd,
  onBuy,
}: {
  product: Product;
  onAdd: (product: Product) => void;
  onBuy: (product: Product) => void;
}) {
  return (
    <article className="group flex min-w-0 flex-col border border-border bg-ivory">
      <div className="relative aspect-[11/7] overflow-hidden bg-cream">
        <Image
          unoptimized
          src={product.image}
          alt={product.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
        />
        <span className="absolute left-4 top-4 bg-ivory/95 px-3 py-2 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-burgundy backdrop-blur-sm">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted">
          Product {product.id}
        </p>
        <h3 className="mt-2 min-h-[3.4rem] font-serif text-[1.65rem] leading-[1.04] text-charcoal">
          {product.name}
        </h3>
        <p className="mt-4 text-lg font-semibold text-charcoal">
          {priceFormatter.format(product.price)}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="min-h-12 border border-charcoal px-3 text-[0.6rem] font-bold uppercase tracking-[0.13em] text-charcoal transition-colors hover:border-burgundy hover:bg-burgundy hover:text-white"
            onClick={() => onAdd(product)}
          >
            Add to Cart
          </button>
          <button
            type="button"
            className="min-h-12 bg-charcoal px-3 text-[0.6rem] font-bold uppercase tracking-[0.13em] text-white transition-colors hover:bg-deep-burgundy"
            onClick={() => onBuy(product)}
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}

function FeaturedProducts({
  onAdd,
  onBuy,
}: {
  onAdd: (product: Product) => void;
  onBuy: (product: Product) => void;
}) {
  return (
    <section
      id="products"
      aria-labelledby="products-title"
      className="scroll-mt-24 bg-cream px-page py-section"
    >
      <div className="mx-auto max-w-site">
        <Reveal className="mb-12 grid gap-6 border-b border-border pb-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <SectionLabel>Shop our products</SectionLabel>
            <h2
              id="products-title"
              className="max-w-3xl text-balance font-serif text-display text-charcoal"
            >
              Crafted pieces for considered homes.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-muted lg:justify-self-end">
            Explore every bed and sofa design in our current product edit.
            Prices shown are for the featured configuration; our team can help
            with sizing, fabrics and finishes.
          </p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={(index % 4) * 0.04}>
              <ProductCard
                product={product}
                onAdd={onAdd}
                onBuy={onBuy}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CartDrawer({
  open,
  items,
  onClose,
  onQuantityChange,
  onRemove,
}: {
  open: boolean;
  items: CartLine[];
  onClose: () => void;
  onQuantityChange: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
}) {
  const [checkoutMessage, setCheckoutMessage] = useState(false);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCheckoutMessage(false);
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close shopping cart"
            className="fixed inset-0 z-[90] bg-charcoal/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setCheckoutMessage(false);
              onClose();
            }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="fixed right-0 top-0 z-[100] flex h-dvh w-full max-w-[520px] flex-col bg-ivory shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-7">
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-burgundy">
                  Your selection
                </p>
                <h2
                  id="cart-title"
                  className="mt-1 font-serif text-3xl text-charcoal"
                >
                  Shopping Cart
                </h2>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close shopping cart"
                onClick={() => {
                  setCheckoutMessage(false);
                  onClose();
                }}
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
              {items.length === 0 ? (
                <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
                  <ShoppingBag
                    size={36}
                    strokeWidth={1.25}
                    className="text-burgundy"
                  />
                  <h3 className="mt-5 font-serif text-3xl text-charcoal">
                    Your cart is empty.
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
                    Add a featured bed or sofa to begin your selection.
                  </p>
                  <button
                    type="button"
                    className="text-link mt-6"
                    onClick={() => {
                      setCheckoutMessage(false);
                      onClose();
                    }}
                  >
                    Continue Shopping
                    <ArrowRight size={15} />
                  </button>
                </div>
              ) : (
                <ul className="grid gap-5">
                  {items.map(({ product, quantity }) => (
                    <li
                      key={product.id}
                      className="grid grid-cols-[104px_1fr] gap-4 border-b border-border pb-5"
                    >
                      <div className="relative aspect-square overflow-hidden bg-cream">
                        <Image
                          unoptimized
                          src={product.image}
                          alt=""
                          fill
                          sizes="104px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[0.56rem] font-bold uppercase tracking-[0.16em] text-burgundy">
                          {product.category}
                        </p>
                        <h3 className="mt-1 font-serif text-xl leading-tight text-charcoal">
                          {product.name}
                        </h3>
                        <p className="mt-2 text-sm font-semibold text-charcoal">
                          {priceFormatter.format(product.price)}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <div
                            className="flex items-center border border-border bg-white"
                            aria-label={`Quantity for ${product.name}`}
                          >
                            <button
                              type="button"
                              className="flex h-10 w-10 items-center justify-center transition-colors hover:text-burgundy disabled:opacity-40"
                              aria-label={`Decrease quantity of ${product.name}`}
                              disabled={quantity === 1}
                              onClick={() =>
                                onQuantityChange(product.id, -1)
                              }
                            >
                              <Minus size={14} />
                            </button>
                            <span
                              className="min-w-8 text-center text-sm font-semibold"
                              aria-live="polite"
                            >
                              {quantity}
                            </span>
                            <button
                              type="button"
                              className="flex h-10 w-10 items-center justify-center transition-colors hover:text-burgundy"
                              aria-label={`Increase quantity of ${product.name}`}
                              onClick={() =>
                                onQuantityChange(product.id, 1)
                              }
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            className="flex min-h-10 items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted transition-colors hover:text-burgundy"
                            onClick={() => onRemove(product.id)}
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border bg-white px-5 py-5 sm:px-7">
                <div className="flex items-end justify-between gap-5">
                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted">
                      Subtotal · {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                    <p className="mt-1 font-serif text-3xl text-charcoal">
                      {priceFormatter.format(subtotal)}
                    </p>
                  </div>
                  <p className="max-w-[160px] text-right text-[0.65rem] leading-5 text-muted">
                    Delivery and configuration confirmed during consultation.
                  </p>
                </div>
                <button
                  type="button"
                  className="button-primary mt-5 w-full"
                  onClick={() => setCheckoutMessage(true)}
                >
                  Continue to Checkout
                  <ArrowRight size={16} />
                </button>
                {checkoutMessage && (
                  <p
                    className="mt-3 border border-burgundy/25 bg-cream px-4 py-3 text-center text-xs leading-5 text-muted"
                    role="status"
                  >
                    Online checkout is coming soon. Your selection is ready for
                    a SleepExcellent product consultation.
                  </p>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function ModelList({
  models,
  dark = false,
}: {
  models: readonly string[];
  dark?: boolean;
}) {
  return (
    <ol className="grid sm:grid-cols-2">
      {models.map((model, index) => (
        <li
          key={model}
          className={`group flex min-h-[58px] items-center gap-3 border-b py-3.5 pr-3 text-[0.82rem] leading-5 ${
            dark
              ? "border-white/12 text-stone-200"
              : "border-border text-charcoal"
          } sm:odd:pr-5 sm:even:pl-5`}
        >
          <span
            className={`w-6 shrink-0 text-[0.6rem] font-bold tracking-[0.14em] ${
              dark ? "text-stone-500" : "text-burgundy"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="flex-1">{model}</span>
          <ArrowRight
            aria-hidden="true"
            size={14}
            className={`shrink-0 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 ${
              dark ? "text-burgundy" : "text-burgundy"
            }`}
          />
        </li>
      ))}
    </ol>
  );
}

function EditorialVideo({
  videoSrc,
  posterSrc,
  alt,
  className = "",
  objectPosition = "center",
}: {
  videoSrc: string;
  posterSrc: string;
  alt: string;
  className?: string;
  objectPosition?: string;
}) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, {
    once: true,
    margin: "400px 0px",
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-stone-200 ${className}`}
      aria-label={alt}
    >
      {reduceMotion ? (
        <Image
          unoptimized
          src={posterSrc}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      ) : (
        <video
          className="h-full w-full object-cover"
          style={{ objectPosition }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          src={inView ? videoSrc : undefined}
          aria-hidden="true"
          tabIndex={-1}
        >
          Your browser does not support this background video. The collection
          image remains available as a fallback.
        </video>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
      />
      <div className="absolute bottom-5 left-5 flex items-center gap-2 text-[0.61rem] font-bold uppercase tracking-[0.19em] text-white drop-shadow-md sm:bottom-7 sm:left-7">
        <span className="h-px w-8 bg-white/80" />
        Collection film
      </div>
    </div>
  );
}

function MattressCollection() {
  return (
    <section
      id="mattresses"
      aria-labelledby="mattress-title"
      className="scroll-mt-24 bg-ivory py-section"
    >
      <div className="mx-auto grid max-w-site gap-10 px-page lg:grid-cols-2 lg:items-center lg:gap-16 xl:gap-24">
        <Reveal className="relative min-h-[470px] overflow-hidden sm:min-h-[600px] lg:min-h-[760px]">
          <Image
            unoptimized
            src={media.mattress}
            alt="Premium SleepExcellent mattress collection"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[62%_center]"
          />
          <div className="absolute left-0 top-0 h-28 w-28 border-l border-t border-white/70" />
          <div className="absolute bottom-7 left-7 bg-white/94 px-5 py-4 backdrop-blur sm:bottom-9 sm:left-9">
            <span className="block font-serif text-3xl text-charcoal">10</span>
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted">
              Comfort profiles
            </span>
          </div>
        </Reveal>
        <Reveal>
          <SectionLabel>Mattress collection</SectionLabel>
          <h2
            id="mattress-title"
            className="text-balance font-serif text-display text-charcoal"
          >
            Find the comfort that fits you.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted">
            From firm orthopaedic support to responsive latex and
            pressure-relieving memory foam, explore mattresses designed for
            different bodies, lifestyles and sleeping preferences.
          </p>
          <div className="mt-8">
            <ModelList models={mattressModels} />
          </div>
          <a className="text-link mt-9" href="#consultation">
            View Mattress Collection
            <ArrowRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section aria-label="Why choose SleepExcellent" className="bg-cream">
      <div className="mx-auto grid max-w-site px-page sm:grid-cols-2 xl:grid-cols-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Reveal
              key={benefit.title}
              delay={index * 0.06}
              className="border-b border-border py-10 sm:px-7 sm:odd:border-r xl:border-b-0 xl:border-r xl:first:pl-0 xl:last:border-r-0 xl:last:pr-0"
            >
              <Icon
                size={27}
                strokeWidth={1.35}
                className="mb-5 text-burgundy"
                aria-hidden="true"
              />
              <h3 className="font-serif text-2xl text-charcoal">
                {benefit.title}
              </h3>
              <p className="mt-2 max-w-[280px] text-sm leading-6 text-muted">
                {benefit.description}
              </p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function SofaCollection() {
  return (
    <section
      id="sofas"
      aria-labelledby="sofa-title"
      className="scroll-mt-24 bg-white py-section"
    >
      <div className="mx-auto grid max-w-site gap-10 px-page lg:grid-cols-[1fr_0.95fr] lg:items-start lg:gap-16 xl:gap-24">
        <Reveal>
          <SectionLabel>Sofa collection</SectionLabel>
          <h2
            id="sofa-title"
            className="text-balance font-serif text-display text-charcoal"
          >
            Seating designed around the way you live.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted">
            Explore compact statement sofas, expansive family configurations
            and timeless silhouettes designed to combine visual character with
            lasting comfort.
          </p>
          <div className="mt-8">
            <ModelList models={sofaModels} />
          </div>
          <a className="text-link mt-9" href="#consultation">
            Explore Sofa Models
            <ArrowRight size={16} />
          </a>
        </Reveal>
        <Reveal className="order-first lg:order-last lg:sticky lg:top-28">
          <EditorialVideo
            videoSrc={media.sofaVideo}
            posterSrc={media.sofa}
            alt="SleepExcellent sofa collection film"
            className="aspect-[4/3] min-h-[380px] lg:aspect-[3/4] lg:min-h-[700px]"
            objectPosition="center"
          />
        </Reveal>
      </div>
    </section>
  );
}

function BedCollection() {
  return (
    <section
      id="beds"
      aria-labelledby="bed-title"
      className="scroll-mt-24 bg-footer py-section text-white"
    >
      <div className="mx-auto grid max-w-site gap-0 px-page lg:grid-cols-[1.07fr_0.93fr]">
        <Reveal>
          <EditorialVideo
            videoSrc={media.bedVideo}
            posterSrc={media.bed}
            alt="SleepExcellent bed collection film"
            className="aspect-[4/3] min-h-[390px] lg:h-full lg:min-h-[820px]"
            objectPosition="center"
          />
        </Reveal>
        <Reveal className="bg-[#f2ede4] p-7 text-charcoal sm:p-10 lg:p-12 xl:p-16">
          <SectionLabel>Bed collection</SectionLabel>
          <h2
            id="bed-title"
            className="text-balance font-serif text-display text-charcoal"
          >
            Beds that make the room feel complete.
          </h2>
          <p className="mt-6 text-base leading-7 text-muted">
            Discover expressive headboards, warm wood finishes and timeless
            forms designed to create an inviting bedroom centrepiece.
          </p>
          <div className="mt-8">
            <ModelList models={bedModels} />
          </div>
          <a className="text-link mt-9" href="#consultation">
            Discover Bed Designs
            <ArrowRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function CeilingCollection() {
  return (
    <section
      id="interiors"
      aria-labelledby="interiors-title"
      className="scroll-mt-24 overflow-hidden bg-cream py-section"
    >
      <div className="mx-auto grid max-w-site gap-10 px-page lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-14 xl:gap-20">
        <Reveal className="relative aspect-[4/3] w-full min-w-0 overflow-hidden lg:aspect-auto lg:h-[720px]">
          <Image
            unoptimized
            src={media.interior}
            alt="SleepExcellent decorative ceiling interior"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-[center_25%] transition-transform duration-700 hover:scale-[1.025]"
          />
          <div className="absolute inset-5 border border-white/45" />
        </Reveal>
        <Reveal className="relative z-10 w-full min-w-0 lg:pl-2">
          <SectionLabel>Interior solutions</SectionLabel>
          <h2
            id="interiors-title"
            className="text-balance font-serif text-display text-charcoal"
          >
            Ceiling solutions that transform the atmosphere.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted">
            From clean gypsum profiles to natural wood, acoustic systems and
            decorative glass, our ceiling solutions add depth, proportion and
            visual identity to interiors.
          </p>
          <ol className="mt-9 grid sm:grid-cols-2">
            {ceilingTypes.map((item, index) => (
              <li
                key={item}
                className="flex min-h-16 items-center gap-3 border-b border-border py-4 pr-3 sm:odd:pr-5 sm:even:pl-5"
              >
                <span className="text-[0.6rem] font-bold tracking-[0.13em] text-burgundy">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-charcoal">{item}</span>
              </li>
            ))}
          </ol>
          <a className="text-link mt-9" href="#consultation">
            Explore Interior Solutions
            <ArrowRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section
      id="about"
      aria-labelledby="story-title"
      className="scroll-mt-24 bg-ivory px-page py-section"
    >
      <div className="mx-auto max-w-site">
        <Reveal className="grid gap-7 border-b border-border pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:pb-16">
          <div>
            <SectionLabel>The SleepExcellent approach</SectionLabel>
            <h2
              id="story-title"
              className="text-balance font-serif text-display text-charcoal"
            >
              Considered design. Dependable comfort.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-muted lg:justify-self-end lg:text-lg">
            We believe premium living begins with products that feel as good as
            they look. Our collections bring together thoughtful proportions,
            practical comfort and finishes selected to complement contemporary
            Indian homes.
          </p>
        </Reveal>
        <div className="grid lg:grid-cols-3">
          {principles.map((principle, index) => (
            <Reveal
              key={principle.number}
              delay={index * 0.08}
              className="border-b border-border py-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-14 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <span className="font-serif text-6xl text-burgundy/22">
                {principle.number}
              </span>
              <h3 className="mt-8 font-serif text-3xl text-charcoal">
                {principle.title}
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
                {principle.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultationBanner() {
  return (
    <section
      id="consultation"
      aria-labelledby="consultation-title"
      className="scroll-mt-24 bg-deep-burgundy px-page py-16 text-white sm:py-20"
    >
      <Reveal className="mx-auto grid max-w-site gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <SectionLabel light>Personal guidance</SectionLabel>
          <h2
            id="consultation-title"
            className="max-w-3xl text-balance font-serif text-[clamp(2.7rem,5vw,5.2rem)] leading-[0.95] tracking-[-0.035em]"
          >
            Designing a more comfortable space?
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-200">
            Speak with our team for personalised guidance on mattresses,
            sofas, beds and ceiling interiors.
          </p>
        </div>
        <div className="flex min-w-fit flex-col gap-3">
          <a
            className="button-light justify-center"
            href={contact.primaryPhoneHref}
          >
            <Phone size={17} />
            Call {contact.primaryPhoneDisplay}
          </a>
          <a
            className="button-outline-light justify-center"
            href={contact.emailHref}
          >
            <Mail size={17} />
            Email Our Team
          </a>
          <a
            className="mt-2 text-center text-xs tracking-[0.12em] text-stone-300 transition-colors hover:text-white"
            href={contact.secondaryPhoneHref}
          >
            Also available: {contact.secondaryPhoneDisplay}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="bg-cream px-page py-section"
    >
      <div className="mx-auto max-w-site">
        <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>Customer experiences</SectionLabel>
            <h2
              id="testimonials-title"
              className="font-serif text-display text-charcoal"
            >
              Comfort people notice.
            </h2>
          </div>
          <div className="flex gap-2" aria-label="Testimonial controls">
            <button
              type="button"
              disabled
              aria-label="Previous testimonial"
              className="icon-button-bordered"
            >
              <ArrowLeft size={17} />
            </button>
            <button
              type="button"
              disabled
              aria-label="Next testimonial"
              className="icon-button-bordered"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_0.82fr_0.82fr]">
          {testimonials.map((testimonial, index) => (
            <Reveal
              key={testimonial.label}
              delay={index * 0.07}
              className={`border border-border bg-ivory p-7 sm:p-9 ${
                index === 0 ? "lg:p-12" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="block h-12 font-serif text-7xl leading-none text-burgundy/35"
              >
                “
              </span>
              <blockquote
                className={`mt-4 font-serif leading-snug text-charcoal ${
                  index === 0 ? "text-3xl sm:text-4xl" : "text-2xl"
                }`}
              >
                {testimonial.quote}
              </blockquote>
              <p className="mt-8 border-t border-border pt-5 text-[0.67rem] font-bold uppercase tracking-[0.17em] text-muted">
                {testimonial.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function InspirationGallery() {
  return (
    <section
      aria-labelledby="inspiration-title"
      className="bg-white px-page py-section"
    >
      <div className="mx-auto max-w-site">
        <Reveal className="mb-11 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <h2
            id="inspiration-title"
            className="font-serif text-display text-charcoal"
          >
            Inspiration for better spaces.
          </h2>
          <a className="text-link" href="#collections">
            Explore Our Collections
            <ArrowRight size={16} />
          </a>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {categories.map((category, index) => (
            <Reveal
              key={category.title}
              delay={index * 0.06}
              className={`group relative overflow-hidden ${
                index % 2 === 0
                  ? "aspect-[3/4] lg:translate-y-5"
                  : "aspect-[3/4]"
              }`}
            >
              <Image
                unoptimized
                src={category.image}
                alt={`${category.alt} inspiration`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                style={{
                  objectPosition:
                    index === 0
                      ? "65% center"
                      : index === 1
                        ? "62% center"
                        : index === 2
                          ? "54% center"
                          : "center 20%",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 font-serif text-xl text-white sm:bottom-6 sm:left-6 sm:text-2xl">
                {category.title}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const socialLinks = [
    { label: "Instagram", icon: Camera },
    { label: "Facebook", icon: ThumbsUp },
    { label: "YouTube", icon: Play },
    { label: "WhatsApp", icon: MessageCircle },
  ] as const;

  return (
    <footer className="bg-footer px-page text-stone-300">
      <div className="mx-auto max-w-site py-16 sm:py-20">
        <div className="grid gap-11 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_0.85fr_1.1fr] lg:gap-14">
          <div>
            <Logo light />
            <p className="mt-7 max-w-sm text-sm leading-7 text-stone-400">
              Premium mattresses, thoughtfully designed furniture and refined
              interior solutions for modern homes.
            </p>
            <div className="mt-7 flex gap-2">
              {socialLinks.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-burgundy hover:bg-burgundy hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
                >
                  <Icon size={16} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="footer-title">Collections</h3>
            <ul className="footer-links">
              {navItems.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#consultation">Product Guidance</a>
              </li>
              <li>
                <a href="#consultation">Care Information</a>
              </li>
              <li>
                <a href="#consultation">Frequently Asked Questions</a>
              </li>
              <li>
                <a href="#consultation">Contact Us</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="footer-title">Contact</h3>
            <div className="grid gap-4 text-sm">
              <a
                className="group flex items-start gap-3 transition-colors hover:text-white"
                href={contact.primaryPhoneHref}
              >
                <Phone
                  size={16}
                  className="mt-0.5 shrink-0 text-burgundy"
                />
                {contact.primaryPhoneDisplay}
              </a>
              <a
                className="group flex items-start gap-3 transition-colors hover:text-white"
                href={contact.secondaryPhoneHref}
              >
                <Phone
                  size={16}
                  className="mt-0.5 shrink-0 text-burgundy"
                />
                {contact.secondaryPhoneDisplay}
              </a>
              <a
                className="group flex items-start gap-3 break-all transition-colors hover:text-white"
                href={contact.emailHref}
              >
                <Mail
                  size={16}
                  className="mt-0.5 shrink-0 text-burgundy"
                />
                {contact.email}
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-7 text-[0.68rem] text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SleepExcellent. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="transition-colors hover:text-stone-300" href="#">
              Privacy Policy
            </a>
            <a className="transition-colors hover:text-stone-300" href="#">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function HomePage() {
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartAnnouncement, setCartAnnouncement] = useState("");

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const addToCart = (product: Product) => {
    setCartItems((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id,
      );
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    setCartAnnouncement(`${product.name} added to your cart.`);
  };

  const buyNow = (product: Product) => {
    addToCart(product);
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, change: number) => {
    setCartItems((current) =>
      current.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((current) =>
      current.filter((item) => item.product.id !== productId),
    );
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div id="top">
        <TopContactBar />
        <SiteHeader
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
        />
      </div>
      <main id="main-content">
        <HeroSection />
        <BrandIntroduction />
        <CategoryShowcase />
        <FeaturedProducts onAdd={addToCart} onBuy={buyNow} />
        <MattressCollection />
        <BenefitsSection />
        <SofaCollection />
        <BedCollection />
        <CeilingCollection />
        <BrandStory />
        <ConsultationBanner />
        <Testimonials />
        <InspirationGallery />
      </main>
      <SiteFooter />
      <CartDrawer
        open={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onQuantityChange={updateQuantity}
        onRemove={removeFromCart}
      />
      <p className="sr-only" aria-live="polite">
        {cartAnnouncement}
      </p>
    </>
  );
}
