<script>
    import { viewport, rafThrottle } from "./actions";
    import { t } from "./i18n";

    let visible = false;
    let containerRef;

    $: projects = [
        {
            title: "Tricky Mansion",
            description: $t("projects.items.trickyMansion.description"),
            image: "/img/tricky-mansion.webp",
            link: "https://play.google.com/store/apps/details?id=com.ChapayPinturaJorgeRal.TrickyMansion",
            tags: ["Unity", "C#", "Game Dev", "Procedural Gen"],
            featured: true,
        },
        {
            title: "PseudoBlocks",
            description: $t("projects.items.pseudoBlocks.description"),
            image: "/img/pseudoblocks.webp",
            link: "https://github.com/pablogozalvez/PseudoBlocks",
            tags: ["C#", "WinForms", "Compilers", "UI Tooling"],
            featured: false,
        },
        {
            title: "Scroll Carousel",
            description: $t("projects.items.scrollCarousel.description"),
            image: "/img/scroll-carousel.webp",
            link: "https://github.com/pablogozalvez/ScrollCarousel",
            tags: ["Open Source", "UI Tooling", "Unity"],
            featured: false,
        },
        {
            title: "Clumsy Mimics",
            description: $t("projects.items.clumsyMimics.description"),
            image: "/img/clumsy-mimics.webp",
            link: "https://github.com/pablogozalvez/ClumsyMimics",
            tags: ["Game Jam", "Rapid Dev", "Unity", "C#"],
            featured: true,
        },
        {
            title: "Super Mario Phaser",
            description: $t("projects.items.superMarioPhaser.description"),
            image: "/img/super-mario-phaser.webp",
            link: "https://github.com/pablogozalvez/Super-Mario-Phaser",
            tags: ["Phaser", "JavaScript", "WebGame", "Procedural Gen"],
            featured: false,
        },
        {
            title: "Space Invaders",
            description: $t("projects.items.spaceInvaders.description"),
            image: "/img/space-invaders.webp",
            link: "https://github.com/pablogozalvez/Space-Invaders",
            tags: ["C#", "Console", "Low Level", "Game Dev"],
            featured: false,
        },
        {
            title: "Joker Assistant",
            description: $t("projects.items.jokerAssistant.description"),
            image: "/img/joker-assistant.webp",
            link: "https://github.com/pablogozalvez/Joker-Assistant",
            tags: ["AI", "Speech Rec", "WinForms", "C#"],
            featured: false,
        },
    ];

    const handleMouseMove = rafThrottle((e) => {
        if (!containerRef) return;
        const cards = containerRef.getElementsByClassName("project-card");

        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        }
    });
</script>

<section
    id="projects"
    class="py-32 relative bg-gradient-to-b from-[#080808] to-[#050505] -mt-px overflow-hidden"
    aria-label="Projects"
    use:viewport
    on:enterViewport={() => (visible = true)}
    on:mousemove={handleMouseMove}
    bind:this={containerRef}
>
    <div class="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.05]"></div>
    <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"
    ></div>

    <div
        class="absolute -top-[300px] -right-20 w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <div
        class="absolute -top-[250px] -left-20 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-950/20 blur-[150px] rounded-full pointer-events-none"
    ></div>

    <div
        class="absolute -bottom-40 -left-20 w-[600px] h-[600px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div
            class="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6 transition-all duration-1000 transform {visible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'}"
        >
            <div>
                <h2 class="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                    {@html $t("projects.title")}
                </h2>
                <p class="text-xl text-gray-400 max-w-xl font-light leading-relaxed">
                    {$t("projects.subtitle")}
                </p>
            </div>

            <a
                href="https://github.com/pablogozalvez"
                target="_blank"
                class="hidden md:flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-white transition-colors group"
            >
                <span>{$t("projects.viewArchive")}</span>
                <svg
                    class="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path></svg
                >
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {#each projects as project, i}
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-card group relative flex flex-col {project.featured
                        ? 'md:col-span-2 md:flex-row'
                        : ''} overflow-hidden rounded-3xl bg-[#0F1115] border border-white/5 hover:border-white/10 transition-all duration-500 {visible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'}"
                    style="transition-delay: {i * 100}ms"
                >
                    <div
                        class="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-30"
                        style="background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.08), transparent 40%);"
                    ></div>

                    <div
                        class="relative overflow-hidden w-full {project.featured
                            ? 'h-72 md:h-auto md:w-1/2'
                            : 'h-56 basis-1/2'}"
                    >
                        {#if project.featured}
                            <span
                                class="absolute top-4 left-4 z-40 px-3 py-1 text-xs font-bold uppercase rounded-full border border-white/10 tracking-wider bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-lg"
                            >
                                Featured
                            </span>
                        {/if}
                        <div
                            class="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay"
                        ></div>
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-transparent z-20 opacity-80"
                        ></div>

                        <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out filter grayscale-[0.3] group-hover:grayscale-0"
                        />

                        <div
                            class="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                        >
                            <svg
                                class="w-4 h-4 transform -rotate-45"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                ></path></svg
                            >
                        </div>
                    </div>

                    <div
                        class="relative z-20 p-8 flex flex-col justify-between w-full {project.featured
                            ? 'md:w-1/2'
                            : 'basis-1/2'} bg-[#0F1115]"
                    >
                        <div
                            class="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        ></div>

                        <div>
                            <h3
                                class="{project.featured
                                    ? 'text-3xl md:text-4xl font-extrabold text-white mb-4'
                                    : 'text-xl md:text-2xl font-bold text-white mb-3'} group-hover:text-indigo-400 transition-colors"
                            >
                                {project.title}
                            </h3>
                            <p
                                class={project.featured
                                    ? "text-gray-200 text-base md:text-lg leading-relaxed line-clamp-7 mb-8"
                                    : "text-gray-400 text-sm leading-relaxed line-clamp-5 mb-6"}
                            >
                                {project.description}
                            </p>
                        </div>

                        <div class="flex flex-wrap gap-2 mt-auto">
                            {#each project.tags as tag}
                                <span
                                    class="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono text-gray-500 bg-white/5 border border-white/5 rounded transition-colors group-hover:text-gray-300 group-hover:border-white/10"
                                >
                                    {tag}
                                </span>
                            {/each}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</section>

<style>
    .project-card {
        --mouse-x: 0px;
        --mouse-y: 0px;
    }
</style>
