import { writable, derived, get } from "svelte/store";

export const AVAILABLE_LOCALES = ["en", "es"];

// Cache para evitar lecturas repetidas de localStorage
let cachedLocale = null;

function getInitialLocale() {
    if (typeof window !== "undefined") {
        if (cachedLocale) return cachedLocale;

        const stored = localStorage.getItem("locale");
        if (AVAILABLE_LOCALES.includes(stored)) {
            cachedLocale = stored;
            return stored;
        }
        const navLang = navigator.language?.slice(0, 2) || "en";
        if (AVAILABLE_LOCALES.includes(navLang)) {
            cachedLocale = navLang;
            return navLang;
        }
        cachedLocale = "en";
        return "en";
    }
    return "en";
}

const initialLocale = getInitialLocale();
if (typeof window !== "undefined") {
    localStorage.setItem("locale", initialLocale);
}
export const locale = writable(initialLocale);
export const translations = writable({});

// Cache para traducciones ya resueltas
const translationCache = new Map();

export const t = derived([locale, translations], ([$locale, $translations]) => {
    // Limpiar cache cuando cambia el idioma
    if (translationCache.size > 0 && !translationCache.has($locale)) {
        translationCache.clear();
    }

    return (key) => {
        const cacheKey = `${$locale}:${key}`;
        if (translationCache.has(cacheKey)) {
            return translationCache.get(cacheKey);
        }

        const keys = key.split(".");
        let text = $translations[$locale];
        for (const k of keys) {
            if (text === undefined) break;
            text = text[k];
        }
        const result = text || key;
        translationCache.set(cacheKey, result);
        return result;
    };
});

export async function loadTranslations(lang) {
    if (!AVAILABLE_LOCALES.includes(lang)) return;
    try {
        const res = await fetch(`/i18n/${lang}.json`);
        if (res.ok) {
            const data = await res.json();
            translations.update((t) => ({ ...t, [lang]: data }));
        } else {
            console.error(`Could not load translations for ${lang}`);
        }
    } catch (e) {
        console.error(`Error loading translations for ${lang}:`, e);
    }
}

export async function setLocale(lang) {
    if (!AVAILABLE_LOCALES.includes(lang)) return;
    const currentTranslations = get(translations);
    if (!currentTranslations[lang]) {
        await loadTranslations(lang);
    }
    locale.set(lang);
    cachedLocale = lang;
    if (typeof window !== "undefined") {
        localStorage.setItem("locale", lang);
    }
}

export const isLocaleLoaded = writable(false);

// Initial load only in browser
if (typeof window !== "undefined") {
    Promise.all(AVAILABLE_LOCALES.map(loadTranslations)).then(() => {
        isLocaleLoaded.set(true);
    });
}
