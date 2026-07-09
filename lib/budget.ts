const BUDGET_STORAGE_KEY = "gachon-terminal-budget-total";

export function getBudgetTotal(): number | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(BUDGET_STORAGE_KEY);
    if (raw == null || raw === "") return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveBudgetTotal(amount: number): void {
  window.localStorage.setItem(BUDGET_STORAGE_KEY, String(amount));
  window.dispatchEvent(new Event("gachon-budget-updated"));
}

export function clearBudgetTotal(): void {
  window.localStorage.removeItem(BUDGET_STORAGE_KEY);
  window.dispatchEvent(new Event("gachon-budget-updated"));
}
