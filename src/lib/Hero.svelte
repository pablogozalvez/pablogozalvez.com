<script>
    import { viewport } from "./actions";
    import { onMount } from "svelte";
    import { getI18n } from "./i18n";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import GithubActivityWidget from "./GithubActivityWidget.svelte";

    const { t } = getI18n();

    let visible = true;
    let isMobile = false;

    let scrollY = 0;
    let innerHeight = 1;

    let scrollProgress = 0;
    let heroScale = 1;
    let heroTranslateY = 0;
    let heroBlur = 0;
    let bgParallax = 0;
    let dimOpacity = 0;


    let activeTab = "about"; // "about" | "projects"
    let currentProjectIndex = 0;
    let autoRotateInterval;
    let isPaused = false;

    function scrollTo(id) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }

    $: {
        const progress = Math.min(1, Math.max(0, scrollY / (innerHeight || 1)));
        scrollProgress = progress;
        heroScale = Math.max(0.92, 1 - progress * 0.07);
        heroTranslateY = scrollY * 0.26;
        heroBlur = Math.min(6, progress * 6);
        bgParallax = scrollY * 0.12;
        dimOpacity = progress * 0.45;
    }

    function startAutoRotate() {
        if (typeof window === "undefined" || isMobile) return;
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            if (!isPaused && !isMobile) {
                activeTab = activeTab === "about" ? "projects" : "about";
            }
        }, 6500);
    }

    function selectTab(tab) {
        activeTab = tab;
        startAutoRotate();
    }

    onMount(() => {
        const handleResize = () => {
            isMobile = window.innerWidth < 1024;
            innerHeight = window.innerHeight;
            if (isMobile) {
                clearInterval(autoRotateInterval);
            } else if (!autoRotateInterval) {
                startAutoRotate();
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize, { passive: true });
        startAutoRotate();

        return () => {
            window.removeEventListener("resize", handleResize);
            clearInterval(autoRotateInterval);
        };
    });

    $: stats = [
        { value: "+2", label: $t("hero.preview.statExp"), dot: "bg-indigo-400", labelColor: "text-indigo-200/70" },
        { value: "20+", label: $t("hero.preview.statProjects"), dot: "bg-cyan-400", labelColor: "text-cyan-200/70" },
        { value: "5+", label: $t("hero.preview.statReleases"), dot: "bg-emerald-400", labelColor: "text-emerald-200/70" }
    ];

    const keySkills = [
        { name: "TypeScript", color: "border-blue-500/30 text-blue-300 bg-blue-500/10" },
        { name: "Angular / React", color: "border-cyan-500/30 text-cyan-300 bg-cyan-500/10" },
        { name: "Java / Spring", color: "border-amber-500/30 text-amber-300 bg-amber-500/10" },
        { name: "C# / Unity", color: "border-purple-500/30 text-purple-300 bg-purple-500/10" },
        { name: "Node.js", color: "border-emerald-500/30 text-emerald-300 bg-emerald-500/10" },
        { name: "SQL / PostGIS", color: "border-indigo-500/30 text-indigo-300 bg-indigo-500/10" }
    ];

    $: featuredProjects = [
        {
            title: "OutReal",
            category: "Mobile App · Social Platform",
            description: $t("projects.items.outreal.description"),
            image: "/img/outreal.webp",
            tags: ["Ionic", "Angular", "PostGIS", "Full Stack"],
            highlight: "Social Map & Gamification"
        },
        {
            title: "Hospital Dr. Balmis 3D",
            category: "WebGL · Virtual Tour 3D",
            description: $t("projects.items.hospitalXyz.description"),
            image: "/img/hospitalxyz.webp",
            tags: ["Three.js", "WebGL", "Healthcare", "3D"],
            highlight: "Hospital Univ. Dr. Balmis"
        },
        {
            title: "Tricky Mansion",
            category: "Game Dev · Procedural 2D",
            description: $t("projects.items.trickyMansion.description"),
            image: "/img/tricky-mansion.webp",
            tags: ["Unity", "C#", "Google Play", "Game Dev"],
            highlight: "Google Play & Itch.io"
        },
        {
            title: "PseudoBlocks",
            category: "Desktop Tool · Custom Lexer",
            description: $t("projects.items.pseudoBlocks.description"),
            image: "/img/pseudoblocks.webp",
            tags: ["C#", "WinForms", "Compilers", "Open Source"],
            highlight: "Custom Lexer & Parser"
        }
    ];

    function nextProject() {
        currentProjectIndex = (currentProjectIndex + 1) % featuredProjects.length;
        startAutoRotate();
    }

    function prevProject() {
        currentProjectIndex = (currentProjectIndex - 1 + featuredProjects.length) % featuredProjects.length;
        startAutoRotate();
    }

    function setProject(idx) {
        currentProjectIndex = idx;
        startAutoRotate();
    }
</script>

<svelte:window bind:scrollY />

<section
    id="home"
    class="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]"
    use:viewport
    on:enterViewport={() => (visible = true)}
>
    <div class="absolute inset-0 bg-[#0a0a0a] z-0"></div>
    <div
        class="absolute inset-0 hero-grid opacity-[0.2] z-0 pointer-events-none will-change-transform"
        style="transform: translateY({bgParallax}px);"
    ></div>
    <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] z-0 pointer-events-none"
    ></div>

    <!-- Atmospheric depth veil that darkens subtly on scroll -->
    <div
        class="absolute inset-0 bg-black/40 pointer-events-none z-[1] transition-opacity duration-75 ease-out"
        style="opacity: {dimOpacity};"
    ></div>



    <div
        class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 h-full py-24 lg:py-0 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-8 will-change-transform origin-center transition-transform duration-75 ease-out"
        style="transform: translateY({heroTranslateY}px) scale({heroScale}); --hero-blur: {heroBlur}px;"
    >
        <!-- Left Column: Presentation -->
        <div class="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 max-w-2xl mx-auto lg:mx-0">
            {#if visible}
                <div in:fly={{ y: 30, duration: 800, easing: cubicOut }} class="hero-fade">
                    <h1
                        class="hero-title text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter mb-6 lg:mb-10 leading-[0.95] text-white drop-shadow-lg"
                    >
                        {@html $t("hero.title")}
                    </h1>
                </div>

                <!-- Subtitle: Only shown on mobile/tablet when preview card is hidden -->
                <div
                    in:fly={{ y: 20, duration: 800, delay: 150, easing: cubicOut }}
                    class="lg:hidden w-full flex justify-center hero-fade"
                >
                    <p
                        class="text-base sm:text-lg text-gray-300 mb-8 max-w-lg leading-relaxed font-light p-6 bg-white/5 rounded-xl backdrop-blur-md shadow-lg"
                    >
                        {$t("hero.subtitle")}
                    </p>
                </div>

                <!-- Desktop GitHub Real Commits & Activity Heatmap Widget -->
                <div
                    in:fly={{ y: 20, duration: 800, delay: 180, easing: cubicOut }}
                    class="hidden lg:block w-full hero-fade-interactive"
                >
                    <GithubActivityWidget />
                </div>

                <div
                    in:fly={{ y: 20, duration: 800, delay: 300, easing: cubicOut }}
                    class="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start w-full"
                >
                    <button
                        on:click={() => scrollTo("projects")}
                        class="hero-cta hero-fade-interactive px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-black font-bold rounded-full hover:from-gray-100 hover:to-white hover:shadow-lg hover:shadow-white/25 transition-all duration-300 flex items-center justify-center gap-2 group will-change-transform cursor-pointer"
                    >
                        <span>{$t("hero.viewProjects")}</span>
                        <svg
                            class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            /></svg
                        >
                    </button>

                    <button
                        on:click={() => scrollTo("contact")}
                        class="hero-fade-interactive px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 backdrop-blur-sm will-change-transform cursor-pointer"
                    >
                        {$t("hero.contactMe")}
                    </button>
                </div>
            {/if}
        </div>

        <!-- Right Column: Interactive About & Projects Showcase Preview (Desktop only) -->
        {#if visible && !isMobile}
            <div
                in:fly={{ y: 35, duration: 900, delay: 200, easing: cubicOut }}
                class="hidden lg:block lg:w-[48%] xl:w-[46%] max-w-xl relative z-10"
            >
                <div
                    class="preview-card hero-fade-interactive bg-[#0d0f17]/90 rounded-2xl border border-white/10 shadow-2xl shadow-indigo-950/30 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-white/20"
                    role="region"
                    aria-label="Preview showcase"
                    on:mouseenter={() => (isPaused = true)}
                    on:mouseleave={() => (isPaused = false)}
                >
                    <!-- Header with macOS Dots & Centered Tabs -->
                    <div
                        class="relative flex items-center justify-between px-4 sm:px-5 py-3.5 bg-gradient-to-r from-white/[0.04] to-white/[0.01]"
                    >
                        <div class="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
                        <!-- macOS controls (Left) -->
                        <div class="flex items-center gap-1.5 w-16">
                            <span class="w-3 h-3 rounded-full bg-[#ff5f56]/80 hover:bg-[#ff5f56] transition-colors"></span>
                            <span class="w-3 h-3 rounded-full bg-[#ffbd2e]/80 hover:bg-[#ffbd2e] transition-colors"></span>
                            <span class="w-3 h-3 rounded-full bg-[#27c93f]/80 hover:bg-[#27c93f] transition-colors"></span>
                        </div>

                        <!-- Centered Tab Toggle -->
                        <div class="flex-1 flex justify-center">
                            <div class="inline-flex p-1 bg-white/[0.06] rounded-xl border border-white/10 shadow-inner">
                                <button
                                    type="button"
                                    on:click={() => selectTab("about")}
                                    class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer {activeTab === 'about' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25' : 'text-gray-400 hover:text-white'}"
                                >
                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{$t("hero.preview.tabAbout")}</span>
                                </button>

                                <button
                                    type="button"
                                    on:click={() => selectTab("projects")}
                                    class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer {activeTab === 'projects' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25' : 'text-gray-400 hover:text-white'}"
                                >
                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                    <span>{$t("hero.preview.tabProjects")}</span>
                                    <span
                                        class="inline-flex items-center justify-center h-[18px] min-w-[18px] px-1.5 rounded-full text-[10px] font-bold font-mono tracking-tight leading-none transition-all duration-200 {activeTab === 'projects'
                                            ? 'bg-white/20 text-white border border-white/25 shadow-sm'
                                            : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'}"
                                    >
                                        {featuredProjects.length}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- Right Balance Spacer -->
                        <div class="w-16 hidden sm:block"></div>
                    </div>

                    <!-- Main Panel Content: Fixed Height & Overlapping Grid for zero layout jumps -->
                    <div class="p-5 sm:p-6 h-[440px] sm:h-[425px] relative grid grid-cols-1 grid-rows-1 overflow-hidden">
                        <!-- About Tab Panel -->
                        <div
                            class="col-start-1 row-start-1 flex flex-col justify-between h-full transition-all duration-500 ease-out {activeTab === 'about' ? 'opacity-100 translate-y-0 pointer-events-auto z-10' : 'opacity-0 translate-y-2 pointer-events-none z-0'}"
                        >
                            <!-- Two Column Body: Info on left, Separator, Key Technologies on right -->
                            <div class="flex-1 flex gap-4 sm:gap-5 items-stretch min-h-0 py-1">
                                <!-- Left Column: Profile & Stats (Optimized and integrated) -->
                                <div class="flex-1 flex flex-col justify-between min-w-0 pr-1 py-1">
                                    <!-- Profile Snapshot & Highlights -->
                                    <div class="flex flex-col">
                                        <div class="flex items-center justify-between mb-2">
                                            <div class="flex items-center gap-2.5">
                                                <div class="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-gray-200 font-mono font-semibold text-xs tracking-wider shadow-sm shrink-0">
                                                    PG
                                                </div>
                                                <div class="min-w-0">
                                                    <h2 class="text-white font-semibold text-sm sm:text-base leading-tight truncate">Pablo Gozálvez</h2>
                                                    <p class="text-[11px] text-indigo-300/90 font-medium truncate">{$t("hero.preview.role")}</p>
                                                </div>
                                            </div>

                                            <div class="flex items-center gap-1 text-[11px] text-gray-400 font-mono shrink-0">
                                                <svg class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{$t("hero.preview.location")}</span>
                                            </div>
                                        </div>

                                        <p class="text-xs sm:text-[13px] text-gray-300 leading-relaxed font-light mt-1.5">
                                            {$t("hero.preview.summary")}
                                        </p>

                                        <!-- Core Focus Highlights -->
                                        <div class="mt-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1.5">
                                            <div class="flex items-center gap-2 text-[11px] text-gray-300">
                                                <svg class="w-3 h-3 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span class="truncate">{$t("hero.preview.highlightArchitecture")}</span>
                                            </div>
                                            <div class="flex items-center gap-2 text-[11px] text-gray-300">
                                                <svg class="w-3 h-3 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                <span class="truncate">{$t("hero.preview.highlightInteractive")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Metrics Ribbon (Seamlessly integrated, cohesive segmented bar with micro dividers) -->
                                    <div class="mt-2 p-1.5 sm:p-2 rounded-xl bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-white/[0.04] border border-white/10 shadow-inner flex items-center justify-between">
                                        {#each stats as stat, i}
                                            {#if i > 0}
                                                <div class="h-6 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent shrink-0"></div>
                                            {/if}
                                            <div class="flex-1 flex flex-col items-center justify-center px-1 text-center group">
                                                <div class="flex items-center gap-1.5 mb-0.5">
                                                    <span class="w-1.5 h-1.5 rounded-full {stat.dot} group-hover:scale-125 transition-transform shrink-0"></span>
                                                    <span class="text-base sm:text-lg font-bold text-white font-mono tracking-tight leading-none">{stat.value}</span>
                                                </div>
                                                <span class="text-[10px] {stat.labelColor} font-medium tracking-tight truncate">{stat.label}</span>
                                            </div>
                                        {/each}
                                    </div>
                                </div>

                                <!-- Vertical Separator with luminous tech node -->
                                <div class="relative w-px self-stretch shrink-0 flex items-center justify-center my-1">
                                    <div class="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent"></div>
                                </div>

                                <!-- Right Column: Key Technologies (Super compact, never overflows) -->
                                <div class="w-[145px] sm:w-[155px] flex flex-col justify-center shrink-0 pl-0.5">
                                    <div class="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                        <span>{$t("hero.preview.techStack")}</span>
                                    </div>
                                    <div class="flex flex-col gap-1">
                                        {#each keySkills as skill}
                                            <div class="px-2 py-1 text-[11px] rounded-lg border {skill.color} font-medium flex items-center justify-between transition-all hover:translate-x-0.5 leading-tight">
                                                <span class="truncate">{skill.name}</span>
                                                <span class="w-1 h-1 rounded-full bg-current opacity-70 shrink-0 ml-1"></span>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            </div>

                            <!-- Footer Links -->
                            <div class="relative pt-3.5 flex items-center justify-between text-xs">
                                <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
                                <button
                                    on:click={() => scrollTo("about")}
                                    class="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
                                >
                                    <span>{$t("hero.preview.viewAbout")}</span>
                                    <svg class="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>

                                <button
                                    on:click={() => selectTab("projects")}
                                    class="text-gray-400 hover:text-white font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <span>{$t("hero.preview.switchTab")}</span>
                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Projects Tab Panel -->
                        <div
                            class="col-start-1 row-start-1 flex flex-col justify-between h-full transition-all duration-500 ease-out {activeTab === 'projects' ? 'opacity-100 translate-y-0 pointer-events-auto z-10' : 'opacity-0 translate-y-2 pointer-events-none z-0'}"
                        >
                            <!-- Top controls -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-gray-400 font-mono font-medium">
                                        {featuredProjects[currentProjectIndex].category}
                                    </span>
                                </div>

                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-mono text-gray-400">
                                        0{currentProjectIndex + 1} / 0{featuredProjects.length}
                                    </span>
                                    <div class="flex gap-1">
                                        <button
                                            type="button"
                                            on:click={prevProject}
                                            aria-label={$t("hero.preview.seePrev")}
                                            class="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
                                        >
                                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            on:click={nextProject}
                                            aria-label={$t("hero.preview.seeNext")}
                                            class="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
                                        >
                                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Subtle divider between controls and card -->
                            <div class="relative h-px w-full my-1.5 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"></div>

                            <!-- Featured Project Card -->
                            <div class="group/proj relative rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-indigo-500/40 hover:bg-white/[0.04]">
                                <div class="relative h-36 sm:h-38 w-full overflow-hidden bg-black/40">
                                    <img
                                        src={featuredProjects[currentProjectIndex].image}
                                        alt={featuredProjects[currentProjectIndex].title}
                                        class="w-full h-full object-cover object-center transform group-hover/proj:scale-105 transition-transform duration-500"
                                        loading="eager"
                                    />
                                    <div class="absolute inset-0 bg-gradient-to-t from-[#0d0f17] via-[#0d0f17]/40 to-transparent"></div>
                                    <div class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-cyan-300">
                                        {featuredProjects[currentProjectIndex].highlight}
                                    </div>
                                </div>

                                <div class="p-3.5 sm:p-4">
                                    <div class="flex items-center justify-between mb-1.5">
                                        <h3 class="text-base sm:text-lg font-bold text-white tracking-tight">
                                            {featuredProjects[currentProjectIndex].title}
                                        </h3>
                                        <button
                                            on:click={() => scrollTo("projects")}
                                            class="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                                        >
                                            <span>{$t("hero.preview.viewInProjects")}</span>
                                            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>

                                    <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                                        {featuredProjects[currentProjectIndex].description}
                                    </p>

                                    <!-- Tags -->
                                    <div class="flex flex-wrap gap-1.5">
                                        {#each featuredProjects[currentProjectIndex].tags as tag}
                                            <span class="px-2 py-0.5 text-[11px] rounded bg-white/5 border border-white/10 text-gray-300 font-mono">
                                                {tag}
                                            </span>
                                        {/each}
                                    </div>
                                </div>
                            </div>

                            <!-- Footer Switcher Dots & All Projects Link -->
                            <div class="relative pt-3 flex items-center justify-between text-xs">
                                <div class="flex items-center gap-1.5">
                                    {#each featuredProjects as _, idx}
                                        <button
                                            type="button"
                                            on:click={() => setProject(idx)}
                                            class="h-1.5 rounded-full transition-all duration-300 cursor-pointer {idx === currentProjectIndex ? 'w-6 bg-indigo-500' : 'w-2 bg-white/20 hover:bg-white/40'}"
                                            aria-label={`Proyecto ${idx + 1}`}
                                        ></button>
                                    {/each}
                                </div>

                                <button
                                    on:click={() => scrollTo("projects")}
                                    class="text-gray-300 hover:text-white font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
                                >
                                    <span>{$t("hero.preview.allProjects")}</span>
                                    <svg class="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>

    <!-- Scroll down indicator (fades out naturally on scroll) -->
    <button
        on:click={() => scrollTo("about")}
        class="hero-fade-interactive absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 animate-bounce-slow z-20 will-change-transform cursor-pointer"
        style="opacity: {Math.max(0, 1 - scrollProgress * 5)}; pointer-events: {scrollProgress > 0.2 ? 'none' : 'auto'};"
        aria-label="Scroll down"
    >
        <svg class="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
            /></svg
        >
    </button>
</section>

<style>
    /* Scroll blur por elemento */
    .hero-fade {
        filter: blur(var(--hero-blur, 0px));
        transition: filter 150ms ease-out;
    }

    /* Elementos interactivos */
    .hero-fade-interactive {
        filter: blur(var(--hero-blur, 0px));
        transition: filter 200ms ease-out;
    }
    .hero-fade-interactive:hover,
    .hero-fade-interactive:focus-within {
        filter: blur(0px) !important;
    }

    .hero-grid {
        background-size: 40px 40px;
        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        animation: gridPulse 8s ease-in-out infinite;
    }

    @keyframes gridPulse {
        0%,
        100% {
            opacity: 0.2;
        }
        50% {
            opacity: 0.12;
        }
    }

    @keyframes bounce-slow {
        0%,
        100% {
            transform: translateY(0);
            opacity: 0.5;
        }
        50% {
            transform: translateY(10px);
            opacity: 1;
        }
    }
    .animate-bounce-slow {
        animation: bounce-slow 2.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
    }

    .hero-title {
        background: linear-gradient(180deg, #ffffff 25%, #e2e8f0 70%, #cbd5e1 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -0.04em;
    }

    .hero-cta {
        position: relative;
    }
    .hero-cta::after {
        content: "";
        position: absolute;
        inset: -2px;
        border-radius: 9999px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent, rgba(255, 255, 255, 0.1));
        opacity: 0;
        transition: opacity 0.4s ease;
        z-index: -1;
        filter: blur(8px);
    }
    .hero-cta:hover::after {
        opacity: 1;
    }

    @keyframes eqBar1 {
        0%, 100% { height: 6px; }
        50% { height: 18px; }
    }
    @keyframes eqBar2 {
        0%, 100% { height: 16px; }
        50% { height: 7px; }
    }
    @keyframes eqBar3 {
        0%, 100% { height: 9px; }
        50% { height: 20px; }
    }
    @keyframes eqBar4 {
        0%, 100% { height: 18px; }
        50% { height: 6px; }
    }
    @keyframes eqBar5 {
        0%, 100% { height: 8px; }
        50% { height: 15px; }
    }
    .animate-bar-1 { animation: eqBar1 1.2s ease-in-out infinite; }
    .animate-bar-2 { animation: eqBar2 0.9s ease-in-out infinite; }
    .animate-bar-3 { animation: eqBar3 1.4s ease-in-out infinite; }
    .animate-bar-4 { animation: eqBar4 1.1s ease-in-out infinite; }
    .animate-bar-5 { animation: eqBar5 1.3s ease-in-out infinite; }
</style>
