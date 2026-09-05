"use server";

import { cookies } from "next/headers";
import {
  parseCheckoutLines,
  parseCheckoutMode,
  parseIdempotencyKey,
  validateCheckoutContact,
} from "@/lib/checkout/contracts";
import type { CheckoutActionState } from "@/lib/checkout/action-state";
import { createCheckoutOrder } from "@/lib/orders/service";
import { GUEST_ORDER_ACCESS_SECONDS, guestOrderCookieName } from "@/lib/security/order-access";

export async function createCheckoutOrderAction(
  _previous: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const mode = parseCheckoutMode(formData.get("checkoutMode"));
  const lines = parseCheckoutLines(formData.get("lines"));
  const idempotencyKey = parseIdempotencyKey(formData.get("idempotencyKey"));
  const validation = validateCheckoutContact({
    customerName: formData.get("customerName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2"),
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
  });

  if (!validation.valid) return { ok: false, message: "Review the highlighted delivery details.", fieldErrors: validation.errors };
  if (!mode || !lines || !idempotencyKey) return { ok: false, message: "Your checkout selection changed. Refresh the page and try again.", fieldErrors: {} };

  try {
    const result = await createCheckoutOrder({ mode, lines, contact: validation.contact, idempotencyKey });
    const cookieStore = await cookies();
    cookieStore.set(guestOrderCookieName(result.reference), result.guestToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: `/orders/${result.reference}`,
      maxAge: GUEST_ORDER_ACCESS_SECONDS,
    });
    return {
      ok: true,
      message: result.reused ? "Your existing payment-pending order was recovered." : "Your payment-pending order is ready.",
      fieldErrors: {},
      reference: result.reference,
    };
  } catch (error) {
    const code = (error as Error).message;
    if (code === "IDEMPOTENCY_CONFLICT") return { ok: false, message: "This checkout attempt was already used for different details. Refresh and try again.", fieldErrors: {} };
    if (code === "INELIGIBLE_PRODUCT") return { ok: false, message: "A selected item is no longer published or eligible for checkout. Return to your cart and review it.", fieldErrors: {} };
    console.error("checkout_order_creation_failed", { code });
    return { ok: false, message: "We could not prepare your order. Your cart is safe—please try again.", fieldErrors: {} };
  }
}
