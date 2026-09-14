<script>
    import { getI18n } from "$lib/i18n";
    import { SITE_URL } from "$lib/site";

    const { locale } = getI18n();
    const socialImage = `${SITE_URL}/img/meta/og-image.png`;
    $: isSpanish = $locale === "es";
    $: title = isSpanish
        ? "Pablo Gozalvez | Desarrollador de software y videojuegos"
        : "Pablo Gozalvez | Software & Game Developer";
    $: description = isSpanish
        ? "Portfolio oficial de Pablo Gozalvez (Pablo Gozálvez), desarrollador de software y videojuegos en Alicante. Proyectos full stack, Unity y experiencias interactivas."
        : "Official portfolio of Pablo Gozalvez (Pablo Gozálvez), a software and game developer in Alicante, Spain. Explore full-stack, Unity and interactive projects.";
    $: canonicalUrl = isSpanish ? `${SITE_URL}/es` : `${SITE_URL}/`;
    $: ogLocale = isSpanish ? "es_ES" : "en_US";
    $: alternateLocale = isSpanish ? "en_US" : "es_ES";
    $: imageAlt = isSpanish
        ? "Portfolio de Pablo Gozalvez, desarrollador de software y videojuegos"
        : "Pablo Gozalvez software and game developer portfolio";

    $: personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${SITE_URL}/#pablo-gozalvez`,
        name: "Pablo Gozalvez",
        alternateName: "Pablo Gozálvez",
        url: `${SITE_URL}/`,
        jobTitle: isSpanish ? "Desarrollador de software y videojuegos" : "Software and Game Developer",
        description,
        address: {
            "@type": "PostalAddress",
            addressLocality: "Alicante",
            addressCountry: "ES",
        },
        sameAs: [
            "https://www.linkedin.com/in/pablogozalvez/",
            "https://github.com/pablogozalvez",
            "https://pablogozalvez.itch.io/",
        ],
        knowsAbout: [
            "Full-stack development",
            "Game development",
            "Unity",
            "SvelteKit",
            "Angular",
            "Java",
            "C#",
        ],
    };

    $: websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: "Pablo Gozalvez",
        alternateName: "Pablo Gozálvez Portfolio",
        inLanguage: ["en", "es"],
        author: { "@id": `${SITE_URL}/#pablo-gozalvez` },
    };
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href={canonicalUrl} />
    <link rel="alternate" hreflang="en" href={`${SITE_URL}/`} />
    <link rel="alternate" hreflang="es" href={`${SITE_URL}/es`} />
    <link rel="alternate" hreflang="x-default" href={`${SITE_URL}/`} />

    <!-- Open Graph -->
    <meta property="og:site_name" content="Pablo Gozalvez" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content={ogLocale} />
    <meta property="og:locale:alternate" content={alternateLocale} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:image" content={socialImage} />
    <meta property="og:image:secure_url" content={socialImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content={imageAlt} />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={socialImage} />
    <meta name="twitter:image:alt" content={imageAlt} />

    {@html `<script type="application/ld+json">${JSON.stringify(personSchema)}</script>`}
    {#if !isSpanish}
        {@html `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`}
    {/if}
</svelte:head>
