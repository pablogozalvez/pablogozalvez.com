<script>
    import { isLowPerformanceMode, rafThrottle } from "./actions";
    import { animationVisibility } from "./animation-visibility";
    import { onMount } from "svelte";
    import { getI18n } from "./i18n";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { IconArrowRight, IconChevronDown } from "./icons";

    const { t } = getI18n();

    let visible = true;
    let isMobile = false;
    let reducedEffects = false;

    let scrollY = 0;
    let innerHeight = 1;

    let scrollProgress = 0;
    let heroScale = 1;
    let heroTranslateY = 0;
    let bgParallax = 0;

    $: {
        const effectScroll = isMobile || reducedEffects ? 0 : scrollY;
        const progress = Math.min(
            1,
            Math.max(0, effectScroll / (innerHeight || 1)),
        );
        scrollProgress = progress;
        heroScale = Math.max(0.92, 1 - progress * 0.07);
        heroTranslateY = effectScroll * 0.26;
        bgParallax = effectScroll * 0.12;
    }

    onMount(() => {
        reducedEffects = isLowPerformanceMode();

        const handleScroll = rafThrottle(() => {
            if (visible && !isMobile && !reducedEffects)
                scrollY = window.scrollY;
        });

        const handleResize = () => {
            isMobile = window.innerWidth < 1024;
            innerHeight = window.innerHeight;
            window.removeEventListener("scroll", handleScroll);
            if (!isMobile && !reducedEffects) {
                scrollY = window.scrollY;
                window.addEventListener("scroll", handleScroll, {
                    passive: true,
                });
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize, { passive: true });

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    });
</script>

<section
    id="home"
    class="relative min-h-svh flex items-center overflow-hidden bg-[#0a0a0a]"
    class:hero-static={reducedEffects || isMobile}
    use:animationVisibility={(active) => {
        visible = active;
        if (active && !reducedEffects) scrollY = window.scrollY;
    }}
>
    <div class="absolute inset-0 bg-[#0a0a0a] z-0"></div>
    <div
        class="absolute inset-0 hero-grid opacity-[0.2] z-0 pointer-events-none will-change-transform"
        style="transform: translateY({bgParallax}px);"
    ></div>
    <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] z-0 pointer-events-none"
    ></div>

    <div
        class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 h-full py-24 lg:py-0 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-8 origin-center transition-transform duration-75 ease-out"
        class:will-change-transform={!reducedEffects && !isMobile}
        style="transform: translateY({heroTranslateY}px) scale({heroScale});"
    >
        <!-- Left Column: Presentation -->
        <div
            class="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 max-w-2xl mx-auto lg:mx-0"
        >
            <div in:fly={{ y: 30, duration: 800, easing: cubicOut }}>
                <h1
                    class="hero-title text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter mb-6 lg:mb-10 leading-[0.95] text-white"
                >
                    {@html $t("hero.title")}
                </h1>
            </div>

            <!-- Subtitle -->
            <div
                in:fly={{ y: 20, duration: 800, delay: 150, easing: cubicOut }}
                class="w-full flex justify-center"
            >
                <p
                    class="text-base sm:text-lg text-gray-300 mb-8 max-w-lg leading-relaxed font-light p-6 bg-white/5 rounded-xl border border-white/5"
                >
                    {$t("hero.subtitle")}
                </p>
            </div>

            <div
                in:fly={{ y: 20, duration: 800, delay: 300, easing: cubicOut }}
                class="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start w-full"
            >
                <a
                    href="#projects"
                    class="hero-cta px-7 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    <span>{$t("hero.viewProjects")}</span>
                    <IconArrowRight class="w-4 h-4 text-black" />
                </a>

                <a
                    href="#contact"
                    class="px-7 py-3.5 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer"
                >
                    {$t("hero.contactMe")}
                </a>
            </div>
        </div>
    </div>

    <!-- Scroll down indicator (fades out naturally on scroll) -->
    <a
        href="#about"
        tabindex={scrollProgress > 0.2 ? -1 : 0}
        aria-hidden={scrollProgress > 0.2}
        class="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 hover:text-white transition-colors z-20 cursor-pointer"
        style="opacity: {Math.max(
            0,
            1 - scrollProgress * 5,
        )}; pointer-events: {scrollProgress > 0.2 ? 'none' : 'auto'};"
        aria-label={$t("hero.scroll")}
    >
        <IconChevronDown class="w-6 h-6" />
    </a>
</section>

<style>
    .hero-static .hero-grid {
        animation: none;
    }

    .hero-grid {
        background-size: 40px 40px;
        background-image: linear-gradient(
                to right,
                rgba(255, 255, 255, 0.03) 1px,
                transparent 1px
            ),
            linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.03) 1px,
                transparent 1px
            );
        -webkit-mask-image: radial-gradient(
            ellipse at center,
            black 40%,
            transparent 80%
        );
        mask-image: radial-gradient(
            ellipse at center,
            black 40%,
            transparent 80%
        );
    }

    .hero-title {
        background: linear-gradient(
            180deg,
            #ffffff 25%,
            #e2e8f0 70%,
            #cbd5e1 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        -webkit-text-stroke: 1.2px rgba(255, 255, 255, 0.95);
        paint-order: stroke fill;
        letter-spacing: -0.04em;
    }

    @media (min-width: 1024px) {
        .hero-title {
            -webkit-text-stroke-width: 1.8px;
        }
    }

    .hero-cta {
        position: relative;
    }

    @media (max-width: 1023px) {
        .hero-grid {
            animation: none;
            will-change: auto;
        }
    }
</style>
