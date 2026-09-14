import { PREFIXED_LOCALES } from "$lib/locales";

export function match(param) {
    return PREFIXED_LOCALES.includes(param);
}
