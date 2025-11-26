<script>
    export let title = "Pablo Gozálvez";
    export let description =
        "Portfolio of Pablo Gozálvez, Full Stack Developer specialized in multiplatform development and videogames.";
    export let keywords = "portfolio, developer, web, Full Stack";
    export let canonicalUrl = "https://pablogozalvez.com/";
    export let ogImage = "/meta/og-image.png";
</script>

<svelte:head>
    <title>{title} - Full Stack Developer</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href={canonicalUrl} />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="Pablo Gozálvez portfolio preview" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />
</svelte:head>
