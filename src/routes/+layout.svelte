<script>
    import SEO from "../lib/SEO.svelte";
    import Navbar from "../lib/Navbar.svelte";
    import Cursor from "../lib/Cursor.svelte";
    import Loader from "../lib/Loader.svelte";
    import LanguageSuggestion from "../lib/LanguageSuggestion.svelte";
    import { getLocaleFromPath, provideI18n } from "../lib/i18n";
    import { onMount } from "svelte";
    import { page, navigating } from "$app/stores";
    import { fly } from "svelte/transition";
    import { isLowPerformanceMode } from "../lib/actions";
    import { animationVisibility } from "../lib/animation-visibility";
    import { IconArrowUp } from "../lib/icons";
    import "../app.css";

    export const hydrate = false;
    export const router = false;

    let scrollY = 0;
    let innerHeight = 0;
    let showPdfModal = false;
    let showScrollTop = false;
    let reducedEffects = false;

    const i18n = provideI18n(getLocaleFromPath($page.url.pathname));
    const { t, syncLocaleFromPath } = i18n;

    $: syncLocaleFromPath($page.url.pathname);

    $: if (innerHeight > 0) {
        showScrollTop = scrollY > innerHeight * 0.8;
    }

    onMount(() => {
        reducedEffects = isLowPerformanceMode();
    });

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        });
    }

    $: isLoading = Boolean($navigating?.to && $navigating.from?.url.pathname !== $navigating.to.url.pathname);
</script>

<svelte:window bind:scrollY bind:innerHeight />

<SEO />

<Loader {isLoading} title={$t("common.loading")} />

<a class="skip-link" href="#main-content">{$t("common.skipToContent")}</a>

<Cursor hidden={showPdfModal} />

<Navbar hideNav={showPdfModal} />

<div class="layout-background">
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none" use:animationVisibility>
        <div class="absolute inset-0 static-background-glow"></div>
    </div>
</div>

{#if showScrollTop}
    <button
        on:click={scrollToTop}
        transition:fly={{ y: 20, duration: 300 }}
        class="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label={$t("common.scrollToTop")}
    >
        <IconArrowUp class="w-5 h-5 text-white" />
    </button>
{/if}

<slot />

<LanguageSuggestion />

<!--<div class="min-h-screen text-white font-sans overflow-x-hidden"></div>-->

<style>
    :global(html) {
        scroll-behavior: smooth;
    }
    :global(body) {
        background: #030712 !important;
    }

    .static-background-glow {
        display: block;
        background:
            radial-gradient(circle at 8% 8%, rgba(37, 99, 235, 0.08), transparent 34%),
            radial-gradient(circle at 92% 92%, rgba(147, 51, 234, 0.08), transparent 34%);
    }
</style>
