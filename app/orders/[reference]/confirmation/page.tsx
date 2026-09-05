import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowRight, Clock3, ImageOff, LockKeyhole } from "lucide-react";
import { formatInr } from "@/lib/catalogue/presentation";
import { readGuestOrder } from "@/lib/orders/service";
import { guestOrderCookieName } from "@/lib/security/order-access";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order prepared", robots: { index: false, follow: false } };

type Props = { params: Promise<{ reference: string }> };

export default async function PendingOrderConfirmation({ params }: Props) {
  const { reference } = await params;
  if (!/^SE-[0-9]{8}-[A-F0-9]{12}$/.test(reference)) notFound();
  const token = (await cookies()).get(guestOrderCookieName(reference))?.value;
  if (!token) notFound();
  const result = await readGuestOrder(reference, token);
  if (!result) notFound();
  const { order, items } = result;

  return <main id="main-content" className="min-h-screen bg-ivory px-page py-12 sm:py-20"><div className="mx-auto max-w-4xl"><div className="border border-border bg-white p-6 shadow-[0_22px_70px_rgba(36,35,33,0.08)] sm:p-10 lg:p-14"><div className="flex flex-col gap-7 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[0.63rem] font-bold uppercase tracking-[0.2em] text-burgundy">Order prepared</p><h1 className="mt-3 font-serif text-5xl leading-[0.94] tracking-[-0.04em] text-charcoal sm:text-6xl">Payment is pending.</h1><p className="mt-4 max-w-xl text-sm leading-7 text-muted">Your order details are securely preserved. Razorpay payment and paid-order confirmation belong to F006 and are not active yet.</p></div><span className="inline-flex w-fit items-center gap-2 border border-gold/35 bg-cream px-4 py-3 text-xs font-semibold text-charcoal"><Clock3 size={16} className="text-burgundy" /> PENDING</span></div><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto]"><div><p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-muted">SleepExcellent order reference</p><p className="mt-2 break-all font-serif text-3xl text-charcoal">{order.publicReference}</p><div className="mt-7 divide-y divide-border border-y border-border">{items.map((item) => <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] gap-3 py-5" key={item.id}><div className="checkout-fallback" aria-label="Product media pending client mapping"><ImageOff size={17} /></div><div><p className="font-serif text-xl text-charcoal">{item.productName}</p><p className="mt-1 text-xs text-muted">Quantity {item.quantity}</p>{item.configuration && <p className="mt-2 text-xs leading-5 text-muted">{item.configuration}</p>}</div><p className="text-sm font-semibold text-charcoal">{formatInr(item.lineTotalMinor)}</p></div>)}</div></div><dl className="min-w-64 self-start border border-border bg-cream/45 p-5 text-sm"><div className="flex justify-between gap-5 text-muted"><dt>Subtotal</dt><dd>{formatInr(order.subtotalMinor)}</dd></div><div className="mt-3 flex justify-between gap-5 text-muted"><dt>Shipping</dt><dd>{formatInr(order.shippingMinor)}</dd></div><div className="mt-5 flex justify-between gap-5 border-t border-border pt-5 font-semibold text-charcoal"><dt>Total</dt><dd>{formatInr(order.totalMinor)}</dd></div></dl></div><div className="mt-8 border-l-2 border-burgundy bg-cream/60 px-5 py-4"><p className="flex items-start gap-2 text-xs leading-6 text-muted"><LockKeyhole className="mt-1 shrink-0 text-burgundy" size={15} /> This immediate guest view is protected by a short-lived, HttpOnly access cookie. The public reference alone cannot open it.</p></div><Link href="/catalogue" className="button-secondary mt-8">Continue browsing <ArrowRight size={16} /></Link></div></div></main>;
}
