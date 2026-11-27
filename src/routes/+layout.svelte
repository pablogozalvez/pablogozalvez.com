<script>
    import SEO from "../lib/SEO.svelte";
    import Navbar from "../lib/Navbar.svelte";
    import LanguageSuggestion from "../lib/LanguageSuggestion.svelte";
    import { getLocaleFromPath, provideI18n } from "../lib/i18n";
    import { browser, dev } from "$app/env";
    import { page } from "$app/state";
    import { IconArrowUp } from "../lib/icons";
    import "../app.css";

    export const hydrate = false;
    export const router = false;

    let { children } = $props();
    let scrollY = $state(0);
    let innerHeight = $state(0);
    let showScrollTop = $derived(innerHeight > 0 && scrollY > innerHeight * 0.8);

    const i18n = provideI18n(getLocaleFromPath(page.url.pathname));
    const { t, syncLocaleFromPath } = i18n;

    const currentPath = $derived(
        page.url.pathname + (browser ? page.url.search + page.url.hash : ""),
    );
    $effect(() => syncLocaleFromPath(page.url.pathname));

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        });
    }

    const analyticsBasePath = import.meta.env.VITE_VERCEL_OBSERVABILITY_BASEPATH || "/_vercel";
</script>

<svelte:window bind:scrollY bind:innerHeight />

<svelte:head>
    <script defer src={dev ? "https://va.vercel-scripts.com/v1/script.debug.js" : `${analyticsBasePath}/insights/script.js`}></script>
</svelte:head>

<SEO />

<a class="skip-link" href="#main-content">{$t("common.skipToContent")}</a>

<Navbar {currentPath} />

{#if showScrollTop}
    <button
        type="button"
        onclick={scrollToTop}
        class="scroll-top"
        aria-label={$t("common.scrollToTop")}
    >
        <IconArrowUp class="w-5 h-5" />
    </button>
{/if}

{@render children()}

<LanguageSuggestion {currentPath} />

<style>
    .scroll-top {
        position: fixed;
        inset-inline-end: max(1.25rem, env(safe-area-inset-right));
        inset-block-end: max(1.25rem, env(safe-area-inset-bottom));
        z-index: 40;
        display: grid;
        width: 2.75rem;
        height: 2.75rem;
        place-items: center;
        border: 1px solid var(--color-heading);
        background: var(--color-paper);
        color: var(--color-heading);
    }

    .scroll-top:hover {
        background: var(--color-heading);
        color: var(--color-paper);
    }
</style>
