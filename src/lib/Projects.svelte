<script>
    import { rafThrottle } from "./actions";
    import { onMount } from "svelte";
    import { t } from "./i18n";

    let sectionRef;
    let containerRef;
    let revealed = false;
    let isScrolling = false;
    let scrollTimer;

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
        if (!containerRef || isScrolling) return;
        const cards = containerRef.getElementsByClassName("project-card");
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }
    });

    onMount(() => {
        // Single-fire observer: once visible, reveal and never toggle back
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    revealed = true;
                    observer.disconnect();
                }
            },
            { threshold: 0.05, rootMargin: "0px 0px -50px 0px" },
        );
        observer.observe(sectionRef);

        // Detect scrolling to pause mousemove handler
        const onScroll = () => {
            isScrolling = true;
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                isScrolling = false;
            }, 150);
        };
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
            clearTimeout(scrollTimer);
        };
    });
</script>

<section
    id="projects"
    class="py-32 relative bg-gradient-to-b from-[#080808] to-[#050505] -mt-px overflow-hidden"
    aria-label="Projects"
    bind:this={sectionRef}
    on:mousemove={handleMouseMove}
>
    <div class="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.05]" style="background-size: 30px 30px;"></div>

    <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style="background-image: url('/img/noise-transparent.webp');"
    ></div>

    <div
        class="absolute -top-[300px] -right-20 w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"
    ></div>
    <div
        class="absolute -top-[250px] -left-20 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"
    ></div>
    <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-950/15 blur-[150px] rounded-full pointer-events-none"
    ></div>
    <div
        class="absolute -bottom-[300px] -left-20 w-[600px] h-[600px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none"
    ></div>
    <div
        class="absolute -bottom-[250px] -right-20 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10" bind:this={containerRef}>
        <!-- Header -->
        <div class="proj-header flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6" class:revealed>
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

        <!-- Cards grid — NO auto-rows-fr, fixed card heights via min-h -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each projects as project, i}
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-card group relative flex flex-col {project.featured
                        ? 'md:col-span-2 md:flex-row'
                        : ''} overflow-hidden rounded-3xl bg-[#0F1115] border border-white/5 hover:border-white/10"
                    class:revealed
                    style="--reveal-delay: {i * 80}ms"
                >
                    <!-- Mouse spotlight -->
                    <div
                        class="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 z-30"
                        style="background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.08), transparent 40%); transition: opacity 0.3s;"
                    ></div>

                    <!-- Image — fixed height, no flex-basis, shrink-0 prevents layout recalc -->
                    <div
                        class="relative overflow-hidden w-full flex-shrink-0 {project.featured
                            ? 'h-72 md:h-auto md:w-1/2'
                            : 'h-56'}"
                    >
                        {#if project.featured}
                            <span
                                class="absolute top-4 left-4 z-40 px-3 py-1 text-xs font-bold uppercase rounded-full border border-white/10 tracking-wider bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-lg"
                            >
                                Featured
                            </span>
                        {/if}
                        <div
                            class="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent z-10 mix-blend-overlay"
                            style="transition: background-color 0.5s;"
                        ></div>
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-transparent z-20 opacity-80"
                        ></div>

                        <img
                            src={project.image}
                            alt={project.title}
                            loading="eager"
                            decoding="async"
                            width="600"
                            height="400"
                            class="project-img w-full h-full object-cover"
                        />

                        <div
                            class="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                            style="transition: opacity 0.3s, transform 0.3s;"
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

                    <!-- Content — flex-grow fills remaining space -->
                    <div
                        class="relative z-20 p-8 flex flex-col justify-between w-full flex-grow {project.featured
                            ? 'md:w-1/2'
                            : ''} bg-[#0F1115]"
                    >
                        <div
                            class="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        ></div>

                        <div>
                            <h3
                                class="{project.featured
                                    ? 'text-3xl md:text-4xl font-extrabold text-white mb-4'
                                    : 'text-xl md:text-2xl font-bold text-white mb-3'} group-hover:text-indigo-400"
                                style="transition: color 0.3s;"
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
                                    class="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono text-gray-500 bg-white/5 border border-white/5 rounded group-hover:text-gray-300 group-hover:border-white/10"
                                    style="transition: color 0.3s, border-color 0.3s;"
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
        opacity: 0;
        border-color: rgba(255, 255, 255, 0.05);
        transition: border-color 0.3s;
        contain: layout style;
    }

    .project-card.revealed {
        animation: cardReveal 0.6s ease-out forwards;
        animation-delay: var(--reveal-delay, 0ms);
    }

    /* Override app.css content-visibility: auto on project images to prevent CLS */
    .project-img {
        content-visibility: visible !important;
    }

    /* Hover scale via CSS only — no JS involved, GPU-composited */
    .project-card:hover .project-img {
        transform: scale(1.05);
        filter: grayscale(0);
    }

    .project-img {
        filter: grayscale(0.3);
        transition:
            transform 0.7s ease-out,
            filter 0.7s ease-out;
        will-change: transform;
    }

    .proj-header {
        opacity: 0;
    }

    .proj-header.revealed {
        animation: fadeIn 0.8s ease-out forwards;
    }

    @keyframes cardReveal {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
