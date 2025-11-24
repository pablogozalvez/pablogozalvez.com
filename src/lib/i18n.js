import { writable, derived, get } from "svelte/store";

export const locale = writable("en");
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
    const currentTranslations = get(translations);
    if (!currentTranslations[lang]) {
        await loadTranslations(lang);
    }
    locale.set(lang);
}

export const isLocaleLoaded = writable(false);

// Initial load
Promise.all([loadTranslations("en"), loadTranslations("es")]).then(() => {
    isLocaleLoaded.set(true);
});
