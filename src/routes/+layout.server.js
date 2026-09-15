import { env } from "$env/dynamic/private";

export function load() {
    return {
        turnstileSiteKey: env.TURNSTILE_SITE_KEY ?? "",
    };
}
