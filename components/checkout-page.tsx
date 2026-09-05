"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ImageOff, LoaderCircle, LockKeyhole, MapPin, PackageCheck, RefreshCw } from "lucide-react";
import { useActionState, useEffect, useMemo, useState } from "react";
import { createCheckoutOrderAction } from "@/app/checkout/actions";
import { useCart } from "@/components/cart-provider";
import { formatInr } from "@/lib/catalogue/presentation";
import type { CheckoutMode } from "@/lib/checkout/contracts";
import { initialCheckoutActionState } from "@/lib/checkout/action-state";
import type { CheckoutQuote } from "@/lib/checkout/pricing";

type Props = { mode: CheckoutMode };

function Field({
  id,
  label,
  error,
  optional = false,
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string; optional?: boolean }) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label className="checkout-label" htmlFor={id}>{label}{optional && <span>Optional</span>}</label>
      <input className="checkout-input" id={id} name={id} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...input} />
      {error && <p id={errorId} className="mt-2 text-xs leading-5 text-burgundy">{error}</p>}
    </div>
  );
}

export function CheckoutPage({ mode }: Props) {
  const cart = useCart();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [state, action, pending] = useActionState(createCheckoutOrderAction, initialCheckoutActionState);
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [retry, setRetry] = useState(0);
  const [idempotencyKey, setIdempotencyKey] = useState("");

  const lines = useMemo(() => mode === "BUY_NOW" ? (cart.buyNowIntent ? [cart.buyNowIntent] : []) : cart.lines, [cart.buyNowIntent, cart.lines, mode]);
  const linePayload = JSON.stringify(lines);

  useEffect(() => {
    if (!cart.hydrated || !lines.length) return;
    const controller = new AbortController();
    queueMicrotask(() => { setQuoteLoading(true); setQuoteError(""); });
    fetch("/api/checkout/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines }),
      signal: controller.signal,
    }).then(async (response) => {
      const payload = await response.json() as { quote?: CheckoutQuote; error?: string };
      if (!response.ok || !payload.quote) throw new Error(payload.error ?? "Order summary unavailable.");
      setQuote(payload.quote);
    }).catch((error: unknown) => {
      if ((error as { name?: string }).name !== "AbortError") {
        setQuote(null);
        setQuoteError((error as Error).message);
      }
    }).finally(() => setQuoteLoading(false));
    return () => controller.abort();
  }, [cart.hydrated, linePayload, retry]);

  useEffect(() => {
    if (!cart.hydrated) return;
    queueMicrotask(() => setIdempotencyKey(crypto.randomUUID()));
  }, [cart.hydrated, linePayload, mode]);

  useEffect(() => {
    if (state.ok && state.reference) router.replace(`/orders/${encodeURIComponent(state.reference)}/confirmation`);
  }, [router, state.ok, state.reference]);

  const empty = cart.hydrated && lines.length === 0;

  return (
    <main id="main-content" className="min-h-screen bg-ivory pb-20 sm:pb-28">
      <header className="border-b border-border bg-ivory/95 px-page py-5 backdrop-blur">
        <div className="mx-auto flex max-w-container-site items-center justify-between gap-4">
          <Link href={mode === "BUY_NOW" && cart.buyNowIntent ? `/products/${cart.buyNowIntent.slug}` : "/"} className="text-link"><ArrowLeft size={15} aria-hidden="true" /> Return to shopping</Link>
          <span className="font-serif text-2xl italic tracking-[-0.04em] text-charcoal sm:text-3xl">Sleep <strong className="font-semibold text-burgundy">EX</strong>cellent</span>
        </div>
      </header>

      <section className="px-page pt-10 sm:pt-14 lg:pt-18">
        <div className="mx-auto max-w-container-site">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="text-[0.63rem] font-bold uppercase tracking-[0.2em] text-burgundy">{mode === "BUY_NOW" ? "Buy Now checkout" : "Your checkout"}</p>
            <h1 className="mt-3 max-w-4xl font-serif text-[clamp(3.25rem,6vw,6rem)] leading-[0.88] tracking-[-0.05em] text-charcoal">A considered final step.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base">Review current catalogue pricing and tell us where your order should arrive. Payment will be introduced in the next approved step.</p>
          </motion.div>

          {!cart.hydrated ? (
            <div className="checkout-panel mt-10 flex min-h-72 items-center justify-center text-center" aria-live="polite"><p className="inline-flex items-center gap-3 text-sm text-muted"><LoaderCircle className="animate-spin" size={18} /> Restoring your selection…</p></div>
          ) : empty ? (
            <div className="checkout-panel mt-10 py-16 text-center"><PackageCheck className="mx-auto text-burgundy" size={32} strokeWidth={1.3} /><h2 className="mt-5 font-serif text-4xl text-charcoal">There is no selection to check out.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">{mode === "BUY_NOW" ? "Choose Buy Now again from an eligible product page." : "Add a sofa, bed, or mattress to your normal cart first."}</p><Link href="/catalogue" className="button-primary mt-7">Browse catalogue <ArrowRight size={16} /></Link></div>
          ) : (
            <div className="mt-10 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] lg:items-start xl:gap-12">
              <motion.form action={action} className="checkout-panel" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.48, delay: reduceMotion ? 0 : 0.06 }}>
                <input type="hidden" name="checkoutMode" value={mode} />
                <input type="hidden" name="lines" value={linePayload} />
                <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
                <div className="flex items-start gap-3 border-b border-border pb-6"><MapPin className="mt-1 text-burgundy" size={21} aria-hidden="true" /><div><h2 className="font-serif text-3xl text-charcoal">Contact & delivery</h2><p className="mt-1 text-xs leading-5 text-muted">India delivery details are preserved with this order.</p></div></div>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2"><Field id="customerName" label="Customer name" autoComplete="name" required error={state.fieldErrors.customerName} /></div>
                  <Field id="email" label="Email address" type="email" autoComplete="email" required error={state.fieldErrors.email} />
                  <Field id="phone" label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" required error={state.fieldErrors.phone} />
                  <div className="sm:col-span-2"><Field id="addressLine1" label="Address line 1" autoComplete="address-line1" required error={state.fieldErrors.addressLine1} /></div>
                  <div className="sm:col-span-2"><Field id="addressLine2" label="Address line 2" autoComplete="address-line2" optional error={state.fieldErrors.addressLine2} /></div>
                  <Field id="city" label="City" autoComplete="address-level2" required error={state.fieldErrors.city} />
                  <Field id="state" label="State" autoComplete="address-level1" required error={state.fieldErrors.state} />
                  <Field id="postalCode" label="PIN code" inputMode="numeric" pattern="[1-9][0-9]{5}" maxLength={6} autoComplete="postal-code" required error={state.fieldErrors.postalCode} />
                  <div><span className="checkout-label">Country</span><div className="checkout-input flex items-center bg-cream/45 text-muted" aria-label="Country India">India</div></div>
                </div>
                {state.message && !state.ok && <p role="alert" className="detail-action-notice mt-6">{state.message}</p>}
                <button type="submit" className="button-primary mt-8 w-full" disabled={!quote || quoteLoading || pending || !idempotencyKey}>{pending ? <><LoaderCircle className="animate-spin" size={16} /> Preparing order…</> : <>Create payment-pending order <ArrowRight size={16} /></>}</button>
                <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs leading-5 text-muted"><LockKeyhole className="mt-0.5 shrink-0" size={14} aria-hidden="true" /> Prices and totals are rebuilt by SleepExcellent on the server. No payment is collected in F005.</p>
              </motion.form>

              <motion.aside className="checkout-panel lg:sticky lg:top-6" aria-labelledby="order-summary-title" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.12 }}>
                <div className="flex items-start justify-between gap-4"><div><p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-burgundy">{mode === "BUY_NOW" ? "Isolated selection" : "Normal cart"}</p><h2 id="order-summary-title" className="mt-2 font-serif text-3xl text-charcoal">Order summary</h2></div><LockKeyhole size={20} className="text-gold" aria-hidden="true" /></div>
                {quoteLoading ? <p className="mt-10 inline-flex items-center gap-3 text-sm text-muted" aria-live="polite"><LoaderCircle className="animate-spin" size={17} /> Refreshing authoritative prices…</p> : quoteError ? <div className="mt-8 border border-burgundy/20 bg-cream/60 p-5"><p role="alert" className="text-sm leading-6 text-charcoal">{quoteError}</p><button type="button" className="text-link mt-3" onClick={() => setRetry((value) => value + 1)}>Try again <RefreshCw size={14} /></button></div> : quote ? <><div className="mt-6 divide-y divide-border border-y border-border">{quote.lines.map((line) => <div key={line.id} className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] gap-3 py-5"><div className="checkout-fallback" aria-label="Product media pending client mapping"><ImageOff size={17} aria-hidden="true" /></div><div><p className="font-serif text-xl leading-tight text-charcoal">{line.name}</p><p className="mt-1 text-xs text-muted">Quantity {line.quantity}</p>{line.configuration && <p className="mt-2 text-xs leading-5 text-muted">{line.configuration}</p>}</div><p className="text-sm font-semibold text-charcoal">{formatInr(line.lineTotalMinor)}</p></div>)}</div><dl className="mt-6 grid gap-3 text-sm"><div className="flex justify-between gap-4 text-muted"><dt>Subtotal</dt><dd>{formatInr(quote.subtotalMinor)}</dd></div><div className="flex justify-between gap-4 text-muted"><dt>Shipping</dt><dd>{formatInr(quote.shippingMinor)}</dd></div><div className="mt-2 flex items-end justify-between gap-4 border-t border-border pt-5"><dt className="font-semibold text-charcoal">Payable total</dt><dd className="font-serif text-3xl text-charcoal">{formatInr(quote.totalMinor)}</dd></div></dl><p className="mt-5 text-xs leading-5 text-muted">INR. No separate GST/tax line is shown. Availability remains unset and does not block checkout.</p></> : null}
                {mode === "BUY_NOW" && <p className="mt-6 border-l-2 border-gold bg-cream/60 px-4 py-3 text-xs leading-5 text-muted">Your normal cart remains preserved and is not included in this Buy Now order.</p>}
              </motion.aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
