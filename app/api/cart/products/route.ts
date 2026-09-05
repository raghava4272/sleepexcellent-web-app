import { NextResponse } from "next/server";
import { readCartProducts } from "@/lib/catalogue/repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const slugs = (new URL(request.url).searchParams.get("slugs") ?? "")
    .split(",")
    .filter((slug) => /^[a-z0-9-]{1,120}$/.test(slug))
    .slice(0, 40);

  if (!slugs.length) return NextResponse.json({ products: [] });

  const catalogue = await readCartProducts(slugs);
  if (catalogue.error) return NextResponse.json({ error: "Cart products are unavailable." }, { status: 503 });

  return NextResponse.json({ products: catalogue.products });
}
