import { AVAILABLE_LOCALES, localizePath } from "$lib/locales";
import { SITE_URL } from "$lib/site";

export async function GET() {
    const lastmod = "2026-09-17";
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${AVAILABLE_LOCALES.map(
    (locale) => `  <url>
    <loc>${SITE_URL}${localizePath("/", locale)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
).join("\n")}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Cache-Control": "public, max-age=0, must-revalidate",
            "Content-Type": "application/xml; charset=utf-8",
            "X-Content-Type-Options": "nosniff",
        },
    });
}
