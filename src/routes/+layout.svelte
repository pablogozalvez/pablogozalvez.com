<script>
    import SEO from "../lib/SEO.svelte";
    import Navbar from "../lib/Navbar.svelte";
    import Cursor from "../lib/Cursor.svelte";
    import Loader from "../lib/Loader.svelte";
    import { isLocaleLoaded } from "../lib/i18n";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import "../app.css";

    let isPageLoaded = false;
    let scrollY = 0;
    let innerHeight = 0;
    let showPdfModal = false;

    onMount(() => {
        // Esperar a que se cargue la ventana (imágenes, estilos, etc)
        if (document.readyState === "complete") {
            setTimeout(() => {
                isPageLoaded = true;
            }, 100);
        } else {
            window.addEventListener("load", () => {
                setTimeout(() => {
                    isPageLoaded = true;
                }, 100);
            });
        }
    });

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    $: isLoading = !$isLocaleLoaded || !isPageLoaded;
    $: showScrollTop = scrollY > innerHeight * 0.8;
</script>

<svelte:window bind:scrollY bind:innerHeight />

<SEO
    title="Pablo Gozálvez - Portfolio"
    description="Portfolio of Pablo Gozálvez, Full Stack Developer specialized in multiplatform development and videogames."
/>

<Loader {isLoading} />

<Cursor hidden={showPdfModal} />

<Navbar hideNav={showPdfModal} />

<div class="layout-background">
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
            class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse"
        ></div>
        <div
            class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse"
            style="animation-delay: 2s;"
        ></div>
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

<slot />

<!--<div class="min-h-screen text-white font-sans overflow-x-hidden"></div>-->

<style>
    :global(html) {
        scroll-behavior: smooth;
    }
    :global(body) {
        background: #030712 !important;
    }
</style>
