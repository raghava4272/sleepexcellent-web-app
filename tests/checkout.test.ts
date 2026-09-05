import assert from "node:assert/strict";
import test from "node:test";
import { parseCheckoutLines, validateCheckoutContact } from "../lib/checkout/contracts";
import { calculateCheckoutQuote } from "../lib/checkout/pricing";
import { createGuestOrderAccess, hashGuestOrderToken, tokenHashMatches } from "../lib/security/order-access";

const directProduct = {
  id: "11111111-1111-4111-8111-111111111111",
  slug: "authoritative-sofa",
  name: "Authoritative Sofa",
  category: "SOFA" as const,
  configuration: "3+2",
  size: null,
  fixedPriceMinor: 1250000,
};

test("checkout lines merge duplicate product identity and reject invalid quantity", () => {
  assert.deepEqual(parseCheckoutLines([
    { slug: "authoritative-sofa", quantity: 1 },
    { slug: "authoritative-sofa", quantity: 2 },
  ]), [{ slug: "authoritative-sofa", quantity: 3 }]);
  assert.equal(parseCheckoutLines([{ slug: "authoritative-sofa", quantity: 0 }]), null);
  assert.equal(parseCheckoutLines([{ slug: "authoritative-sofa", quantity: 1.5 }]), null);
});

test("server quote derives all money from authoritative products", () => {
  const quote = calculateCheckoutQuote([{ slug: directProduct.slug, quantity: 2 }], [directProduct], 0);
  assert.equal(quote.lines[0].fixedPriceMinor, 1250000);
  assert.equal(quote.lines[0].lineTotalMinor, 2500000);
  assert.equal(quote.subtotalMinor, 2500000);
  assert.equal(quote.shippingMinor, 0);
  assert.equal(quote.totalMinor, 2500000);
  assert.equal(quote.currency, "INR");
});

test("ceiling and unresolved products cannot enter a checkout quote", () => {
  assert.throws(() => calculateCheckoutQuote([{ slug: "ceiling", quantity: 1 }], [{ ...directProduct, slug: "ceiling", category: "CEILING", fixedPriceMinor: null }], 0), /INELIGIBLE_PRODUCT/);
  assert.throws(() => calculateCheckoutQuote([{ slug: "missing", quantity: 1 }], [directProduct], 0), /INELIGIBLE_PRODUCT/);
});

test("India contact validation normalises mobile and requires email and PIN", () => {
  const valid = validateCheckoutContact({ customerName: "Test Customer", email: "TEST@example.com", phone: "+91 98765 43210", addressLine1: "1 Test Road", city: "Hyderabad", state: "Telangana", postalCode: "500001" });
  assert.equal(valid.valid, true);
  assert.equal(valid.contact.email, "test@example.com");
  assert.equal(valid.contact.phone, "+919876543210");
  const invalid = validateCheckoutContact({ customerName: "T", email: "bad", phone: "123", addressLine1: "", city: "", state: "", postalCode: "000000" });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.postalCode);
});

test("guest confirmation capability uses a 32-byte random token and SHA-256 hash", () => {
  const access = createGuestOrderAccess();
  assert.equal(Buffer.from(access.token, "base64url").length, 32);
  assert.match(access.hash, /^[0-9a-f]{64}$/);
  assert.equal(access.hash, hashGuestOrderToken(access.token));
  assert.equal(tokenHashMatches(access.token, access.hash), true);
  assert.equal(tokenHashMatches(`${access.token}x`, access.hash), false);
  assert.ok(access.expiresAt.getTime() > Date.now());
});
