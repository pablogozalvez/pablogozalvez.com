import { AVAILABLE_LOCALES } from "./locales";
import en from "../i18n/en.json";
import es from "../i18n/es.json";

export const LANGUAGE_SUGGESTION_SESSION_KEY = "language-suggestion-dismissed";

export function getSuggestedLocale(languages, currentLocale) {
    const preferred = languages
        .filter((language) => typeof language === "string")
        .map((language) => language.toLowerCase().split("-")[0])
        .find((language) => AVAILABLE_LOCALES.includes(language));
    return preferred && preferred !== currentLocale ? preferred : null;
}

const translations = { en, es };

export function getLanguageSuggestionCopy(locale) {
    return translations[locale].languageSuggestion;
}
