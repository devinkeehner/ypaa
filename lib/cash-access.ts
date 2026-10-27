import "server-only";

export function normalizeCashCode(value: unknown): string {
  return String(value || "").trim().toUpperCase();
}

export function maskCashCode(code: string): string {
  return code.length <= 4 ? "****" : `****${code.slice(-4)}`;
}
