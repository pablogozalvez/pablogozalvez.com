<script>
    import { getI18n } from "./i18n";
    import { IconArrowRight } from "./icons";

    const { t } = getI18n();
</script>

<section id="home" class="relative min-h-svh flex items-center overflow-hidden bg-[#0a0a0a]">
    <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] z-0 pointer-events-none"
    ></div>

    <div
        class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 h-full py-24 lg:py-0 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-8">
        <!-- Left Column: Presentation -->
        <div
            class="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 max-w-2xl mx-auto lg:mx-0"
        >
            <div>
                <h1
                    class="hero-title text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter mb-6 lg:mb-10 leading-[0.95] text-white"
                >
                    {@html $t("hero.title")}
                </h1>
            </div>

            <!-- Subtitle -->
            <div class="w-full flex justify-center">
                <p
                    class="text-base sm:text-lg text-gray-300 mb-8 max-w-lg leading-relaxed font-light p-6 bg-white/5 rounded-xl border border-white/5"
                >
                    {$t("hero.subtitle")}
                </p>
            </div>

            <div class="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start w-full">
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
</section>

<style>
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
</style>
