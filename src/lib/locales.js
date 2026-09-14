export const AVAILABLE_LOCALES = ["en", "es"];
export const PREFIXED_LOCALES = ["es"];

export function getLocaleFromPath(pathname) {
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    return PREFIXED_LOCALES.includes(firstSegment) ? firstSegment : "en";
}

export function stripLocalePrefix(pathname) {
    const segments = pathname.split("/").filter(Boolean);
    if (PREFIXED_LOCALES.includes(segments[0])) segments.shift();
    return segments.length ? `/${segments.join("/")}` : "/";
}

export function localizePath(path, locale) {
    const match = path.match(/^([^?#]*)(.*)$/);
    const pathname = stripLocalePrefix(match?.[1] || "/");
    const suffix = match?.[2] || "";
    const localizedPathname = locale === "en" ? pathname : `/${locale}${pathname === "/" ? "" : pathname}`;
    return `${localizedPathname}${suffix}`;
}
