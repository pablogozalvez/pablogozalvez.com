<script>
    import { isLowPerformanceMode, rafThrottle } from "./actions";
    import { animationVisibility } from "./animation-visibility";
    import { onMount } from "svelte";
    import { getI18n } from "./i18n";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import GithubActivityWidget from "./GithubActivityWidget.svelte";
    import {
        IconArrowRight,
        IconChevronDown,
        IconChevronLeft,
        IconChevronRight,
        IconGrid,
        IconPause,
        IconPlay,
        IconUser,
    } from "./icons";

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

    let activeTab = "about"; // "about" | "projects"
    let currentProjectIndex = 0;
    let autoRotateInterval;
    let isPaused = false;
    let hasFocus = false;
    let mounted = false;
    let autoRotateEnabled = true;
    let aboutTabButton;
    let projectsTabButton;

    $: if (mounted) {
        if (
            visible &&
            autoRotateEnabled &&
            !isPaused &&
            !hasFocus &&
            !isMobile &&
            !reducedEffects
        )
            startAutoRotate();
        else stopAutoRotate();
    }

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

    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
        autoRotateInterval = undefined;
    }

    function startAutoRotate() {
        if (
            typeof window === "undefined" ||
            !mounted ||
            !visible ||
            !autoRotateEnabled ||
            isPaused ||
            hasFocus ||
            isMobile ||
            reducedEffects
        )
            return;
        stopAutoRotate();
        autoRotateInterval = setInterval(() => {
            if (!isPaused && !isMobile) {
                activeTab = activeTab === "about" ? "projects" : "about";
            }
        }, 6500);
    }

    function selectTab(tab) {
        activeTab = tab;
        if (document.activeElement?.closest("[data-preview-panel]")) {
            (tab === "about" ? aboutTabButton : projectsTabButton)?.focus();
        }
        startAutoRotate();
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
            if (isMobile || reducedEffects) {
                stopAutoRotate();
            } else if (!autoRotateInterval) {
                startAutoRotate();
            }
        };
        handleResize();
        mounted = true;
        window.addEventListener("resize", handleResize, { passive: true });

        return () => {
            mounted = false;
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
            stopAutoRotate();
        };
    });

    $: techCategories = [
        {
            category: $t("hero.preview.techCategories.frontend"),
            items: ["TypeScript", "Angular", "React"],
        },
        {
            category: $t("hero.preview.techCategories.backend"),
            items: ["Java", "Spring Boot", "Express"],
        },
        {
            category: $t("hero.preview.techCategories.dataCloud"),
            items: ["PostgreSQL", "MongoDB", "Docker"],
        },
        {
            category: $t("hero.preview.techCategories.interactive"),
            items: ["Unity", "C#", "Three.js", "WebGL"],
        },
    ];

    $: featuredProjects = [
        {
            title: "OutReal",
            category: $t("hero.preview.categories.outreal"),
            description: $t("hero.preview.projectDescriptions.outreal"),
            image: "/img/outreal.webp",
            tags: ["Ionic", "Angular", "PostGIS", "Full Stack"],
            highlight: $t("hero.preview.highlights.outreal"),
        },
        {
            title: "Hospital Dr. Balmis 3D",
            category: $t("hero.preview.categories.hospital"),
            description: $t("hero.preview.projectDescriptions.hospitalXyz"),
            image: "/img/hospitalxyz.webp",
            tags: ["Three.js", "WebGL", $t("projectTags.healthcare"), "3D"],
            highlight: "Hospital Univ. Dr. Balmis",
        },
        {
            title: "Tricky Mansion",
            category: $t("hero.preview.categories.trickyMansion"),
            description: $t("hero.preview.projectDescriptions.trickyMansion"),
            image: "/img/tricky-mansion.webp",
            tags: ["Unity", "C#", "Google Play", $t("projectTags.gameDev")],
            highlight: "Google Play & Itch.io",
        },
        {
            title: "PseudoBlocks",
            category: $t("hero.preview.categories.pseudoBlocks"),
            description: $t("hero.preview.projectDescriptions.pseudoBlocks"),
            image: "/img/pseudoblocks.webp",
            tags: [
                "C#",
                "WinForms",
                $t("projectTags.compilers"),
                $t("projectTags.openSource"),
            ],
            highlight: $t("hero.preview.highlights.pseudoBlocks"),
        },
    ];

    function nextProject() {
        currentProjectIndex =
            (currentProjectIndex + 1) % featuredProjects.length;
        startAutoRotate();
    }

    function prevProject() {
        currentProjectIndex =
            (currentProjectIndex - 1 + featuredProjects.length) %
            featuredProjects.length;
        startAutoRotate();
    }

    function setProject(idx) {
        currentProjectIndex = idx;
        startAutoRotate();
    }
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

            <!-- Subtitle: Only shown on mobile/tablet when preview card is hidden -->
            <div
                in:fly={{ y: 20, duration: 800, delay: 150, easing: cubicOut }}
                class="lg:hidden w-full flex justify-center"
            >
                <p
                    class="text-base sm:text-lg text-gray-300 mb-8 max-w-lg leading-relaxed font-light p-6 bg-white/5 rounded-xl border border-white/5"
                >
                    {$t("hero.subtitle")}
                </p>
            </div>

            <!-- Desktop GitHub Real Commits & Activity Heatmap Widget -->
            <div
                in:fly={{ y: 20, duration: 800, delay: 180, easing: cubicOut }}
                class="hidden lg:block w-full"
            >
                <GithubActivityWidget />
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

        <!-- Right Column: Interactive About & Projects Showcase Preview (Desktop only) -->
        {#if !isMobile}
            <div
                in:fly={{ y: 35, duration: 900, delay: 200, easing: cubicOut }}
                class="hidden lg:block lg:w-[48%] xl:w-[46%] max-w-xl relative z-10"
            >
                <div
                    class="preview-card relative bg-[#0F1115] rounded-2xl md:rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden transition-colors hover:border-white/20"
                    role="region"
                    aria-label={$t("hero.preview.ariaLabel")}
                    on:mouseenter={() => (isPaused = true)}
                    on:mouseleave={() => (isPaused = false)}
                    on:focusin={() => (hasFocus = true)}
                    on:focusout={(event) =>
                        (hasFocus = event.currentTarget.contains(
                            event.relatedTarget,
                        ))}
                >
                    <!-- Top accent line -->
                    <div
                        class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                    ></div>

                    <!-- Header with Section Code & Centered Tabs -->
                    <div
                        class="relative flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/5 bg-white/[0.01]"
                    >
                        <!-- Section breadcrumb (Left) -->
                        <div class="flex items-center gap-2">
                            <span
                                class="text-[11px] font-mono font-medium text-gray-400 uppercase tracking-wider hidden sm:inline"
                                >OVERVIEW</span
                            >
                        </div>

                        <!-- Centered Tab Toggle -->
                        <div class="flex justify-center">
                            <div
                                class="inline-flex p-1 bg-white/[0.03] rounded-xl border border-white/5"
                            >
                                <button
                                    type="button"
                                    bind:this={aboutTabButton}
                                    on:click={() => selectTab("about")}
                                    aria-pressed={activeTab === "about"}
                                    class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer {activeTab ===
                                    'about'
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-400 hover:text-white'}"
                                >
                                    <IconUser class="w-3.5 h-3.5" />
                                    <span>{$t("hero.preview.tabAbout")}</span>
                                </button>

                                <button
                                    type="button"
                                    bind:this={projectsTabButton}
                                    on:click={() => selectTab("projects")}
                                    aria-pressed={activeTab === "projects"}
                                    class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer {activeTab ===
                                    'projects'
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-400 hover:text-white'}"
                                >
                                    <IconGrid class="w-3.5 h-3.5" />
                                    <span>{$t("hero.preview.tabProjects")}</span
                                    >
                                    <span
                                        class="inline-flex items-center justify-center h-[18px] min-w-[18px] px-1.5 rounded-md text-[10px] font-bold font-mono tracking-tight leading-none transition-colors {activeTab ===
                                        'projects'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-white/5 text-gray-400'}"
                                    >
                                        {featuredProjects.length}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- Right Balance Pause/Play -->
                        <div class="flex justify-end">
                            <button
                                type="button"
                                on:click={() =>
                                    (autoRotateEnabled = !autoRotateEnabled)}
                                aria-pressed={!autoRotateEnabled}
                                aria-label={$t(
                                    autoRotateEnabled
                                        ? "hero.preview.pause"
                                        : "hero.preview.resume",
                                )}
                                title={$t(
                                    autoRotateEnabled
                                        ? "hero.preview.pause"
                                        : "hero.preview.resume",
                                )}
                                class="w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                {#if autoRotateEnabled}
                                    <IconPause class="w-3.5 h-3.5" />
                                {:else}
                                    <IconPlay class="w-3.5 h-3.5" />
                                {/if}
                            </button>
                        </div>
                    </div>

                    <!-- Main Panel Content: Fixed Height & Overlapping Grid for zero layout jumps -->
                    <div
                        class="p-5 sm:p-6 h-[440px] sm:h-[445px] relative grid grid-cols-1 grid-rows-1 overflow-hidden"
                    >
                        <!-- About Tab Panel -->
                        <div
                            data-preview-panel
                            inert={activeTab !== "about"}
                            aria-hidden={activeTab !== "about"}
                            class="col-start-1 row-start-1 flex flex-col justify-between h-full transition-all duration-500 ease-out {activeTab ===
                            'about'
                                ? 'opacity-100 translate-y-0 pointer-events-auto z-10'
                                : 'opacity-0 translate-y-2 pointer-events-none z-0'}"
                        >
                            <div class="flex-1 flex flex-col min-h-0">
                                <!-- Profile & Location Header -->
                                <div
                                    class="flex items-center justify-between gap-3"
                                >
                                    <div
                                        class="flex items-center gap-3 min-w-0"
                                    >
                                        <div
                                            class="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white font-mono font-bold text-xs tracking-wider shrink-0"
                                        >
                                            PG
                                        </div>
                                        <div class="min-w-0">
                                            <p
                                                class="text-white font-semibold text-sm sm:text-base leading-tight truncate"
                                            >
                                                Pablo Gozálvez
                                            </p>
                                            <p
                                                class="text-[11px] text-gray-400 font-medium truncate mt-0.5"
                                            >
                                                {$t("hero.preview.role")}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-[11px] text-gray-400 font-mono shrink-0"
                                    >
                                        <svg
                                            class="w-3 h-3 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <span
                                            >{$t("hero.preview.location")}</span
                                        >
                                    </div>
                                </div>

                                <p
                                    class="text-xs sm:text-[13px] text-gray-300 leading-relaxed font-light mt-3 sm:mt-4"
                                >
                                    {$t("hero.preview.summary")}
                                </p>

                                <!-- Divider -->
                                <div
                                    class="relative h-px w-full my-3 sm:my-3.5 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                                ></div>

                                <!-- Redesigned Technologies Section -->
                                <div class="flex-1 flex flex-col min-h-0">
                                    <div
                                        class="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-2"
                                    >
                                        {$t("hero.preview.techStack")}
                                    </div>

                                    <div
                                        class="grid grid-cols-2 gap-2 flex-1 min-h-0"
                                    >
                                        {#each techCategories as category}
                                            <div
                                                class="p-2 sm:p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-center min-w-0"
                                            >
                                                <span
                                                    class="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1.5 font-medium truncate"
                                                >
                                                    {category.category}
                                                </span>
                                                <div
                                                    class="flex flex-nowrap items-center gap-1 overflow-hidden"
                                                >
                                                    {#each category.items as item}
                                                        <span
                                                            class="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-mono text-gray-300 bg-white/5 border border-white/5 rounded-md hover:border-white/20 transition-colors whitespace-nowrap shrink-0"
                                                        >
                                                            {item}
                                                        </span>
                                                    {/each}
                                                </div>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            </div>

                            <!-- Footer Links -->
                            <div
                                class="relative mt-3.5 pt-3 flex items-center justify-between text-xs"
                            >
                                <div
                                    class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                                ></div>
                                <a
                                    href="#about"
                                    class="text-gray-300 hover:text-white font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <span>{$t("hero.preview.viewAbout")}</span>
                                    <IconArrowRight class="w-3.5 h-3.5" />
                                </a>

                                <button
                                    on:click={() => selectTab("projects")}
                                    class="text-gray-400 hover:text-white font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <span>{$t("hero.preview.switchTab")}</span>
                                    <IconChevronRight class="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <!-- Projects Tab Panel -->
                        <div
                            data-preview-panel
                            inert={activeTab !== "projects"}
                            aria-hidden={activeTab !== "projects"}
                            class="col-start-1 row-start-1 flex flex-col justify-between h-full transition-all duration-500 ease-out {activeTab ===
                            'projects'
                                ? 'opacity-100 translate-y-0 pointer-events-auto z-10'
                                : 'opacity-0 translate-y-2 pointer-events-none z-0'}"
                        >
                            <!-- Top controls -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span
                                        class="text-xs text-gray-400 font-mono font-medium"
                                    >
                                        {featuredProjects[currentProjectIndex]
                                            .category}
                                    </span>
                                </div>

                                <div class="flex items-center gap-2">
                                    <span
                                        class="text-xs font-mono text-gray-400"
                                    >
                                        0{currentProjectIndex + 1} / 0{featuredProjects.length}
                                    </span>
                                    <div class="flex gap-1">
                                        <button
                                            type="button"
                                            on:click={prevProject}
                                            aria-label={$t(
                                                "hero.preview.seePrev",
                                            )}
                                            class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                                        >
                                            <IconChevronLeft
                                                class="w-3.5 h-3.5"
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            on:click={nextProject}
                                            aria-label={$t(
                                                "hero.preview.seeNext",
                                            )}
                                            class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                                        >
                                            <IconChevronRight
                                                class="w-3.5 h-3.5"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Subtle divider between controls and card -->
                            <div
                                class="relative h-px w-full my-1.5 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                            ></div>

                            <!-- Featured Project Card -->
                            <div
                                class="relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors hover:border-white/20"
                            >
                                <div
                                    class="relative h-36 sm:h-38 w-full overflow-hidden bg-black/40"
                                >
                                    <img
                                        src={featuredProjects[
                                            currentProjectIndex
                                        ].image}
                                        alt={featuredProjects[
                                            currentProjectIndex
                                        ].title}
                                        class="w-full h-full object-cover object-center"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div
                                        class="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/40 to-transparent"
                                    ></div>
                                    <div
                                        class="absolute top-2.5 left-2.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border border-white/20 tracking-wider bg-black/70 text-white font-mono"
                                    >
                                        {featuredProjects[currentProjectIndex]
                                            .highlight}
                                    </div>
                                </div>

                                <div class="p-3.5 sm:p-4">
                                    <div
                                        class="flex items-center justify-between mb-1.5"
                                    >
                                        <p
                                            class="text-base sm:text-lg font-bold text-white tracking-tight"
                                        >
                                            {featuredProjects[
                                                currentProjectIndex
                                            ].title}
                                        </p>
                                        <a
                                            href="#projects"
                                            class="text-xs text-gray-400 hover:text-white font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                            <span
                                                >{$t(
                                                    "hero.preview.viewInProjects",
                                                )}</span
                                            >
                                            <IconChevronDown class="w-3 h-3" />
                                        </a>
                                    </div>

                                    <p
                                        class="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3"
                                    >
                                        {featuredProjects[currentProjectIndex]
                                            .description}
                                    </p>

                                    <!-- Tags -->
                                    <div class="flex flex-wrap gap-1.5">
                                        {#each featuredProjects[currentProjectIndex].tags as tag}
                                            <span
                                                class="px-2 py-0.5 text-[11px] rounded bg-white/5 border border-white/5 text-gray-300 font-mono"
                                            >
                                                {tag}
                                            </span>
                                        {/each}
                                    </div>
                                </div>
                            </div>

                            <!-- Footer Switcher Dots & All Projects Link -->
                            <div
                                class="relative pt-3 flex items-center justify-between text-xs"
                            >
                                <div class="flex items-center gap-1.5">
                                    {#each featuredProjects as _, idx}
                                        <button
                                            type="button"
                                            on:click={() => setProject(idx)}
                                            class="w-7 h-7 flex items-center justify-center cursor-pointer"
                                            aria-label={$t(
                                                "hero.preview.showProject",
                                            ) +
                                                ": " +
                                                featuredProjects[idx].title}
                                            aria-pressed={idx ===
                                                currentProjectIndex}
                                            ><span
                                                aria-hidden="true"
                                                class="h-1.5 rounded-full transition-colors {idx ===
                                                currentProjectIndex
                                                    ? 'w-6 bg-white'
                                                    : 'w-2 bg-white/20 hover:bg-white/40'}"
                                            ></span></button
                                        >
                                    {/each}
                                </div>

                                <a
                                    href="#projects"
                                    class="text-gray-300 hover:text-white font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <span>{$t("hero.preview.allProjects")}</span
                                    >
                                    <IconArrowRight class="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
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

    .hero-static .preview-card {
        backdrop-filter: none;
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
