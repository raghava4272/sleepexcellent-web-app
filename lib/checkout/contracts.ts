export const checkoutModes = ["CART", "BUY_NOW"] as const;
export type CheckoutMode = (typeof checkoutModes)[number];

export type CheckoutLineInput = {
  slug: string;
  quantity: number;
};

export type CheckoutContact = {
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
};

export type CheckoutField = keyof CheckoutContact;
export type CheckoutFieldErrors = Partial<Record<CheckoutField, string>>;

export const MAX_CHECKOUT_LINES = 40;
export const MAX_CHECKOUT_QUANTITY = 99;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength + 1) : "";
}

export function parseCheckoutMode(value: unknown): CheckoutMode | null {
  return value === "CART" || value === "BUY_NOW" ? value : null;
}

export function parseCheckoutLines(value: unknown): CheckoutLineInput[] | null {
  let candidate = value;
  if (typeof value === "string") {
    try {
      candidate = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(candidate) || candidate.length < 1 || candidate.length > MAX_CHECKOUT_LINES) return null;

  const merged = new Map<string, number>();
  for (const line of candidate) {
    if (!line || typeof line !== "object") return null;
    const { slug, quantity } = line as { slug?: unknown; quantity?: unknown };
    if (typeof slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(slug)) return null;
    if (typeof quantity !== "number" || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_CHECKOUT_QUANTITY) return null;
    const next = (merged.get(slug) ?? 0) + quantity;
    if (next > MAX_CHECKOUT_QUANTITY) return null;
    merged.set(slug, next);
  }
  return [...merged].map(([slug, quantity]) => ({ slug, quantity }));
}

export function validateCheckoutContact(input: Record<string, unknown>) {
  const contact: CheckoutContact = {
    customerName: clean(input.customerName, 120),
    email: clean(input.email, 254).toLowerCase(),
    phone: clean(input.phone, 18),
    addressLine1: clean(input.addressLine1, 160),
    addressLine2: clean(input.addressLine2, 160) || null,
    city: clean(input.city, 80),
    state: clean(input.state, 80),
    postalCode: clean(input.postalCode, 6),
  };
  const errors: CheckoutFieldErrors = {};

  if (contact.customerName.length < 2 || contact.customerName.length > 120) errors.customerName = "Enter the customer name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) || contact.email.length > 254) errors.email = "Enter a valid email address.";

  const phoneDigits = contact.phone.replace(/\D/g, "");
  const localPhone = phoneDigits.length === 12 && phoneDigits.startsWith("91") ? phoneDigits.slice(2) : phoneDigits;
  if (!/^[6-9][0-9]{9}$/.test(localPhone)) errors.phone = "Enter a valid 10-digit Indian mobile number.";
  else contact.phone = `+91${localPhone}`;

  if (contact.addressLine1.length < 3 || contact.addressLine1.length > 160) errors.addressLine1 = "Enter the delivery address.";
  if (contact.addressLine2 && contact.addressLine2.length > 160) errors.addressLine2 = "Keep the second address line under 160 characters.";
  if (contact.city.length < 2 || contact.city.length > 80) errors.city = "Enter the city.";
  if (contact.state.length < 2 || contact.state.length > 80) errors.state = "Enter the state.";
  if (!/^[1-9][0-9]{5}$/.test(contact.postalCode)) errors.postalCode = "Enter a valid six-digit Indian PIN code.";

  return { contact, errors, valid: Object.keys(errors).length === 0 };
}

export function parseIdempotencyKey(value: unknown) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value.toLowerCase()
    : null;
}
