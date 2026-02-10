export type Lang = "et" | "en" | "ru";

const STORAGE_KEY = "futu_lang";

export function getInitialLang(): Lang {
  if (typeof window === "undefined") return "et";
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ["et", "en", "ru"].includes(stored)) {
      return stored as Lang;
    }
  } catch (error) {
    console.warn("Failed to read language from localStorage:", error);
  }
  
  return "et";
}

export function setLang(lang: Lang): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    console.warn("Failed to write language to localStorage:", error);
  }
}
