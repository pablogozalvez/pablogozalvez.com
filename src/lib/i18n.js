import { getContext, setContext } from "svelte";
import { writable, derived } from "svelte/store";
import en from "../i18n/en.json";
import es from "../i18n/es.json";
import { AVAILABLE_LOCALES, getLocaleFromPath, localizePath } from "./locales";

export { AVAILABLE_LOCALES, getLocaleFromPath, localizePath } from "./locales";

const I18N_CONTEXT = Symbol("i18n");
const initialTranslations = { en, es };

export function createI18n(initialLocale = "en") {
    const locale = writable(initialLocale);
    const translations = writable(initialTranslations);
    const t = derived([locale, translations], ([$locale, $translations]) => (key) => {
        const keys = key.split(".");
        let text = $translations[$locale];
        for (const keyPart of keys) {
            if (text === undefined) break;
            text = text[keyPart];
        }
        return text || key;
    });

    function syncLocaleFromPath(pathname) {
        const nextLocale = getLocaleFromPath(pathname);
        locale.set(nextLocale);
        if (typeof document !== "undefined") document.documentElement.lang = nextLocale;
    }

    return { locale, t, syncLocaleFromPath };
}

export function provideI18n(initialLocale) {
    return setContext(I18N_CONTEXT, createI18n(initialLocale));
}

export function getI18n() {
    return getContext(I18N_CONTEXT);
}
