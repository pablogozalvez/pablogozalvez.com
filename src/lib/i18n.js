import { writable, derived, get } from "svelte/store";

export const AVAILABLE_LOCALES = ["en", "es"];

function getInitialLocale() {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem("locale");
        if (AVAILABLE_LOCALES.includes(stored)) return stored;
        const navLang = navigator.language?.slice(0, 2) || "en";
        if (AVAILABLE_LOCALES.includes(navLang)) {
            return navLang;
        }
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

export const t = derived([locale, translations], ([$locale, $translations]) => (key) => {
    const keys = key.split(".");
    let text = $translations[$locale];
    for (const k of keys) {
        if (text === undefined) break;
        text = text[k];
    }
    return text || key;
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
