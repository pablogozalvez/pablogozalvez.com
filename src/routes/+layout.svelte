<script>
    import SEO from "../lib/SEO.svelte";
    import Navbar from "../lib/Navbar.svelte";
    import LanguageSuggestion from "../lib/LanguageSuggestion.svelte";
    import { getLocaleFromPath, provideI18n } from "../lib/i18n";
    import { browser, dev } from "$app/env";
    import { page } from "$app/state";
    import { fly } from "svelte/transition";
    import { IconArrowUp } from "../lib/icons";
    import "../app.css";

    export const hydrate = false;
    export const router = false;

    let { children } = $props();
    let scrollY = $state(0);
    let innerHeight = $state(0);
    let showPdfModal = false;
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

<Navbar hideNav={showPdfModal} {currentPath} />

{#if showScrollTop}
    <button
        onclick={scrollToTop}
        transition:fly={{ y: 20, duration: 300 }}
        class="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label={$t("common.scrollToTop")}
    >
        <IconArrowUp class="w-5 h-5 text-white" />
    </button>
{/if}

{@render children()}

<LanguageSuggestion {currentPath} />

<style>
    :global(body) {
        background: #030712 !important;
    }
</style>
