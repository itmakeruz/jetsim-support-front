export const THEME_STORAGE_KEY = "jetsim-support-theme";

export type ThemePreference = "dark" | "light";

export function getStoredTheme(): ThemePreference {
  const v = localStorage.getItem(THEME_STORAGE_KEY);
  if (v === "dark" || v === "light") return v;
  return "light";
}

export function initTheme(): void {
  document.documentElement.classList.toggle(
    "dark",
    getStoredTheme() === "dark"
  );
}

export function setTheme(preference: ThemePreference): void {
  localStorage.setItem(THEME_STORAGE_KEY, preference);
  document.documentElement.classList.toggle("dark", preference === "dark");
}
