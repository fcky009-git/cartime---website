export type Theme = "hybrid" | "dark" | "light";
export const themeNames: Theme[] = ["hybrid", "dark", "light"];

const storageKey = "cartime-theme";
const changeEvent = "cartime-theme-change";
// Used when the browser refuses storage, so the choice still lasts for this visit.
let sessionTheme: Theme | null = null;

export function subscribeToTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

export function readTheme(): Theme {
  if (sessionTheme) return sessionTheme;
  try {
    const stored = localStorage.getItem(storageKey);
    return themeNames.includes(stored as Theme) ? stored as Theme : "hybrid";
  } catch {
    return "hybrid";
  }
}

export function saveTheme(next: Theme) {
  try {
    localStorage.setItem(storageKey, next);
    sessionTheme = null;
  } catch {
    sessionTheme = next;
  }
  window.dispatchEvent(new Event(changeEvent));
}
