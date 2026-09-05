export default function CatalogueLoading() {
  return <main className="min-h-screen bg-ivory px-page py-24"><div className="mx-auto max-w-container-site animate-pulse"><div className="h-8 w-40 bg-cream" /><div className="mt-6 h-20 max-w-3xl bg-cream" /><div className="mt-12 h-32 border border-border bg-white" /><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-96 bg-cream" />)}</div></div></main>;
}
