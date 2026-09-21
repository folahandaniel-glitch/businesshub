/**
 * Delivery pricing until a real courier integration lands (stage 9).
 * A flat, published estimate rather than an invented per-kilogram figure -
 * customers see it before paying, and it is easy to swap for a live rate
 * later without touching anything that calls this function.
 *
 * Kept in its own file with no server-only imports (no Prisma, no cookies)
 * so both the checkout page (server) and the checkout form (client) can
 * show the exact same figure without bundling server code into the browser.
 */
export function estimateDeliveryFee(state: string): number {
  const normalized = state.trim().toLowerCase();
  if (normalized === 'oyo') return 2000;
  if (['lagos', 'ogun', 'osun', 'ondo', 'ekiti'].includes(normalized)) return 3500;
  return 5500;
}
