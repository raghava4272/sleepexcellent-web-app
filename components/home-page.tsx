"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Mail,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  useEffect,
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
  sofaModels,
  type Category,
} from "@/lib/site-data";
import { useCart } from "@/components/cart-provider";
import { formatInr } from "@/lib/catalogue/presentation";
import type { CatalogueProduct } from "@/lib/catalogue/types";

const navItems = [
  {
    label: "Mattresses",
    href: "/catalogue?category=MATTRESS",
    submenu: mattressModels,
  },
  { label: "Sofas", href: "/catalogue?category=SOFA", submenu: sofaModels },
  { label: "Beds", href: "/catalogue?category=BED", submenu: bedModels },
  { label: "Ceilings", href: "/catalogue?category=CEILING", submenu: ceilingTypes },
  { label: "Shop", href: "/catalogue", submenu: null },
  { label: "About Us", href: "#about", submenu: null },
] as const;

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a
      href="/"
      className="group inline-flex shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-4"
      aria-label="SleepExcellent home"
    >
      <span className={`relative block h-10 w-48 overflow-hidden sm:h-12 sm:w-56 ${light ? "bg-white" : "bg-white/90"}`}>
        <Image
          src="/brand/logo.png"
          alt="SleepExcellent"
          width={941}
          height={1672}
          className="absolute left-0 top-1/2 h-auto w-full -translate-y-[51%]"
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

function useDialogFocus<T extends HTMLElement>(
  open: boolean,
  onClose: () => void,
) {
  const dialogRef = useRef<T>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      ).filter((element) => !element.hasAttribute("hidden"));

    window.requestAnimationFrame(() => focusable()[0]?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }

      if (event.key !== "Tab") return;
      const elements = focusable();
      if (elements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  return dialogRef;
}

type UtilityPanel = "search" | "account" | null;

type SearchSuggestion = {
  slug: string;
  name: string;
  category: string;
};

function UtilityDialog({
  panel,
  onClose,
}: {
  panel: UtilityPanel;
  onClose: () => void;
}) {
  const open = panel !== null;
  const dialogRef = useDialogFocus<HTMLElement>(open, onClose);
  const isSearch = panel === "search";
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [suggestionState, setSuggestionState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const updateSearchQuery = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setSuggestions([]);
      setSuggestionState("idle");
      return;
    }
    setSuggestions([]);
    setSuggestionState("loading");
  };

  useEffect(() => {
    if (!isSearch || !query.trim()) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/catalogue/suggestions?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Catalogue suggestions are unavailable.");
        const payload = await response.json() as { suggestions?: SearchSuggestion[] };
        setSuggestions(payload.suggestions ?? []);
        setSuggestionState("ready");
      } catch {
        if (controller.signal.aborted) return;
        setSuggestions([]);
        setSuggestionState("error");
      }
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [isSearch, query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label={`Close ${isSearch ? "search" : "account"} panel`}
            className="fixed inset-0 z-[90] bg-charcoal/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="utility-dialog-title"
            className="fixed inset-x-4 top-6 z-[100] mx-auto w-auto max-w-xl border border-border bg-ivory p-6 shadow-2xl sm:inset-x-8 sm:top-[12vh] sm:p-9"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-burgundy">
                  {isSearch ? "Collection search" : "Customer account"}
                </p>
                <h2
                  id="utility-dialog-title"
                  className="mt-2 font-serif text-4xl leading-none text-charcoal sm:text-5xl"
                >
                  {isSearch
                    ? "Search the catalogue."
                    : "Account access is being prepared."}
                </h2>
              </div>
              <button
                type="button"
                className="icon-button -mr-2 -mt-2"
                aria-label={`Close ${isSearch ? "search" : "account"} panel`}
                onClick={onClose}
              >
                <X size={21} />
              </button>
            </div>
            {isSearch ? (
              <form action="/catalogue" className="mt-7">
                <label className="relative block">
                  <span className="sr-only">Search by product or model name</span>
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-burgundy" size={18} aria-hidden="true" />
                  <input
                    name="q"
                    type="search"
                    value={query}
                    onChange={(event) => updateSearchQuery(event.target.value)}
                    autoComplete="off"
                    placeholder="Search by product or model name"
                    aria-describedby="search-guidance"
                    className="catalogue-input pl-11"
                  />
                </label>
                <p id="search-guidance" className="mt-3 text-sm leading-6 text-muted">Suggestions use only supplied catalogue product and model names.</p>

                {query.trim() && suggestionState === "loading" && <p role="status" className="mt-4 text-sm text-muted">Finding matching models…</p>}
                {query.trim() && suggestionState === "error" && <p role="alert" className="mt-4 text-sm leading-6 text-burgundy">Suggestions are temporarily unavailable. You can still search the catalogue.</p>}
                {suggestionState === "ready" && query.trim() && suggestions.length === 0 && <p role="status" className="mt-4 text-sm leading-6 text-muted">No matching models yet. Submit your search to view the catalogue.</p>}
                {suggestions.length > 0 && (
                  <ul aria-label="Matching catalogue models" className="mt-4 divide-y divide-border border border-border bg-white" role="listbox">
                    {suggestions.map((suggestion) => (
                      <li key={suggestion.slug} role="option" aria-selected="false">
                        <a href={`/catalogue?q=${encodeURIComponent(suggestion.name)}`} onClick={onClose} className="flex min-h-12 items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-cream focus-visible:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-burgundy">
                          <span className="font-medium text-charcoal">{suggestion.name}</span>
                          <span className="shrink-0 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-burgundy">{suggestion.category}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button type="submit" className="button-primary">
                    Search catalogue <ArrowRight size={16} />
                  </button>
                  <a className="text-link" href="/catalogue" onClick={onClose}>Browse Collections</a>
                </div>
              </form>
            ) : (
              <>
                <p className="mt-6 max-w-lg text-sm leading-7 text-muted sm:text-base">Shopping remains open to guests. Customer sign-in and private order history will be added in their approved feature stage.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a className="button-primary" href="#consultation" onClick={onClose}>Contact SleepExcellent <ArrowRight size={16} /></a>
                  <button type="button" className="text-link" onClick={onClose}>Continue on Homepage</button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
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
  onSearchOpen,
  onAccountOpen,
}: {
  cartCount: number;
  onCartOpen: () => void;
  onSearchOpen: () => void;
  onAccountOpen: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useDialogFocus<HTMLElement>(menuOpen, () =>
    setMenuOpen(false),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openFromMobileMenu = (openPanel: () => void) => {
    setMenuOpen(false);
    window.requestAnimationFrame(openPanel);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-ivory/95 backdrop-blur-md transition-all duration-300 ${
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
            {navItems.map((item, navIndex) =>
              item.submenu ? (
                <details
                  key={item.href}
                  className="nav-menu relative flex h-full items-center"
                  onMouseEnter={(event) => event.currentTarget.setAttribute("open", "")}
                  onMouseLeave={(event) => {
                    if (!event.currentTarget.matches(":focus-within")) event.currentTarget.removeAttribute("open");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      event.currentTarget.removeAttribute("open");
                      event.currentTarget.querySelector("summary")?.focus();
                    }
                  }}
                >
                  <summary className="nav-link relative flex cursor-pointer list-none items-center gap-1.5 py-4 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-charcoal outline-none transition-colors hover:text-burgundy focus-visible:text-burgundy">
                    {item.label}
                    <ChevronDown size={13} aria-hidden="true" />
                  </summary>
                  <div
                    className={`nav-dropdown pointer-events-none invisible absolute left-1/2 top-full z-[60] w-[min(920px,88vw)] pt-2 opacity-0 transition-all duration-200 ${
                      navIndex === 0 ? "nav-dropdown-start" : ""
                    }`}
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
                          onClick={(event) =>
                            event.currentTarget
                              .closest("details")
                              ?.removeAttribute("open")
                          }
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
                              onClick={(event) =>
                                event.currentTarget
                                  .closest("details")
                                  ?.removeAttribute("open")
                              }
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
                </details>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="nav-link relative flex h-full items-center py-4 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-charcoal outline-none transition-colors hover:text-burgundy focus-visible:text-burgundy"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Open collection search information"
              aria-haspopup="dialog"
              className="icon-button hidden sm:inline-flex"
              onClick={onSearchOpen}
            >
              <Search size={18} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              aria-label="Open customer account information"
              aria-haspopup="dialog"
              className="icon-button hidden lg:inline-flex"
              onClick={onAccountOpen}
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
      <div aria-hidden="true" className="h-[76px] lg:h-[92px]" />

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
              ref={menuRef}
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

              <nav
                className="mt-7 flex-1 overflow-y-auto pr-1"
                aria-label="Mobile navigation"
              >
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
              href="/catalogue"
                  onClick={() => setMenuOpen(false)}
                >
                  Browse Collections
                </a>
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between border-b border-border py-4 text-left text-xs font-bold uppercase tracking-[0.2em]"
                  onClick={() => openFromMobileMenu(onSearchOpen)}
                >
                  Search
                  <Search size={17} strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between border-b border-border py-4 text-left text-xs font-bold uppercase tracking-[0.2em]"
                  onClick={() => openFromMobileMenu(onAccountOpen)}
                >
                  Account
                  <UserRound size={17} strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between border-b border-border py-4 text-left text-xs font-bold uppercase tracking-[0.2em]"
                  onClick={() => openFromMobileMenu(onCartOpen)}
                >
                  Cart
                  <ShoppingBag size={17} strokeWidth={1.6} />
                </button>
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
  const firstHeroVideoRef = useRef<HTMLVideoElement>(null);
  const secondHeroVideoRef = useRef<HTMLVideoElement>(null);
  const activeHeroSlide = reduceMotion ? 1 : heroSlide;

  useEffect(() => {
    if (reduceMotion) return;
    const timeout = window.setTimeout(() => {
      setHeroSlide((current) => (current === 0 ? 1 : 0));
    }, 6500);
    return () => window.clearTimeout(timeout);
  }, [heroSlide, reduceMotion]);

  useEffect(() => {
    const videos = [firstHeroVideoRef.current, secondHeroVideoRef.current];
    const activeVideo = videos[activeHeroSlide];
    videos.forEach((video, index) => {
      if (!video) return;
      if (index === activeHeroSlide) {
        void video.play().catch(() => {
          // The supplied poster remains visible if autoplay is unavailable.
        });
      } else {
        video.pause();
      }
    });
    if (!activeVideo) {
      return;
    }
  }, [activeHeroSlide]);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-[660px] overflow-hidden bg-charcoal sm:min-h-[700px] lg:h-[calc(100svh-92px)] lg:min-h-[680px] lg:max-h-[940px]"
    >
      <div className="absolute inset-0">
        <Image
          src={media.mattress}
          alt="Premium SleepExcellent mattress collection in a refined bedroom"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[61%_center] sm:object-[58%_center] lg:object-center"
        />
        {!reduceMotion && (
          <>
          <video
            ref={firstHeroVideoRef}
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
          <video
            ref={secondHeroVideoRef}
            muted
            loop
            playsInline
            preload="metadata"
            poster={media.mattress}
            aria-hidden="true"
            tabIndex={-1}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
              activeHeroSlide === 1 ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src={media.homepageVideo} type="video/mp4" />
            Your browser does not support this background video. The supplied
            image remains available as a fallback.
          </video>
          </>
        )}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,22,20,0.86)_0%,rgba(24,22,20,0.66)_42%,rgba(24,22,20,0.12)_78%)] max-sm:bg-[linear-gradient(90deg,rgba(24,22,20,0.83)_0%,rgba(24,22,20,0.6)_70%,rgba(24,22,20,0.28)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
      <div className="relative mx-auto flex h-full min-h-[660px] max-w-site items-end px-page pb-20 pt-24 sm:min-h-[700px] sm:items-center sm:pb-16 lg:min-h-[680px]">
        <div className="max-w-[730px] text-white">
          <motion.div
            initial={false}
            className="mb-6 flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.26em] text-stone-200"
          >
            <span className="h-px w-9 bg-burgundy" />
            SleepExcellent Collection
          </motion.div>
          <motion.h1
            id="hero-title"
            initial={false}
            className="text-balance font-serif text-[clamp(3.3rem,7vw,6.85rem)] leading-[0.88] tracking-[-0.045em]"
          >
            Comfort, crafted to elevate every room.
          </motion.h1>
          <motion.p
            initial={false}
            className="mt-7 max-w-[640px] text-[0.98rem] leading-7 text-stone-200 sm:text-lg sm:leading-8"
          >
            Browse the current SleepExcellent mattress, sofa, bed and ceiling
            collections, then contact the team for product guidance.
          </motion.p>
          <motion.div
            initial={false}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a className="button-primary" href="/catalogue">
              Explore Collections
              <ArrowRight size={17} />
            </a>
            <a className="button-ghost-light" href={contact.primaryPhoneHref}>
              Talk to Our Experts
            </a>
          </motion.div>
          <motion.a
            initial={false}
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
          Explore the current SleepExcellent catalogue across mattresses,
          sofas, beds and ceiling options. Every collection keeps its supplied
          model names visible and provides a direct route to the team for
          product guidance.
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

function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useDialogFocus<HTMLElement>(open, onClose);
  const reduceMotion = useReducedMotion();
  const cart = useCart();
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || !cart.hydrated) return;
    if (!cart.lines.length) {
      queueMicrotask(() => { setProducts([]); setError(false); });
      return;
    }
    const controller = new AbortController();
    queueMicrotask(() => { setLoading(true); setError(false); });
    fetch(`/api/cart/products?slugs=${encodeURIComponent(cart.lines.map((line) => line.slug).join(","))}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Cart product lookup failed");
        const payload = await response.json() as { products: CatalogueProduct[] };
        setProducts(payload.products);
      })
      .catch((reason: unknown) => { if ((reason as { name?: string }).name !== "AbortError") setError(true); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [cart.hydrated, cart.lines, open]);

  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const subtotal = cart.lines.reduce((sum, line) => sum + ((bySlug.get(line.slug)?.fixedPriceMinor ?? 0) * line.quantity), 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close shopping cart"
            className="fixed inset-0 z-[90] bg-charcoal/55 backdrop-blur-sm"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="fixed right-0 top-0 z-[100] flex h-dvh w-full max-w-[520px] flex-col bg-ivory shadow-2xl"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={reduceMotion ? undefined : { x: 0 }}
            exit={reduceMotion ? undefined : { x: "100%" }}
            transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
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
                onClick={onClose}
              >
                <X size={22} />
              </button>
            </div>

            {!cart.hydrated || loading ? (
              <div className="flex flex-1 items-center justify-center px-7 text-center" aria-live="polite"><p className="text-sm text-muted">Refreshing your saved selection…</p></div>
            ) : !cart.lines.length ? (
              <div className="flex flex-1 flex-col items-center justify-center px-7 py-12 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full border border-burgundy/20 bg-cream text-burgundy"><ShoppingBag size={32} strokeWidth={1.25} aria-hidden="true" /></span>
                <h3 className="mt-6 font-serif text-4xl text-charcoal">Begin with something exceptional.</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-muted">Your cart stays with you as you explore the SleepExcellent collection.</p>
                <a href="/catalogue" className="button-primary mt-8" onClick={onClose}>Browse Collections <ArrowRight size={16} /></a>
              </div>
            ) : error ? (
              <div className="flex flex-1 flex-col items-center justify-center px-7 text-center"><h3 className="font-serif text-4xl text-charcoal">Your selection is saved.</h3><p className="mt-3 max-w-sm text-sm leading-7 text-muted">Current catalogue details could not be refreshed. Please close and try again.</p></div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
                  <p className="text-xs leading-5 text-muted">{cart.itemCount} {cart.itemCount === 1 ? "item" : "items"} in your persistent cart. Final prices refresh before checkout.</p>
                  <div className="mt-5 divide-y divide-border border-y border-border">
                    {cart.lines.map((line) => {
                      const product = bySlug.get(line.slug);
                      if (!product) return <div key={line.slug} className="py-5"><p className="font-semibold text-charcoal">This product is no longer available in the current catalogue.</p><button type="button" className="text-link mt-2" onClick={() => cart.removeItem(line.slug)}>Remove item <Trash2 size={14} aria-hidden="true" /></button></div>;
                      const category = product.category === "MATTRESS" ? "Mattresses" : `${product.category.slice(0, 1)}${product.category.slice(1).toLowerCase()}s`;
                      return <div key={line.slug} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 py-5"><div className="cart-line-fallback" aria-label="Product media pending client mapping">{product.name.slice(0, 1)}</div><div className="min-w-0"><p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-burgundy">{category}</p><p className="mt-1 font-serif text-2xl leading-none text-charcoal">{product.name}</p>{product.configuration && <p className="mt-2 text-xs leading-5 text-muted">{product.configuration}</p>}<p className="mt-3 text-sm font-semibold text-charcoal">{formatInr(product.fixedPriceMinor ?? 0)}</p><div className="mt-4 flex items-center justify-between gap-3"><div className="inline-flex min-h-10 items-center border border-border bg-ivory"><button type="button" className="cart-quantity-button" aria-label={`Decrease quantity for ${product.name}`} disabled={line.quantity === 1} onClick={() => cart.setQuantity(line.slug, line.quantity - 1)}><Minus size={14} aria-hidden="true" /></button><output className="flex min-w-9 justify-center text-sm font-semibold" aria-live="polite">{line.quantity}</output><button type="button" className="cart-quantity-button" aria-label={`Increase quantity for ${product.name}`} onClick={() => cart.setQuantity(line.slug, line.quantity + 1)}><Plus size={14} aria-hidden="true" /></button></div><p className="text-sm font-semibold text-charcoal">{formatInr((product.fixedPriceMinor ?? 0) * line.quantity)}</p></div><button type="button" className="text-link mt-3" onClick={() => cart.removeItem(line.slug)}>Remove <Trash2 size={14} aria-hidden="true" /></button></div></div>;
                    })}
                  </div>
                  {cart.storageError && <p className="detail-action-notice mt-5">This browser may not retain the cart after it closes. Your current selection is still available now.</p>}
                  {cart.buyNowIntent && <p className="mt-5 text-xs leading-5 text-muted">A separate Buy Now selection is ready and has not changed this normal cart.</p>}
                </div>
                <div className="border-t border-border bg-cream/55 px-5 py-5 sm:px-7"><div className="flex items-end justify-between gap-4"><div><p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted">Subtotal</p><p className="mt-1 text-xs text-muted">Final pricing is revalidated at checkout.</p></div><p className="font-serif text-3xl text-charcoal">{formatInr(subtotal)}</p></div>{bySlug.size === cart.lines.length ? <a href="/checkout" className="button-primary mt-5 w-full" onClick={onClose}>Continue to checkout <ArrowRight size={16} /></a> : <button type="button" className="button-secondary mt-5 w-full opacity-60" disabled>Review unavailable items</button>}<p className="mt-3 text-center text-xs leading-5 text-muted">The server rebuilds every price and total before creating an order.</p><button type="button" className="text-link mt-3" onClick={() => { if (window.confirm("Clear every item from your cart?")) cart.clearCart(); }}>Clear Cart <Trash2 size={14} aria-hidden="true" /></button></div>
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
              Listed models
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
            Compare the ten listed mattress models, including orthopaedic,
            latex, spring, foam and memory-foam options in their supplied
            catalogue sizes.
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
            Browse all sixteen listed sofa models and review the supplied
            configurations before contacting the SleepExcellent team.
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
            Browse all ten listed bed models, including the supplied headboard,
            teak, plywood and lifestyle options.
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
              Four collections, clearly presented.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-muted lg:justify-self-end lg:text-lg">
            Move between the current catalogue collections, review their
            authoritative model names, and use the confirmed contact details
            when you are ready to discuss a selection.
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
          <a className="text-link" href="/catalogue">
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

function PartnersSection() {
  const partners = [
    {
      src: "/photos/partners/Ceo-pratap_reddy_snapareddy.jpg",
      designation: "CEO",
      name: "Pratap Reddy Snapareddy",
    },
    {
      src: "/photos/partners/Managing_director_Merva_Obaiah.jpg",
      designation: "Managing Director",
      name: "Merva Obaiah",
    },
  ];

  return (
    <section aria-labelledby="partners-title" className="bg-ivory px-page py-section">
      <div className="mx-auto max-w-site">
        <Reveal className="mb-10 max-w-2xl sm:mb-14">
          <SectionLabel>SleepExcellent</SectionLabel>
          <h2 id="partners-title" className="font-serif text-display text-charcoal">Meet the Partners</h2>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-7">
          {partners.map((partner, index) => (
            <Reveal key={partner.src} delay={index * 0.08}>
              <div className="group border border-border bg-white p-3 shadow-[0_18px_55px_rgba(36,35,33,0.05)] sm:p-4">
                <div className="relative aspect-[1.64/1] overflow-hidden bg-cream">
                  <Image src={partner.src} alt={`${partner.name}, ${partner.designation}`} fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-contain transition-transform duration-500 group-hover:scale-[1.012]" />
                </div>
                <div className="px-1 pb-1 pt-5 sm:px-2 sm:pt-6">
                  <p className="text-[0.61rem] font-bold uppercase tracking-[0.2em] text-burgundy">{partner.designation}</p>
                  <h3 className="mt-2 font-serif text-3xl leading-none tracking-[-0.03em] text-charcoal sm:text-4xl">{partner.name}</h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-footer px-page text-stone-300">
      <div className="mx-auto max-w-site py-16 sm:py-20">
        <div className="grid gap-11 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_0.75fr_1.1fr] lg:gap-14">
          <div>
            <Logo light />
            <p className="mt-7 max-w-sm text-sm leading-7 text-stone-400">
              Browse the SleepExcellent mattress, sofa, bed and ceiling
              collections, then contact the team for product guidance.
            </p>
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
                <Phone size={16} className="mt-0.5 shrink-0 text-burgundy" />
                {contact.primaryPhoneDisplay}
              </a>
              <a
                className="group flex items-start gap-3 transition-colors hover:text-white"
                href={contact.secondaryPhoneHref}
              >
                <Phone size={16} className="mt-0.5 shrink-0 text-burgundy" />
                {contact.secondaryPhoneDisplay}
              </a>
              <a
                className="group flex items-start gap-3 break-all transition-colors hover:text-white"
                href={contact.emailHref}
              >
                <Mail size={16} className="mt-0.5 shrink-0 text-burgundy" />
                {contact.email}
              </a>
            </div>
          </div>
        </div>
        <div className="pt-7 text-[0.68rem] text-stone-500">
          <p>© 2026 SleepExcellent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [utilityPanel, setUtilityPanel] = useState<UtilityPanel>(null);
  const { itemCount } = useCart();

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div id="top">
        <TopContactBar />
        <SiteHeader
          cartCount={itemCount}
          onCartOpen={() => setCartOpen(true)}
          onSearchOpen={() => setUtilityPanel("search")}
          onAccountOpen={() => setUtilityPanel("account")}
        />
      </div>
      <main id="main-content">
        <HeroSection />
        <BrandIntroduction />
        <CategoryShowcase />
        <MattressCollection />
        <BenefitsSection />
        <SofaCollection />
        <BedCollection />
        <CeilingCollection />
        <BrandStory />
        <ConsultationBanner />
        <InspirationGallery />
        <PartnersSection />
      </main>
      <SiteFooter />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <UtilityDialog panel={utilityPanel} onClose={() => setUtilityPanel(null)} />
    </>
  );
}
