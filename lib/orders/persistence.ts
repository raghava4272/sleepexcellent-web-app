import { createHash, randomBytes } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { orderItems, orders, products } from "@/db/schema";
import type { CheckoutContact, CheckoutLineInput, CheckoutMode } from "@/lib/checkout/contracts";
import { calculateCheckoutQuote, type AuthoritativeCheckoutProduct, type CheckoutQuote } from "@/lib/checkout/pricing";
import { createGuestOrderAccess, tokenHashMatches } from "@/lib/security/order-access";

type CreateOrderInput = {
  mode: CheckoutMode;
  lines: CheckoutLineInput[];
  contact: CheckoutContact;
  idempotencyKey: string;
};

export type CreatedOrder = {
  reference: string;
  guestToken: string;
  quote: CheckoutQuote;
  reused: boolean;
};

function shippingMinor() {
  const configured = process.env.CHECKOUT_SHIPPING_MINOR ?? "0";
  const value = Number(configured);
  if (!Number.isSafeInteger(value) || value < 0) throw new Error("INVALID_SHIPPING_CONFIGURATION");
  return value;
}

function publicReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `SE-${date}-${randomBytes(6).toString("hex").toUpperCase()}`;
}

function fingerprint(input: CreateOrderInput, quote: CheckoutQuote) {
  const canonical = {
    mode: input.mode,
    contact: input.contact,
    lines: [...quote.lines]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(({ id, quantity, fixedPriceMinor, lineTotalMinor }) => ({ id, quantity, fixedPriceMinor, lineTotalMinor })),
    shippingMinor: quote.shippingMinor,
    totalMinor: quote.totalMinor,
  };
  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}

async function resolveQuote(lines: CheckoutLineInput[]) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const slugs = lines.map((line) => line.slug);
  const rows = await db.select({
    id: products.id,
    slug: products.slug,
    name: products.name,
    category: products.category,
    configuration: products.configuration,
    size: products.size,
    fixedPriceMinor: products.fixedPriceMinor,
  }).from(products).where(and(
    eq(products.publicationState, "PUBLISHED"),
    inArray(products.slug, slugs),
    inArray(products.category, ["SOFA", "BED", "MATTRESS"]),
  ));
  if (rows.length !== slugs.length) throw new Error("INELIGIBLE_PRODUCT");
  return calculateCheckoutQuote(lines, rows as AuthoritativeCheckoutProduct[], shippingMinor());
}

export async function quoteCheckout(lines: CheckoutLineInput[]) {
  return resolveQuote(lines);
}

export async function createCheckoutOrder(input: CreateOrderInput): Promise<CreatedOrder> {
  const db = getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const quote = await resolveQuote(input.lines);
  const requestFingerprint = fingerprint(input, quote);
  const guest = createGuestOrderAccess();

  const reuse = async () => {
    const [existing] = await db.select().from(orders).where(eq(orders.checkoutIdempotencyKey, input.idempotencyKey)).limit(1);
    if (!existing) return null;
    if (existing.checkoutRequestFingerprint !== requestFingerprint) throw new Error("IDEMPOTENCY_CONFLICT");
    await db.update(orders).set({ guestAccessTokenHash: guest.hash, guestAccessExpiresAt: guest.expiresAt }).where(eq(orders.id, existing.id));
    return { reference: existing.publicReference, guestToken: guest.token, quote, reused: true } satisfies CreatedOrder;
  };

  const existing = await reuse();
  if (existing) return existing;

  try {
    return await db.transaction(async (transaction) => {
      const [created] = await transaction.insert(orders).values({
        publicReference: publicReference(),
        checkoutMode: input.mode,
        subtotalMinor: quote.subtotalMinor,
        shippingMinor: quote.shippingMinor,
        totalMinor: quote.totalMinor,
        customerName: input.contact.customerName,
        email: input.contact.email,
        phone: input.contact.phone,
        addressLine1: input.contact.addressLine1,
        addressLine2: input.contact.addressLine2,
        city: input.contact.city,
        state: input.contact.state,
        postalCode: input.contact.postalCode,
        checkoutIdempotencyKey: input.idempotencyKey,
        checkoutRequestFingerprint: requestFingerprint,
        guestAccessTokenHash: guest.hash,
        guestAccessExpiresAt: guest.expiresAt,
      }).returning({ id: orders.id, publicReference: orders.publicReference });

      await transaction.insert(orderItems).values(quote.lines.map((line) => ({
        orderId: created.id,
        productId: line.id,
        productSlug: line.slug,
        productName: line.name,
        category: line.category,
        configuration: line.configuration,
        size: line.size,
        unitPriceMinor: line.fixedPriceMinor!,
        quantity: line.quantity,
        lineTotalMinor: line.lineTotalMinor,
      })));
      return { reference: created.publicReference, guestToken: guest.token, quote, reused: false };
    });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      const replayed = await reuse();
      if (replayed) return replayed;
    }
    throw error;
  }
}

export async function readGuestOrder(reference: string, token: string) {
  const db = getDb();
  if (!db) return null;
  const [order] = await db.select().from(orders).where(eq(orders.publicReference, reference)).limit(1);
  if (!order?.guestAccessTokenHash || !order.guestAccessExpiresAt || order.guestAccessExpiresAt.getTime() <= Date.now()) return null;
  if (!tokenHashMatches(token, order.guestAccessTokenHash)) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { order, items };
}
