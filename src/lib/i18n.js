import { getContext, setContext } from "svelte";
import { goto } from "$app/navigation";
import { writable, derived } from "svelte/store";
import en from "../../static/i18n/en.json";
import es from "../../static/i18n/es.json";
import { AVAILABLE_LOCALES, getLocaleFromPath, localizePath } from "./locales";

export { AVAILABLE_LOCALES, getLocaleFromPath, localizePath } from "./locales";

const I18N_CONTEXT = Symbol("i18n");
const initialTranslations = { en, es };

export function createI18n(initialLocale = "en") {
    const locale = writable(initialLocale);
    const translations = writable(initialTranslations);
    const isLocaleLoaded = writable(true);
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

    async function initializeBrowserLocale() {
        if (typeof window === "undefined") return;

        const routeLocale = getLocaleFromPath(window.location.pathname);
        if (routeLocale !== "en") {
            localStorage.setItem("locale", routeLocale);
            return;
        }

        const storedLocale = localStorage.getItem("locale");
        const browserLocale = navigator.language?.slice(0, 2);
        const preferredLocale = AVAILABLE_LOCALES.includes(storedLocale)
            ? storedLocale
            : AVAILABLE_LOCALES.includes(browserLocale)
                ? browserLocale
                : "en";

        localStorage.setItem("locale", preferredLocale);
        if (preferredLocale !== "en") {
            await goto(localizePath(`${window.location.pathname}${window.location.search}${window.location.hash}`, preferredLocale));
        }
    }

    async function setLocale(nextLocale) {
        if (!AVAILABLE_LOCALES.includes(nextLocale) || typeof window === "undefined") return;
        localStorage.setItem("locale", nextLocale);
        await goto(localizePath(`${window.location.pathname}${window.location.search}${window.location.hash}`, nextLocale));
    }

    return { locale, t, isLocaleLoaded, initializeBrowserLocale, setLocale, syncLocaleFromPath };
}

export function provideI18n(initialLocale) {
    return setContext(I18N_CONTEXT, createI18n(initialLocale));
}

export function getI18n() {
    return getContext(I18N_CONTEXT);
}
