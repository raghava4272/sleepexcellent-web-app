import { NextResponse } from "next/server";
import { parseCheckoutLines } from "@/lib/checkout/contracts";
import { quoteCheckout } from "@/lib/orders/service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json() as { lines?: unknown };
    const lines = parseCheckoutLines(payload.lines);
    if (!lines) return NextResponse.json({ error: "Select at least one valid product." }, { status: 400 });
    const quote = await quoteCheckout(lines);
    return NextResponse.json({ quote }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const code = (error as Error).message;
    if (code === "INELIGIBLE_PRODUCT") return NextResponse.json({ error: "A selected product is no longer eligible for checkout." }, { status: 409 });
    return NextResponse.json({ error: "The authoritative order summary is temporarily unavailable." }, { status: 503 });
  }
}
