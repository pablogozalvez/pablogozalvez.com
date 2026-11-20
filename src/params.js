import { defineParams } from "@sveltejs/kit/params";
import { PREFIXED_LOCALES } from "#lib/locales.js";

export const params = defineParams({
    locale: (param) => PREFIXED_LOCALES.includes(param) ? param : undefined,
});
