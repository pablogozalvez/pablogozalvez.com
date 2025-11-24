<script>
    import { t, locale, setLocale } from "./i18n";
    import { fade, fly, scale } from "svelte/transition";
    import { cubicOut, cubicInOut } from "svelte/easing";

    export let activeSection = "home";
    export let hideNav = false;
    let scrollY = 0;
    let innerWidth = 0;
    let innerHeight = 0;

    let isMenuOpen = false;

    $: sections = [
        { id: "home", label: $t("nav.home") },
        { id: "about", label: $t("nav.about") },
        { id: "projects", label: $t("nav.projects") },
        { id: "contact", label: $t("nav.contact") },
    ];

    const scrollTo = (id) => {
        isMenuOpen = false;

        if (id === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    function toggleLanguage() {
        const newLang = $locale === "en" ? "es" : "en";
        setLocale(newLang);
    }

    // Detección de sección activa
    $: if (typeof document !== "undefined" && innerHeight && scrollY >= 0) {
        const center = innerHeight / 3;
        for (const section of sections) {
            const element = document.getElementById(section.id);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top < center && rect.bottom > center) {
                    activeSection = section.id;
                }
            }
        }
    }

    $: isScrolled = scrollY > 50;
    $: isMobile = innerWidth < 640;

    let navElement;
    let mouseX = 0;
    let mouseY = 0;

    function handleMouseMove(e) {
        if (navElement) {
            const rect = navElement.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        }
    }
</script>

<svelte:window bind:scrollY bind:innerWidth bind:innerHeight />

{#if isMenuOpen}
    <div
        class="fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-2xl flex flex-col items-center justify-center"
        transition:fade={{ duration: 400, easing: cubicInOut }}
    >
        <div
            class="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]"
            in:scale={{ start: 1.1, duration: 800, easing: cubicOut }}
        ></div>
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full animate-pulse"
        ></div>

        <nav class="flex flex-col items-center gap-8 relative z-10">
            {#each sections as section, i}
                <button
                    on:click={() => scrollTo(section.id)}
                    in:fly={{ y: 50, delay: 200 + i * 100, duration: 500, easing: cubicOut }}
                    out:fly={{ y: 20, delay: i * 50, duration: 300, easing: cubicOut }}
                    class="text-5xl md:text-6xl font-black uppercase tracking-tighter transition-all duration-300 hover:scale-110
                    {activeSection === section.id ? 'text-white scale-105' : 'text-white/40 hover:text-white'}"
                >
                    {section.label}
                </button>
            {/each}

            <div
                in:fly={{ y: 20, delay: 350, duration: 500 }}
                out:fade={{ duration: 200 }}
                class="mt-8 pt-8 border-t border-white/10 w-20 flex justify-center"
            >
                <button
                    on:click={toggleLanguage}
                    class="text-sm font-mono text-gray-400 border border-white/10 rounded-full px-4 py-3 hover:bg-white/10 hover:text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                    <img
                        src={$locale === "en" ? "/img/icons/es.png" : "/img/icons/us.png"}
                        alt={$locale === "en" ? "Spanish" : "English"}
                        class="w-5 h-5 object-contain"
                    />
                    <span>{$locale === "en" ? "ES" : "EN"}</span>
                </button>
            </div>
        </nav>
    </div>
{/if}

<nav
    class="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none px-4 md:px-0 transition-transform duration-500 {hideNav
        ? '-translate-y-[150%]'
        : 'translate-y-0'}"
>
    <div
        bind:this={navElement}
        on:mousemove={handleMouseMove}
        role="none"
        class="pointer-events-auto transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between relative group/nav gap-4 {isMenuOpen
            ? 'mt-0 py-6 px-6 bg-transparent border-transparent w-fit min-w-full max-w-full rounded-none'
            : isScrolled
              ? 'mt-2 md:mt-6 py-2.5 px-4 md:px-6 bg-black/20 backdrop-blur-md md:backdrop-blur-xl backdrop-saturate-150 border border-white/10 rounded-full shadow-2xl w-fit min-w-0 max-w-full overflow-hidden'
              : 'mt-0 py-4 md:py-6 px-4 md:px-8 bg-transparent border border-transparent rounded-none w-fit min-w-full max-w-full'}"
        style="transition-property: width, min-width, max-width, padding, margin, background-color, border-radius, backdrop-filter;"
    >
        <div
            class="hidden md:block absolute inset-0 pointer-events-none transition-opacity duration-500"
            style="
                background: radial-gradient(600px circle at {mouseX}px {mouseY}px, rgba(255,255,255,0.06), transparent 40%);
                opacity: {isScrolled ? 1 : 0};
            "
        ></div>

        <div
            class="hidden md:block absolute inset-0 rounded-full pointer-events-none transition-opacity duration-500 border border-white/0"
            style="
                background: radial-gradient(400px circle at {mouseX}px {mouseY}px, rgba(255,255,255,0.1), transparent 40%);
                mask-image: linear-gradient(black, black), linear-gradient(black, black);
                mask-clip: content-box, border-box;
                mask-composite: exclude;
                -webkit-mask-composite: xor;
                opacity: {isScrolled ? 1 : 0};
            "
        ></div>

        <button
            on:click={() => scrollTo("home")}
            class="group flex items-center outline-none relative z-20 pl-2 md:pl-2 {isScrolled ? 'md:-ml-3' : ''}"
        >
            <div class="relative w-10 h-10 flex items-center justify-center">
                <div
                    class="absolute inset-0 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                    group-hover:rotate-6 group-hover:scale-110 group-hover:border-white/50 group-hover:bg-white/10 shadow-lg"
                ></div>
                <span
                    class="relative z-10 font-black text-white text-sm tracking-tighter group-hover:scale-110 transition-transform duration-500"
                    >PG</span
                >
            </div>

            <div
                class="grid sm:grid transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] {isScrolled &&
                !isMobile
                    ? 'grid-cols-[0fr]'
                    : 'grid-cols-[1fr]'}"
            >
                <div class="overflow-hidden">
                    <div
                        class="flex flex-col justify-center pl-4 whitespace-nowrap transition-all duration-500 ease-out {isScrolled &&
                        !isMobile
                            ? 'opacity-0 -translate-x-4 blur-sm'
                            : 'opacity-100 translate-x-0 blur-0'}"
                    >
                        <span class="font-extrabold text-sm tracking-[0.25em] text-white uppercase leading-none"
                            >Pablo</span
                        >
                        <span class="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase leading-none mt-1.5"
                            >Gozálvez</span
                        >
                    </div>
                </div>
            </div>
        </button>

        <div class="flex items-center gap-4">
            <div
                class="hidden md:flex items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] {isScrolled
                    ? 'gap-1 pr-1'
                    : 'gap-8'}"
            >
                {#each sections as section}
                    <button
                        on:click={() => scrollTo(section.id)}
                        class="relative px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-full group
                        {activeSection === section.id ? 'text-white' : 'text-gray-400 hover:text-white'}"
                    >
                        <span class="relative z-10">{section.label}</span>
                        <div
                            class="absolute inset-0 bg-white/10 rounded-full transition-all duration-300 {isScrolled &&
                            activeSection === section.id
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-90'}"
                        ></div>
                        <div
                            class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] transition-all duration-300 {!isScrolled &&
                            activeSection === section.id
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-2'}"
                        ></div>
                    </button>
                {/each}

                <button
                    on:click={toggleLanguage}
                    class="relative px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] border border-white/10 rounded-full hover:bg-white/10 flex items-center gap-2 {isScrolled
                        ? 'mr-1'
                        : ''}"
                >
                    <img
                        src={$locale === "en" ? "/img/icons/es.png" : "/img/icons/us.png"}
                        alt={$locale === "en" ? "Spanish" : "English"}
                        class="w-3 h-3 object-contain"
                    />
                    <span>{$locale === "en" ? "ES" : "EN"}</span>
                </button>
            </div>

            <button
                on:click={() => (isMenuOpen = !isMenuOpen)}
                class="md:hidden relative w-12 h-12 flex flex-col items-center justify-center z-50 rounded-full hover:bg-white/5 transition-colors group/menu"
                aria-label="Toggle Menu"
            >
                <div class="relative w-6 h-5">
                    <span
                        class="absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                        {isMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-[135deg]' : 'top-0'}"
                    ></span>
                    <span
                        class="absolute top-1/2 left-0 -translate-y-1/2 w-full h-0.5 bg-white rounded-full transition-all duration-300 ease-out
                        {isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}"
                    ></span>
                    <span
                        class="absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                        {isMenuOpen ? 'bottom-1/2 translate-y-1/2 -rotate-[135deg]' : 'bottom-0'}"
                    ></span>
                </div>
            </button>
        </div>
    </div>
</nav>
