import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { closeDb, getDb } from "../db/connection";
import { orderItems, orders } from "../db/schema";
import { createCheckoutOrder } from "../lib/orders/persistence";

const db = getDb();
if (!db) throw new Error("DATABASE_URL is required for F005 integration validation.");

const key = randomUUID();
let createdOrderId: string | null = null;

try {
  const input = {
    mode: "CART" as const,
    lines: [{ slug: "l-shape-sofa", quantity: 2 }],
    contact: {
      customerName: "F005 Validation Customer",
      email: "f005-validation@example.invalid",
      phone: "+919876543210",
      addressLine1: "1 Validation Road",
      addressLine2: null,
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500001",
    },
    idempotencyKey: key,
  };

  const first = await createCheckoutOrder(input);
  const second = await createCheckoutOrder(input);
  if (first.reference !== second.reference || !second.reused) throw new Error("Idempotent retry created or returned a different order.");

  const [stored] = await db.select().from(orders).where(eq(orders.publicReference, first.reference)).limit(1);
  if (!stored) throw new Error("Created order was not persisted.");
  createdOrderId = stored.id;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, stored.id));
  if (items.length !== 1) throw new Error("Order-item snapshot count is incorrect.");
  const [item] = items;
  if (stored.paymentStatus !== "PENDING" || stored.orderStatus !== "NEW") throw new Error("Initial order state is incorrect.");
  if (stored.currency !== "INR" || stored.shippingMinor !== 0 || stored.totalMinor !== stored.subtotalMinor) throw new Error("Server amount snapshot is incorrect.");
  if (stored.email !== input.contact.email || stored.country !== "IN") throw new Error("Contact/address snapshot is incorrect.");
  if (item.productSlug !== "l-shape-sofa" || item.quantity !== 2 || item.unitPriceMinor !== 6350000 || item.lineTotalMinor !== 12700000) throw new Error("Authoritative item snapshot is incorrect.");

  let conflictProtected = false;
  try {
    await createCheckoutOrder({ ...input, contact: { ...input.contact, customerName: "Different Retry" } });
  } catch (error) {
    conflictProtected = (error as Error).message === "IDEMPOTENCY_CONFLICT";
  }
  if (!conflictProtected) throw new Error("Incompatible idempotent retry was not rejected.");

  const duplicateCount = await db.select().from(orders).where(eq(orders.checkoutIdempotencyKey, key));
  if (duplicateCount.length !== 1) throw new Error("Duplicate order protection failed.");
  console.log("F005 integration validation passed: authoritative snapshots, PENDING state, and idempotent retry are correct.");
} finally {
  if (createdOrderId) {
    await db.transaction(async (transaction) => {
      await transaction.delete(orderItems).where(eq(orderItems.orderId, createdOrderId!));
      await transaction.delete(orders).where(eq(orders.id, createdOrderId!));
    });
  }
  await closeDb();
}
