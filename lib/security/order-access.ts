import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const GUEST_ORDER_ACCESS_SECONDS = 2 * 60 * 60;

export function createGuestOrderAccess() {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    hash: hashGuestOrderToken(token),
    expiresAt: new Date(Date.now() + GUEST_ORDER_ACCESS_SECONDS * 1000),
  };
}

export function hashGuestOrderToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function guestOrderCookieName(reference: string) {
  return `se_order_${reference.toLowerCase()}`;
}

export function tokenHashMatches(token: string, expectedHash: string) {
  const actual = Buffer.from(hashGuestOrderToken(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
