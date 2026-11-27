<script>
    import { getI18n } from "./i18n";
    import PdfViewer from "./PdfViewer.svelte";

    const { t } = getI18n();

    let showPdfModal = false;

    let currentPdfUrl = "";
    let currentPdfTitle = "";
    let currentPdfDownloadName = "";

    function openPdf(event, url, title) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        event.preventDefault();
        currentPdfUrl = url;
        currentPdfTitle = title;
        currentPdfDownloadName = title.replace(/\s+/g, "_") + ".pdf";
        showPdfModal = true;
    }

    $: projects = [
        {
            title: "OutReal",
            description: $t("projects.items.outreal.description"),
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
            tags: [
                "Game Jam",
                $t("projectTags.rapidDevelopment"),
                "Unity",
                "C#",
            ],
            featured: true,
        },
    ];
    $: featuredProjects = projects.filter((project) => project.featured);
    $: otherProjects = projects.filter((project) => !project.featured);
</script>

{#snippet projectGrid(items)}
    <div class="project-grid">
        {#each items as project (project.image)}
            <article class="project">
                <a
                    class="project-link"
                    href={project.pdf || project.link || project.article}
                    target={project.pdf ? undefined : "_blank"}
                    rel={project.pdf ? undefined : "noopener noreferrer"}
                    aria-label={$t(project.pdf ? "projects.openPdf" : "projects.openProject") + ": " + project.title}
                    on:click={(event) => {
                        if (project.pdf) openPdf(event, project.pdf, project.title);
                    }}
                >
                    <img
                        class="project-image"
                        src={project.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="286"
                    />
                    <h3>{project.title}</h3>
                </a>

                <p class="project-tags">{project.tags.join(" · ")}</p>
                <p class="project-description">{project.description}</p>

                {#if project.article}
                    <a
                        class="project-article"
                        href={project.article}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={(project.articleType || $t("projects.moreInfo")) + ": " + project.title}
                    >{project.articleType || $t("projects.moreInfo")}</a>
                {/if}
            </article>
        {/each}
    </div>
{/snippet}

<section id="projects" class="portfolio-projects" aria-labelledby="projects-title">
    <PdfViewer
        bind:showPdfModal
        pdfUrl={currentPdfUrl}
        title={currentPdfTitle}
        downloadName={currentPdfDownloadName}
    />

    <div class="page-width">
        <div class="project-heading">
            <h2 id="projects-title">{$t("projects.title")}</h2>
            <a href="https://github.com/pablogozalvez?tab=repositories" target="_blank" rel="noopener noreferrer">
                {$t("projects.viewArchive")}
            </a>
        </div>

        {@render projectGrid(featuredProjects)}

        <details class="project-archive">
            <summary>
                <span class="when-closed">{$t("projects.showMore")}</span>
                <span class="when-open">{$t("projects.hideMore")}</span>
            </summary>
            {@render projectGrid(otherProjects)}
        </details>
    </div>
</section>

<style>
    .portfolio-projects {
        padding-bottom: clamp(3rem, 5vw, 4.5rem);
        background: var(--color-paper);
        color: var(--color-ink);
    }

    .project-heading {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        column-gap: 1rem;
        padding-bottom: 0.375rem;
        margin-bottom: 1.125rem;
        border-bottom: 1px solid var(--color-rule);
        color: var(--color-heading);
    }

    .project-heading h2 {
        font-size: clamp(1.5rem, 2vw, 1.6875rem);
        font-weight: 700;
        line-height: 1.2;
    }

    .project-heading a,
    .project-article {
        color: var(--color-heading);
        text-decoration: underline;
        text-underline-offset: 0.22em;
    }

    .project-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 2rem 1.625rem;
    }

    .project-link {
        display: block;
    }

    .project-link:hover h3,
    .project-link:focus-visible h3 {
        text-decoration: underline;
        text-underline-offset: 0.22em;
    }

    .project-image {
        display: block;
        width: 100%;
        height: auto;
        aspect-ratio: 2.1;
        border: 1px solid var(--color-rule);
        object-fit: cover;
        content-visibility: visible;
    }

    .project-image[src="/img/outreal.webp"] {
        object-position: center 54%;
    }

    .project h3 {
        margin-top: 0.75rem;
        font-size: 1.3125rem;
        font-weight: 700;
        line-height: 1.2;
    }

    .project-tags {
        margin-top: 0.1875rem;
        color: var(--color-heading);
        font-size: 0.9375rem;
    }

    .project-description {
        margin-top: 0.3125rem;
        line-height: 1.5;
    }

    .project-article {
        display: inline-block;
        margin-top: 0.375rem;
    }

    .project-archive {
        margin-top: 2rem;
        border-top: 1px solid var(--color-rule);
    }

    summary {
        width: fit-content;
        min-height: 2.75rem;
        padding-block: 0.625rem;
        color: var(--color-heading);
        font-weight: 700;
    }

    summary span {
        text-decoration: underline;
        text-underline-offset: 0.22em;
    }

    .project-archive[open] .project-grid {
        margin-top: 0.625rem;
    }

    details[open] .when-closed,
    details:not([open]) .when-open {
        display: none;
    }

    @media (max-width: 767px) {
        .project-grid {
            grid-template-columns: minmax(0, 1fr);
            row-gap: 1.5rem;
        }

        .project-heading a {
            margin-top: 0.25rem;
        }
    }
</style>
