"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = {
  slug: string;
  quantity: number;
};

export type BuyNowIntent = CartLine;

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  buyNowIntent: BuyNowIntent | null;
  hydrated: boolean;
  storageError: boolean;
  addItem: (slug: string, quantity: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  beginBuyNow: (slug: string, quantity: number) => void;
  clearBuyNowIntent: () => void;
};

const CART_STORAGE_KEY = "sleepexcellent.cart.v1";
const BUY_NOW_STORAGE_KEY = "sleepexcellent.buy-now.v1";
const CartContext = createContext<CartContextValue | null>(null);

function normaliseLine(value: unknown): CartLine | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as { slug?: unknown; quantity?: unknown };
  if (typeof candidate.slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(candidate.slug)) return null;
  if (typeof candidate.quantity !== "number" || !Number.isSafeInteger(candidate.quantity) || candidate.quantity < 1) return null;
  return { slug: candidate.slug, quantity: candidate.quantity };
}

function readStoredLines(value: string | null): CartLine[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normaliseLine).filter((line): line is CartLine => line !== null);
  } catch {
    return [];
  }
}

function readStoredIntent(value: string | null): BuyNowIntent | null {
  if (!value) return null;
  try {
    return normaliseLine(JSON.parse(value));
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [buyNowIntent, setBuyNowIntent] = useState<BuyNowIntent | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setLines(readStoredLines(window.localStorage.getItem(CART_STORAGE_KEY)));
        setBuyNowIntent(readStoredIntent(window.sessionStorage.getItem(BUY_NOW_STORAGE_KEY)));
      } catch {
        setStorageError(true);
      } finally {
        setHydrated(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch {
      queueMicrotask(() => setStorageError(true));
    }
  }, [hydrated, lines]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (buyNowIntent) window.sessionStorage.setItem(BUY_NOW_STORAGE_KEY, JSON.stringify(buyNowIntent));
      else window.sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
    } catch {
      queueMicrotask(() => setStorageError(true));
    }
  }, [buyNowIntent, hydrated]);

  const value = useMemo<CartContextValue>(() => ({
    lines,
    itemCount: lines.reduce((total, line) => total + line.quantity, 0),
    buyNowIntent,
    hydrated,
    storageError,
    addItem(slug, quantity) {
      const safeQuantity = Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 1;
      setLines((current) => {
        const existing = current.find((line) => line.slug === slug);
        if (!existing) return [...current, { slug, quantity: safeQuantity }];
        return current.map((line) => line.slug === slug ? { ...line, quantity: line.quantity + safeQuantity } : line);
      });
    },
    setQuantity(slug, quantity) {
      if (!Number.isSafeInteger(quantity) || quantity < 1) return;
      setLines((current) => current.map((line) => line.slug === slug ? { ...line, quantity } : line));
    },
    removeItem(slug) {
      setLines((current) => current.filter((line) => line.slug !== slug));
    },
    clearCart() {
      setLines([]);
    },
    beginBuyNow(slug, quantity) {
      const safeQuantity = Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 1;
      setBuyNowIntent({ slug, quantity: safeQuantity });
    },
    clearBuyNowIntent() {
      setBuyNowIntent(null);
    },
  }), [buyNowIntent, hydrated, lines, storageError]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
