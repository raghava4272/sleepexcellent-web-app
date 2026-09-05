import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout-page";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout", description: "Review authoritative SleepExcellent order pricing and delivery details." };

type Props = { searchParams: Promise<{ mode?: string }> };

export default async function CheckoutRoute({ searchParams }: Props) {
  const { mode } = await searchParams;
  return <CheckoutPage mode={mode === "buy-now" ? "BUY_NOW" : "CART"} />;
}
