"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Mattresses", href: "/catalogue?category=MATTRESS" },
  { label: "Sofas", href: "/catalogue?category=SOFA" },
  { label: "Beds", href: "/catalogue?category=BED" },
  { label: "Ceilings", href: "/catalogue?category=CEILING" },
  { label: "Shop", href: "/catalogue" },
] as const;

/** A compact, persistent navigation shell for all non-home routes. */
export function GlobalPageNavigation() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-ivory/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-site items-center justify-between gap-4 px-page sm:h-[80px]">
        <Link
          href="/"
          className="inline-flex shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-4"
          aria-label="SleepExcellent home"
        >
          <span className="relative block h-9 w-44 overflow-hidden bg-white/90 sm:h-10 sm:w-48">
            <Image
              src="/brand/logo.png"
              alt="SleepExcellent"
              width={941}
              height={1672}
              className="absolute left-0 top-1/2 h-auto w-full -translate-y-[51%]"
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-charcoal transition-colors hover:text-burgundy focus-visible:text-burgundy focus-visible:outline-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/catalogue" className="icon-button" aria-label="Search catalogue">
            <Search size={18} strokeWidth={1.6} />
          </Link>
          <Link href="/checkout" className="icon-button" aria-label="Open checkout">
            <ShoppingBag size={18} strokeWidth={1.6} />
          </Link>
        </div>
        </div>
      </header>
      <div aria-hidden="true" className="h-[72px] sm:h-[80px]" />
    </>
  );
}
