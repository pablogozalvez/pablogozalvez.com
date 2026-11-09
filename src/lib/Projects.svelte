<script>
    import { reveal } from "./actions";
    import { onMount } from "svelte";
    import { getI18n } from "./i18n";
    import PdfViewer from "./PdfViewer.svelte";
    import { IconArrowRight, IconExternalLink } from "./icons";

    const { t } = getI18n();

    let containerRef;
    let isScrolling = false;
    let scrollTimer;

    let showPdfModal = false;

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
            tags: [
                "C#",
                "WinForms",
                $t("projectTags.compilers"),
                $t("projectTags.uiTooling"),
            ],
            featured: false,
        },
        {
            title: "Scroll Carousel",
            description: $t("projects.items.scrollCarousel.description"),
            image: "/img/scroll-carousel.webp",
            link: "https://assetstore.unity.com/packages/tools/gui/scroll-carousel-306533",
            linkType: "demo",
            article: "https://github.com/pablogozalvez/ScrollCarousel",
            articleType: $t("projects.sourceCode"),
            tags: [
                $t("projectTags.openSource"),
                $t("projectTags.uiTooling"),
                "Unity",
            ],
            featured: false,
        },
        {
            title: $t("projects.items.hospitalXyz.title"),
            description: $t("projects.items.hospitalXyz.description"),
            image: "/img/hospitalxyz.webp",
            link: "https://hospital.fernandoruizrico.com/",
            linkType: "demo",
            article:
                "https://portal.edu.gva.es/cipfpcanastell/2025/04/15/el-cipfp-canastell-se-engalana-de-innovacion/",
            tags: [
                "Three.js",
                "WebGL",
                $t("projectTags.virtualTours"),
                $t("projectTags.healthcare"),
            ],
            featured: true,
        },
        {
            title: "Tricky Mansion",
            description: $t("projects.items.trickyMansion.description"),
            image: "/img/tricky-mansion.webp",
            link: "https://jayoru.itch.io/tricky-mansion",
            linkType: "demo",
            article:
                "https://play.google.com/store/apps/details?id=com.ChapayPinturaJorgeRal.TrickyMansion",
            articleType: "Google Play",
            tags: [
                "Unity",
                "C#",
                $t("projectTags.gameDev"),
                $t("projectTags.proceduralGeneration"),
            ],
            featured: true,
        },
        {
            title: "Super Mario Phaser",
            description: $t("projects.items.superMarioPhaser.description"),
            image: "/img/super-mario-phaser.webp",
            link: "https://pablogozalvez.github.io/Super-Mario-Phaser/",
            linkType: "demo",
            article: "https://github.com/pablogozalvez/Super-Mario-Phaser",
            articleType: $t("projects.sourceCode"),
            tags: [
                "Phaser",
                "JavaScript",
                $t("projectTags.webGame"),
                $t("projectTags.proceduralGeneration"),
            ],
            featured: false,
        },
        {
            title: "Joker Assistant",
            description: $t("projects.items.jokerAssistant.description"),
            image: "/img/joker-assistant.webp",
            link: "https://github.com/pablogozalvez/Joker-Assistant",
            tags: [
                $t("projectTags.ai"),
                $t("projectTags.speechRecognition"),
                "WinForms",
                "C#",
            ],
            featured: false,
        },
        {
            title: "Clumsy Mimics",
            description: $t("projects.items.clumsyMimics.description"),
            image: "/img/clumsy-mimics.webp",
            link: "https://github.com/pablogozalvez/ClumsyMimics",
            linkType: "demo",
            tags: [
                "Game Jam",
                $t("projectTags.rapidDevelopment"),
                "Unity",
                "C#",
            ],
            featured: true,
        },
    ];
</script>

<section
    id="projects"
    class="py-32 relative bg-[#0a0a0c] -mt-px overflow-hidden"
    aria-label={$t("nav.projects")}
>
    <!-- Section top accent divider -->
    <div
        class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent"
    ></div>
    <PdfViewer
        bind:showPdfModal
        pdfUrl={currentPdfUrl}
        title={currentPdfTitle}
        downloadName={currentPdfDownloadName}
    />

    <!-- Cross-hatch pattern overlay -->
    <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none projects-crosshatch"
    ></div>

    <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style="background-image: url('/img/noise-transparent.webp');"
    ></div>

    <div
        class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        bind:this={containerRef}
    >
        <!-- Header -->
        <div
            class="proj-header flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6"
            use:reveal
        >
            <div>
                <div class="flex items-center gap-3 mb-4">
                    <span
                        class="text-[11px] font-mono font-semibold text-gray-500 uppercase tracking-widest"
                        >02</span
                    >
                    <div
                        class="h-px w-12 bg-gradient-to-r from-white/20 to-transparent"
                    ></div>
                </div>
                <h2
                    class="section-title text-4xl md:text-5xl text-white mb-4 tracking-tight"
                >
                    {$t("projects.title")}
                </h2>
                <p
                    class="text-xl text-gray-400 max-w-xl font-light leading-relaxed"
                >
                    {$t("projects.subtitle")}
                </p>
            </div>

            <a
                href="https://github.com/pablogozalvez?tab=repositories"
                target="_blank"
                class="hidden md:flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-white transition-colors"
            >
                <span>{$t("projects.viewArchive")}</span>
                <IconArrowRight class="w-4 h-4" />
            </a>
        </div>

        <!-- Cards grid NO auto-rows-fr, fixed card heights via min-h -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each projects as project}
                <div
                    class="project-reveal-shell {project.featured
                        ? 'md:col-span-2'
                        : ''}"
                    use:reveal
                >
                    <article
                        class="project-card group h-full cursor-pointer text-left relative flex flex-col {project.featured
                            ? 'md:flex-row'
                            : ''} overflow-hidden rounded-3xl bg-[#0F1115] border border-white/5 hover:border-white/10"
                    >
                        {#if project.pdf}
                            <a
                                href={project.pdf}
                                aria-label={$t("projects.openPdf") +
                                    ": " +
                                    project.title}
                                on:click|preventDefault={() =>
                                    openPdf(project.pdf, project.title)}
                                class="project-primary-action absolute inset-0 z-[36] rounded-3xl border-0 bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-300"
                            ></a>
                        {:else if project.link || project.article}
                            <a
                                href={project.link || project.article}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={$t("projects.openProject") +
                                    ": " +
                                    project.title}
                                class="project-primary-action absolute inset-0 z-[36] rounded-3xl focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-300"
                            ></a>
                        {/if}

                        <!-- Image fixed height, no flex-basis, shrink-0 prevents layout recalc -->
                        <div
                            class="relative overflow-hidden w-full flex-shrink-0 {project.featured
                                ? 'h-72 md:h-auto md:w-1/2'
                                : 'h-56'}"
                        >
                            <div
                                class="absolute top-4 left-4 z-40 flex flex-wrap gap-2 pointer-events-none"
                            >
                                {#if project.featured}
                                    <span
                                        class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border border-white/20 tracking-wider bg-black/70 text-white"
                                    >
                                        {$t("projects.featured")}
                                    </span>
                                {/if}
                                {#if project.pdf}
                                    <span
                                        class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border border-red-400/30 tracking-wider bg-black/70 text-red-200"
                                    >
                                        PDF
                                    </span>
                                {:else if project.linkType === "demo"}
                                    <span
                                        class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border border-emerald-400/30 tracking-wider bg-black/70 text-emerald-300"
                                    >
                                        Demo
                                    </span>
                                {/if}
                                {#if project.article && (project.link || project.pdf)}
                                    <span
                                        class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border border-indigo-400/30 tracking-wider bg-black/70 text-indigo-200"
                                    >
                                        {project.articleType ||
                                            $t("projects.article")}
                                    </span>
                                {/if}
                            </div>
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-transparent z-20 opacity-80"
                            ></div>

                            <img
                                src={project.image}
                                alt={project.title}
                                loading="lazy"
                                decoding="async"
                                width="600"
                                height="400"
                                class="project-img w-full h-full object-cover"
                            />

                            <div
                                aria-hidden="true"
                                class="pointer-events-none absolute top-4 right-4 z-30 grid h-10 w-10 place-items-center rounded-xl bg-black/60 border border-white/10 text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200"
                            >
                                {#if project.pdf}
                                    <svg
                                        class="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="1.8"
                                            d="M7 3.75h7l5 5v11.5a.75.75 0 0 1-.75.75H7a3 3 0 0 1-3-3V6.75a3 3 0 0 1 3-3Z"
                                        />
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="1.8"
                                            d="M14 4v5h5M8 14h8M8 17h5"
                                        />
                                    </svg>
                                {:else}
                                    <svg
                                        class="block h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="1.8"
                                            d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.71"
                                        />
                                    </svg>
                                {/if}
                            </div>

                            {#if project.article}
                                <a
                                    href={project.article}
                                    aria-label={(project.articleType ||
                                        $t("projects.moreInfo")) +
                                        ": " +
                                        project.title}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="absolute bottom-4 right-4 z-40 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wide text-indigo-50 bg-[#0F1115]/90 hover:bg-black border border-indigo-500/30 hover:border-indigo-400/50 rounded-lg transition-colors w-auto max-w-[calc(100%-2rem)]"
                                >
                                    <span class="whitespace-nowrap truncate"
                                        >{project.articleType ||
                                            $t("projects.moreInfo")}</span
                                    >
                                    <IconExternalLink
                                        class="w-3.5 h-3.5 flex-shrink-0 text-indigo-300"
                                    />
                                </a>
                            {/if}
                        </div>

                        <!-- Content flex-grow fills remaining space -->
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
                    </article>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .projects-crosshatch {
        background-image: linear-gradient(
                45deg,
                rgba(255, 255, 255, 0.4) 1px,
                transparent 1px
            ),
            linear-gradient(
                -45deg,
                rgba(255, 255, 255, 0.4) 1px,
                transparent 1px
            );
        background-size: 32px 32px;
    }

    .project-reveal-shell {
        opacity: 1;
        transform: none;
        transition:
            opacity 0.45s ease-out,
            transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .project-reveal-shell:global([data-reveal-pending]) {
        opacity: 0;
        transform: translate3d(0, 32px, 0) scale(0.985);
    }

    .project-card {
        border-color: rgba(255, 255, 255, 0.05);
        transition: border-color 0.3s ease;
        contain: layout style;
    }

    .project-card:hover {
        border-color: rgba(255, 255, 255, 0.15);
    }

    /* Override app.css content-visibility: auto on project images to prevent CLS */
    .project-img {
        content-visibility: visible !important;
        transition: opacity 0.3s ease;
    }

    .project-card:hover .project-img {
        opacity: 0.95;
    }

    .proj-header {
        opacity: 1;
        transform: none;
        transition:
            opacity 0.5s ease-out,
            transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .proj-header:global([data-reveal-pending]) {
        opacity: 0;
        transform: translate3d(0, 24px, 0);
    }

    @media (prefers-reduced-motion: reduce) {
        .project-reveal-shell,
        .proj-header {
            opacity: 1;
            transform: none;
            transition: none;
        }
    }
</style>
