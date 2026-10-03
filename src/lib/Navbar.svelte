<script>
    import { getI18n } from "./i18n";
    import { fade, fly, scale } from "svelte/transition";
    import { cubicOut, cubicInOut } from "svelte/easing";
    import { rafThrottle } from "./actions";
    import { page } from "$app/stores";
    import { localizePath } from "./locales";
    import { browser } from "$app/environment";
    import { modal } from "./modal";

    export let activeSection = "home";
    export let hideNav = false;

    const { t, locale } = getI18n();

    let scrollY = 0;
    let innerWidth = 0;
    let innerHeight = 0;

    let navElement;
    let mouseX = 0;
    let mouseY = 0;

    let isMenuOpen = false;

    $: isMobile = innerWidth < 768;
    $: if (!isMobile && isMenuOpen) isMenuOpen = false;

    const SCROLL_THRESHOLD = 500;

    $: rawProgress = Math.min(scrollY / SCROLL_THRESHOLD, 1);
    $: progress = 1 - Math.pow(1 - rawProgress, 3);

    // Cachear cálculos de estilos
    let navStylesCache = "";

    function updateNavStyles() {
        const targetWidth = isMobile ? "92%" : "680px";
        const currentWidth = isMenuOpen ? "100%" : `calc(100% - (${progress} * (100% - ${targetWidth})))`;
        const marginTop = isMenuOpen ? 0 : progress * 24;
        const borderRadius = isMenuOpen ? 0 : progress * 50;
        const paddingY = isMenuOpen ? 24 : 24 - progress * 10;
        const paddingX = isMenuOpen ? 32 : 32 - progress * 8;
        const bgOpacity = isMenuOpen ? 0.98 : progress * 0.7;
        const borderOpacity = isMenuOpen ? 0 : progress * 0.12;
        const blurAmount = isMenuOpen ? 20 : progress * 12;

        navStylesCache = `
            width: ${currentWidth};
            margin-top: ${marginTop}px;
            border-radius: ${borderRadius}px;
            padding: ${paddingY}px ${paddingX}px;
            background-color: rgba(5, 5, 5, ${bgOpacity});
            border-color: rgba(255, 255, 255, ${borderOpacity});
            backdrop-filter: blur(${blurAmount}px);
            transform: translate3d(0,0,0);
        `;
    }

    $: progress, isMobile, isMenuOpen, updateNavStyles();

    $: sections = [
        { id: "home", label: $t("nav.home"), num: null },
        { id: "about", label: $t("nav.about"), num: "01" },
        { id: "projects", label: $t("nav.projects"), num: "02" },
        { id: "contact", label: $t("nav.contact"), num: "03" },
    ];

    $: alternateLanguageUrl = localizePath(`${$page.url.pathname}${browser ? $page.url.search + $page.url.hash : ""}`, $locale === "en" ? "es" : "en");

    // Detección de sección
    let lastScrollCheck = 0;
    $: if (typeof document !== "undefined" && innerHeight && scrollY >= 0) {
        const now = Date.now();
        if (now - lastScrollCheck > 100) {
            // Throttle a 100ms
            lastScrollCheck = now;
            const center = innerHeight / 3;
            for (const section of sections) {
                const el = document.getElementById(section.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < center && rect.bottom > center) {
                        activeSection = section.id;
                        break;
                    }
                }
            }
        }
    }

    const handleMouseMove = rafThrottle((e) => {
        if (navElement) {
            const rect = navElement.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        }
    });
</script>

<svelte:window bind:scrollY bind:innerWidth bind:innerHeight />

{#if isMenuOpen}
    <dialog
        id="mobile-navigation"
        use:modal
        aria-labelledby="mobile-menu-title"
        on:cancel|preventDefault={() => (isMenuOpen = false)}
        class="m-0 max-w-none max-h-none w-full h-[100dvh] border-0 text-white bg-[#050505]/98 backdrop-blur-2xl flex flex-col items-center justify-center"
        in:fade={{ duration: 200, easing: cubicInOut }}
        out:fade={{ duration: 100, easing: cubicInOut }}
    >
        <h2 id="mobile-menu-title" data-modal-title tabindex="-1" class="sr-only">{$t("nav.menu")}</h2>
        <button type="button" on:click={() => (isMenuOpen = false)} aria-label={$t("nav.closeMenu")} class="absolute top-6 right-6 z-20 w-12 h-12 rounded-full text-3xl hover:bg-white/10">×</button>
        <div class="absolute inset-0" in:scale={{ start: 1.1, duration: 800, easing: cubicOut }}></div>

        <nav aria-label={$t("nav.menu")} class="flex flex-col items-center gap-8 relative z-10">
            {#each sections as section, i}
                <a
                    href={"#" + section.id}
                    on:click={() => (isMenuOpen = false)}
                    in:fly={{ y: 50, delay: 200 + i * 100, duration: 500, easing: cubicOut }}
                    class="flex items-baseline gap-3 transition-all duration-300 hover:scale-110
                    {activeSection === section.id ? 'scale-105' : 'hover:text-white'}"
                >
                    {#if section.num}
                        <span class="text-sm font-mono font-medium tracking-wide {activeSection === section.id ? 'text-gray-400' : 'text-white/20'}">{section.num}</span>
                    {/if}
                    <span class="text-5xl md:text-6xl font-black uppercase tracking-tighter {activeSection === section.id ? 'text-white' : 'text-white/40'}">{section.label}</span>
                </a>
            {/each}
            <div class="mt-8 pt-8 border-t border-white/10 w-20 flex justify-center">
                <a
                    href={alternateLanguageUrl}
                    on:click={() => (isMenuOpen = false)}
                    aria-label={$locale === "en" ? "Español" : "English"}
                    hreflang={$locale === "en" ? "es" : "en"}
                    lang={$locale === "en" ? "es" : "en"}
                    class="text-sm font-mono text-gray-400 border border-white/10 rounded-full px-4 py-3 hover:bg-white/10 hover:text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                    <img
                        src={$locale === "en" ? "/img/icons/es.png" : "/img/icons/us.png"}
                        alt=""
                        width="20" height="20"
                        class="w-5 h-5 object-contain"
                    />
                    <span>{$locale === "en" ? "ES" : "EN"}</span>
                </a>
            </div>
        </nav>
    </dialog>
{/if}

<nav
    aria-label={$t("nav.primary")}
    class="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none transition-transform duration-500 {hideNav
        ? '-translate-y-[150%]'
        : 'translate-y-0'}"
>
    <div
        bind:this={navElement}
        on:mousemove={handleMouseMove}
        role="none"
        class="pointer-events-auto relative group/nav flex items-center justify-between border border-transparent overflow-hidden shadow-2xl"
        style={navStylesCache}
    >
        <div
            class="hidden md:block absolute inset-0 pointer-events-none transition-opacity duration-300"
            style="
                background: radial-gradient(600px circle at {mouseX}px {mouseY}px, rgba(255,255,255,0.06), transparent 40%);
                opacity: {progress};
            "
        ></div>

        <div
            class="hidden md:block absolute inset-0 pointer-events-none transition-opacity duration-300 border border-white/0"
            style="
                background: radial-gradient(400px circle at {mouseX}px {mouseY}px, rgba(255,255,255,0.1), transparent 40%);
                mask-image: linear-gradient(black, black), linear-gradient(black, black);
                mask-clip: content-box, border-box;
                mask-composite: exclude;
                -webkit-mask-composite: xor;
                opacity: {progress};
                border-radius: inherit;
            "
        ></div>

        <a href="#home" class="group flex items-center relative z-20 gap-3">
            <div class="relative w-10 h-10 flex items-center justify-center shrink-0">
                <div
                    class="absolute inset-0 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                    group-hover:rotate-6 group-hover:scale-110 group-hover:border-white/50 group-hover:bg-white/10 shadow-lg"
                ></div>
                <span
                    class="relative z-10 font-black text-white text-sm tracking-tighter group-hover:scale-110 transition-transform duration-500"
                    >PG</span
                >
            </div>

            <div class="flex flex-col justify-center whitespace-nowrap overflow-hidden transition-all duration-75">
                <span class="font-extrabold text-sm tracking-[0.25em] text-white uppercase leading-none">Pablo</span>
                <span class="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase leading-none mt-1.5"
                    >Gozálvez</span
                >
            </div>
        </a>

        <div class="flex items-center gap-4">
            <div class="hidden md:flex items-center">
                {#each sections as section}
                    <a
                        href={"#" + section.id}
                        class="relative px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 rounded-full group flex items-center gap-1.5
                        {activeSection === section.id ? 'text-white' : 'text-gray-400 hover:text-white'}"
                    >
                        {#if section.num}
                            <span class="relative z-10 text-[9px] font-mono font-medium opacity-40">{section.num}</span>
                        {/if}
                        <span class="relative z-10">{section.label}</span>

                        <div
                            class="absolute inset-0 bg-white/10 rounded-full transition-all duration-300"
                            style="opacity: {activeSection === section.id && progress > 0.8
                                ? 1
                                : 0}; transform: scale({activeSection === section.id && progress > 0.8 ? 1 : 0.9})"
                        ></div>

                        <div
                            class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] transition-all duration-300"
                            style="opacity: {activeSection === section.id && progress <= 0.8
                                ? 1
                                : 0}; transform: translateY({activeSection === section.id && progress <= 0.8
                                ? 0
                                : 5}px)"
                        ></div>
                    </a>
                {/each}

                <a
                    href={alternateLanguageUrl}
                    on:click={() => (isMenuOpen = false)}
                    aria-label={$locale === "en" ? "Español" : "English"}
                    hreflang={$locale === "en" ? "es" : "en"}
                    lang={$locale === "en" ? "es" : "en"}
                    class="ml-2 relative min-h-9 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all duration-300 border border-white/10 rounded-full hover:bg-white/10 flex items-center gap-2"
                >
                    <img
                        src={$locale === "en" ? "/img/icons/es.png" : "/img/icons/us.png"}
                        alt=""
                        width="12" height="12"
                        class="w-3 h-3 object-contain"
                    />
                    <span>{$locale === "en" ? "ES" : "EN"}</span>
                </a>
            </div>

            <button
                on:click={() => (isMenuOpen = !isMenuOpen)}
                class="md:hidden relative w-12 h-12 flex flex-col items-center justify-center z-50 rounded-full hover:bg-white/5 transition-colors"
                aria-label={$t("nav.openMenu")}
                aria-expanded={isMenuOpen}
                aria-controls={isMenuOpen ? "mobile-navigation" : undefined}
            >
                <div class="relative w-6 h-5">
                    <span
                        class="absolute left-0 w-full h-0.5 bg-white rounded-full transition-transform duration-300 {isMenuOpen
                            ? 'top-1/2 -translate-y-1/2 rotate-45'
                            : 'top-0'}"
                    ></span>
                    <span
                        class="absolute top-1/2 left-0 -translate-y-1/2 w-full h-0.5 bg-white rounded-full transition-opacity duration-300 {isMenuOpen
                            ? 'opacity-0'
                            : 'opacity-100'}"
                    ></span>
                    <span
                        class="absolute left-0 w-full h-0.5 bg-white rounded-full transition-transform duration-300 {isMenuOpen
                            ? 'bottom-1/2 translate-y-1/2 -rotate-45'
                            : 'bottom-0'}"
                    ></span>
                </div>
            </button>
        </div>
    </div>
</nav>
