import { TURNSTILE_SITE_KEY } from "$app/env/private";

export function load() {
    return {
        turnstileSiteKey: TURNSTILE_SITE_KEY ?? "",
    };
}
