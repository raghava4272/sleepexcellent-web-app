"use client";

export default function CheckoutError({ reset }: { reset: () => void }) {
  return <main className="flex min-h-screen items-center justify-center bg-ivory px-page"><div className="max-w-lg text-center"><p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-burgundy">Checkout paused</p><h1 className="mt-4 font-serif text-5xl text-charcoal">Your cart is still safe.</h1><p className="mt-4 text-sm leading-7 text-muted">We could not prepare the checkout screen. Try loading it again.</p><button className="button-primary mt-7" type="button" onClick={reset}>Try again</button></div></main>;
}
