export type RegistrationType = "sheet" | "slide";

export interface RegistrationEntry {
  slug: string;
  type: RegistrationType;
  url: string;
  resourceId: string;
  registeredAt: string;
}

const STORAGE_KEY = "gachon-terminal-registrations";

export function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match?.[1] ?? null;
}

export function extractPresentationId(url: string): string | null {
  const match = url.match(/\/presentation\/d\/([a-zA-Z0-9-_]+)/);
  return match?.[1] ?? null;
}

export function getRegistrations(): RegistrationEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RegistrationEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRegistration(entry: RegistrationEntry): void {
  const current = getRegistrations().filter(
    (item) => !(item.slug === entry.slug && item.type === entry.type)
  );
  current.push(entry);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("gachon-registrations-updated"));
}

export function getRegistration(
  slug: string,
  type: RegistrationType
): RegistrationEntry | undefined {
  return getRegistrations().find(
    (item) => item.slug === slug && item.type === type
  );
}
