export const LKR_TO_USD = 320;

export function lkr(price: number): string {
  return `LKR ${Math.round(price).toLocaleString()}`;
}

export function usdLabel(price: number): string {
  return `$${(price / LKR_TO_USD).toFixed(2)}`;
}
