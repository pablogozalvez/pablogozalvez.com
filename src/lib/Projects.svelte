<script>
    import { reveal, rafThrottle } from "./actions";
    import { onMount } from "svelte";
    import { t } from "./i18n";
    import PdfViewer from "./PdfViewer.svelte";

    let containerRef;
    let isScrolling = false;
    let scrollTimer;

    let showPdfModal = false;

    $: {
        if (typeof document !== "undefined") {
            if (showPdfModal) {
                document.body.classList.add("hide-global-cursor");
            } else {
                document.body.classList.remove("hide-global-cursor");
            }
        }
    }

    let currentPdfUrl = "";
    let currentPdfTitle = "";
    let currentPdfDownloadName = "";

    function openPdf(url, title) {
        currentPdfUrl = url;
        currentPdfTitle = title;
        currentPdfDownloadName = title.replace(/\s+/g, "_") + ".pdf";
        showPdfModal = true;
    }

    $: projects = [
        {
            title: "OutReal",
            description:
                $t("projects.items.outreal.description") ||
                "Virtual Reality environment focused on realistic interactions.",
            image: "/img/outreal.webp",
            pdf: "/media/pdf/OutReal-Memoria.pdf",
            tags: ["Ionic", "Angular", "PostGIS", "Full Stack"],
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
            link: "https://assetstore.unity.com/packages/tools/gui/scroll-carousel-306533",
            linkType: "demo",
            article: "https://github.com/pablogozalvez/ScrollCarousel",
            articleType: "Source Code",
            tags: ["Open Source", "UI Tooling", "Unity"],
            featured: false,
        },
        {
            title: "Recorridos virtuales de guiado intrahospitalario",
            description: $t("projects.items.hospitalXyz.description"),
            image: "/img/hospitalxyz.webp",
            link: "https://hospital.fernandoruizrico.com/",
            linkType: "demo",
            article:
                "https://portal.edu.gva.es/cipfpcanastell/2025/04/15/el-cipfp-canastell-se-engalana-de-innovacion/",
            tags: ["Three.js", "WebGL", "Virtual Tours", "Healthcare"],
            featured: true,
        },
        {
            title: "Tricky Mansion",
            description: $t("projects.items.trickyMansion.description"),
            image: "/img/tricky-mansion.webp",
            link: "https://jayoru.itch.io/tricky-mansion",
            linkType: "demo",
            article: "https://play.google.com/store/apps/details?id=com.ChapayPinturaJorgeRal.TrickyMansion",
            articleType: "Google Play",
            tags: ["Unity", "C#", "Game Dev", "Procedural Gen"],
            featured: true,
        },
        {
            title: "Super Mario Phaser",
            description: $t("projects.items.superMarioPhaser.description"),
            image: "/img/super-mario-phaser.webp",
            link: "https://pablogozalvez.github.io/Super-Mario-Phaser/",
            linkType: "demo",
            article: "https://github.com/pablogozalvez/Super-Mario-Phaser",
            articleType: "Source Code",
            tags: ["Phaser", "JavaScript", "WebGame", "Procedural Gen"],
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
        {
            title: "Clumsy Mimics",
            description: $t("projects.items.clumsyMimics.description"),
            image: "/img/clumsy-mimics.webp",
            link: "https://github.com/pablogozalvez/ClumsyMimics",
            linkType: "demo",
            tags: ["Game Jam", "Rapid Dev", "Unity", "C#"],
            featured: true,
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
            window.removeEventListener("scroll", onScroll);
            clearTimeout(scrollTimer);
        };
    });
</script>

<section
    id="projects"
    class="py-32 relative bg-gradient-to-b from-[#080808] to-[#050505] -mt-px overflow-hidden"
    aria-label="Projects"
    on:mousemove={handleMouseMove}
>
    <!-- Mantenemos oculto el cursor principal cuando el PDF Modal esté abierto, 
         para ello inyectamos en el DOM una clase manejada por style global o usamos hidden desde el layout -->
    <PdfViewer bind:showPdfModal pdfUrl={currentPdfUrl} title={currentPdfTitle} downloadName={currentPdfDownloadName} />

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
        <div class="proj-header flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6" use:reveal>
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
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a
                    href={project.link || project.article || "#"}
                    target={project.link || project.article ? "_blank" : undefined}
                    rel={project.link || project.article ? "noopener noreferrer" : undefined}
                    on:click={(e) => {
                        if (project.pdf) {
                            e.preventDefault();
                            openPdf(project.pdf, project.title);
                        }
                    }}
                    class="project-card group cursor-pointer text-left relative flex flex-col {project.featured
                        ? 'md:col-span-2 md:flex-row'
                        : ''} overflow-hidden rounded-3xl bg-[#0F1115] border border-white/5 hover:border-white/10"
                    use:reveal
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
                        <div class="absolute top-4 left-4 z-40 flex flex-wrap gap-2">
                            {#if project.featured}
                                <span
                                    class="px-3 py-1 text-[10px] font-bold uppercase rounded-full border border-white/20 tracking-wider bg-gradient-to-r from-indigo-500/90 to-purple-500/90 backdrop-blur-md text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                                >
                                    Featured
                                </span>
                            {/if}
                            {#if project.linkType === "demo"}
                                <span
                                    class="px-3 py-1 text-[10px] font-bold uppercase rounded-full border border-emerald-400/30 tracking-wider bg-emerald-950/80 backdrop-blur-md text-emerald-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                                >
                                    Demo
                                </span>
                            {/if}
                            {#if project.article}
                                <span
                                    class="px-3 py-1 text-[10px] font-bold uppercase rounded-full border border-blue-400/30 tracking-wider bg-blue-950/80 backdrop-blur-md text-blue-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                                >
                                    {project.articleType || "Artículo"}
                                </span>
                            {/if}
                        </div>
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
                            class="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 translate-x-3 -translate-y-3 scale-75 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg"
                        >
                            <svg
                                class="w-5 h-5 ml-[2px] -mt-[2px] transform -rotate-45 transition-transform duration-500 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
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

                        {#if project.article}
                            <button
                                on:click|preventDefault|stopPropagation={() => window.open(project.article, "_blank")}
                                class="absolute bottom-4 right-4 z-40 group/btn flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold tracking-wide text-indigo-50 bg-[#0F1115]/80 hover:bg-black/90 border border-indigo-500/30 hover:border-indigo-400/50 rounded-lg backdrop-blur-md transition-all overflow-hidden w-auto max-w-[calc(100%-2rem)]"
                            >
                                <span class="relative z-10 whitespace-nowrap truncate"
                                    >{project.articleType || "Más info"}</span
                                >
                                <svg
                                    class="w-3.5 h-3.5 relative z-10 flex-shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                                <div
                                    class="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"
                                ></div>
                            </button>
                        {/if}
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

                        <div
                            class="flex flex-col sm:flex-row sm:items-end justify-between mt-auto pt-6 border-t border-white/5 gap-4"
                        >
                            <div class="flex flex-wrap gap-1.5 w-full">
                                {#each project.tags as tag}
                                    <span
                                        class="px-2.5 py-1 text-[10px] font-medium tracking-wide text-gray-400 bg-white/5 border border-white/10 rounded-md group-hover:text-gray-200 group-hover:border-white/20"
                                        style="transition: color 0.3s, border-color 0.3s, background-color 0.3s;"
                                    >
                                        {tag}
                                    </span>
                                {/each}
                            </div>
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
        transition:
            border-color 0.3s,
            box-shadow 0.4s ease,
            transform 0.4s ease;
        contain: layout style;
    }

    .project-card:global([data-revealed]) {
        animation: cardReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        animation-delay: var(--reveal-delay, 0ms);
    }

    .project-card:hover {
        box-shadow:
            0 0 40px rgba(99, 102, 241, 0.08),
            0 20px 60px rgba(0, 0, 0, 0.3);
        transform: translateY(-4px);
    }

    /* Override app.css content-visibility: auto on project images to prevent CLS */
    .project-img {
        content-visibility: visible !important;
    }

    /* Hover scale via CSS only — no JS involved, GPU-composited */
    .project-card:hover .project-img {
        transform: scale(1.08);
        filter: grayscale(0) brightness(1.05);
    }

    .project-img {
        filter: grayscale(0.3);
        transition:
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.7s ease-out;
        will-change: transform;
    }

    /* Shimmer sweep on featured cards */
    .project-card::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 35;
        background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255, 255, 255, 0.03) 45%,
            rgba(255, 255, 255, 0.06) 50%,
            rgba(255, 255, 255, 0.03) 55%,
            transparent 60%
        );
        background-size: 200% 100%;
        background-position: 200% 0;
        pointer-events: none;
        transition: none;
    }

    .project-card:hover::after {
        animation: shimmerSweep 0.8s ease-out forwards;
    }

    .proj-header {
        opacity: 0;
    }

    .proj-header:global([data-revealed]) {
        animation: headerReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    @keyframes cardReveal {
        from {
            opacity: 0;
            transform: translateY(40px) scale(0.97);
            filter: blur(4px);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
        }
    }

    @keyframes headerReveal {
        from {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(3px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
        }
    }

    @keyframes shimmerSweep {
        from {
            background-position: 200% 0;
        }
        to {
            background-position: -200% 0;
        }
    }
</style>
