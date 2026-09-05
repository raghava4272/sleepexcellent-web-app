"use client";

export default function CatalogueError({ reset }: { reset: () => void }) {
  return <main className="grid min-h-screen place-items-center bg-ivory px-page py-24 text-center"><div><p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-burgundy">Catalogue</p><h1 className="mt-4 font-serif text-5xl tracking-[-0.04em] text-charcoal">Something interrupted the catalogue.</h1><p className="mx-auto mt-5 max-w-lg leading-7 text-muted">Please try again. If it continues, the SleepExcellent team can help directly.</p><button type="button" onClick={reset} className="button-primary mt-8">Try again</button></div></main>;
}
