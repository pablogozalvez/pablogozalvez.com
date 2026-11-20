import { getLocaleFromPath } from "#lib/locales.js";

export async function handle({ event, resolve }) {
    const locale = getLocaleFromPath(event.url.pathname);

    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace("%lang%", locale),
    });
}
