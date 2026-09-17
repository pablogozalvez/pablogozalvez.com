<script>
    import SEO from "../lib/SEO.svelte";
    import Navbar from "../lib/Navbar.svelte";
    import Cursor from "../lib/Cursor.svelte";
    import Loader from "../lib/Loader.svelte";
    import { getLocaleFromPath, provideI18n } from "../lib/i18n";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { fly } from "svelte/transition";
    import { isLowPerformanceMode } from "../lib/actions";
    import "../app.css";

    export const hydrate = false;
    export const router = false;

    let isPageLoaded = false;
    let scrollY = 0;
    let innerHeight = 0;
    let showPdfModal = false;
    let showScrollTop = false;
    let reducedEffects = false;

    const i18n = provideI18n(getLocaleFromPath($page.url.pathname));
    const { initializeBrowserLocale, isLocaleLoaded, syncLocaleFromPath } = i18n;

    $: syncLocaleFromPath($page.url.pathname);

    $: if (innerHeight > 0) {
        showScrollTop = scrollY > innerHeight * 0.8;
    }

    onMount(() => {
        reducedEffects = isLowPerformanceMode();
        let isMounted = true;
        let handlePageLoad;
        const pageLoadPromise = document.readyState === "complete"
            ? Promise.resolve()
            : new Promise((resolve) => {
                handlePageLoad = resolve;
                window.addEventListener("load", handlePageLoad, { once: true });
            });

        Promise.all([initializeBrowserLocale(), pageLoadPromise]).finally(() => {
            if (isMounted) isPageLoaded = true;
        });

        return () => {
            isMounted = false;
            if (handlePageLoad) window.removeEventListener("load", handlePageLoad);
        };
    });

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    $: isLoading = !$isLocaleLoaded || !isPageLoaded;
</script>

<svelte:window bind:scrollY bind:innerHeight />

<SEO />

<Loader {isLoading} />

<Cursor hidden={showPdfModal} />

<Navbar hideNav={showPdfModal} />

<div class="layout-background">
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {#if reducedEffects}
            <div class="absolute inset-0 static-background-glow"></div>
        {:else}
            <div
                class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse"
            ></div>
            <div
                class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse"
                style="animation-delay: 2s;"
            ></div>
        {/if}
    </div>
</div>

{#if showScrollTop}
    <button
        on:click={scrollToTop}
        transition:fly={{ y: 20, duration: 300 }}
        class="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all shadow-lg group"
        aria-label="Scroll to top"
    >
        <svg class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
    </button>
{/if}

{#if $isLocaleLoaded}
    <slot />
{/if}

<!--<div class="min-h-screen text-white font-sans overflow-x-hidden"></div>-->

<style>
    :global(html) {
        scroll-behavior: smooth;
    }
    :global(body) {
        background: #030712 !important;
    }

    .static-background-glow {
        background:
            radial-gradient(circle at 8% 8%, rgba(37, 99, 235, 0.1), transparent 34%),
            radial-gradient(circle at 92% 92%, rgba(147, 51, 234, 0.1), transparent 34%);
    }
</style>
