<script>
    import { getI18n } from "./i18n";
    import PdfViewer from "./PdfViewer.svelte";

    const { t } = getI18n();
    let showPdfModal = false;

    $: skills = [
        {
            category: $t("about.skills.backend"),
            items: [
                "Java",
                "Spring Framework",
                "Spring Boot",
                "Node.js",
                "PHP",
                "Laravel",
                "REST",
                "SOAP",
            ],
        },
        {
            category: $t("about.skills.frontend"),
            items: [
                "JavaScript",
                "TypeScript",
                "Angular",
                "React",
                "Ionic",
                "SvelteKit",
                "HTML",
                "CSS",
                "JSP",
            ],
        },
        {
            category: $t("about.skills.dataTools"),
            items: [
                "IBM Db2",
                "PostgreSQL",
                "Oracle",
                "MongoDB",
                "Git",
                "Docker",
                "Jenkins",
                "Linux",
            ],
        },
        {
            category: $t("about.skills.gamedev"),
            items: ["C#", "Unity", "Three.js", "WebGL", "Phaser"],
        },
    ];
</script>

<PdfViewer
    bind:showPdfModal
    pdfUrl="/media/pdf/cv.pdf"
    title={$t("about.resume.title")}
    downloadName="cv.pdf"
/>

<section id="about" class="portfolio-about" aria-labelledby="about-title">
    <div class="page-width">
        <h2 id="about-title">{$t("about.title")}</h2>

        <div class="about-layout">
            <div>
                <div class="about-copy">
                    <p>{$t("about.p1")}</p>
                    <p>{$t("about.p2")}</p>
                    <p>{$t("about.trackRecord")}</p>
                </div>

                <div class="about-resume">
                    <a
                        class="resume-link"
                        href="/media/pdf/cv.pdf"
                        aria-describedby="about-resume-description"
                        on:click|preventDefault={() => (showPdfModal = true)}
                    >{$t("about.resume.title")}</a>
                    <p id="about-resume-description">{$t("about.resume.subtitle")}</p>
                </div>
            </div>

            <div class="about-skills">
                <h3>{$t("about.technologies")}</h3>
                <dl>
                    {#each skills as skill (skill.category)}
                        <div class="skill-group">
                            <dt>{skill.category}</dt>
                            <dd>{skill.items.join(", ")}</dd>
                        </div>
                    {/each}
                </dl>
            </div>
        </div>
    </div>
</section>

<style>
    .portfolio-about {
        background: var(--color-paper);
        color: var(--color-ink);
    }

    h2 {
        padding-bottom: 0.375rem;
        margin-bottom: 1.125rem;
        border-bottom: 1px solid var(--color-rule);
        color: var(--color-heading);
        font-size: clamp(1.5rem, 2vw, 1.6875rem);
        font-weight: 700;
        line-height: 1.2;
    }

    .about-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
        gap: clamp(1.5rem, 6vw, 4.5rem);
    }

    .about-copy,
    dd {
        line-height: 1.5;
    }

    .about-copy p + p {
        margin-top: 0.75rem;
    }

    .about-resume {
        margin-top: 1.25rem;
    }

    .resume-link {
        display: inline-flex;
        align-items: center;
        min-height: 2.75rem;
        padding-inline: 0.875rem;
        border: 1px solid var(--color-heading);
        color: var(--color-heading);
        font-weight: 700;
    }

    .resume-link:hover {
        background: var(--color-heading);
        color: var(--color-paper);
    }

    .about-resume p {
        margin-top: 0.375rem;
        color: var(--color-heading);
        font-size: 0.9375rem;
    }

    .about-skills h3 {
        margin-bottom: 0.5rem;
        color: var(--color-heading);
        font-size: 1.125rem;
        font-weight: 700;
    }

    .skill-group {
        padding-block: 0.625rem;
        border-top: 1px solid var(--color-rule);
    }

    dt {
        color: var(--color-heading);
        font-weight: 700;
    }

    dd {
        margin-top: 0.125rem;
    }

    @media (max-width: 767px) {
        .about-layout {
            grid-template-columns: minmax(0, 1fr);
        }
    }
</style>
