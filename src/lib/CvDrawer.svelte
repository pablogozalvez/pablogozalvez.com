<script>
    import { getI18n } from "./i18n";
    import { IconClose } from "./icons";
    import { modal } from "./modal";

    const { t } = getI18n();
    const jobs = [
        { id: "accenture", company: "Accenture", expanded: true },
        { id: "university", company: "Universidad de Alicante", expanded: false },
    ];

    let isOpen = $state(false);

    function openCv(event) {
        event.currentTarget.focus({ preventScroll: true });
        isOpen = true;
    }

    function closeCv() {
        isOpen = false;
    }

    function cancelCv(event) {
        event.preventDefault();
        closeCv();
    }

    function closeOnBackdrop(event) {
        if (event.target !== event.currentTarget) return;

        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) {
            closeCv();
        }
    }
</script>

<div class="cv-tab">
    <button
        type="button"
        class="cv-trigger"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "cv-drawer" : undefined}
        onclick={openCv}
    >{$t("cv.title")}</button>
</div>

{#if isOpen}
    <dialog
        id="cv-drawer"
        class="cv-drawer"
        aria-labelledby="cv-drawer-title"
        use:modal
        oncancel={cancelCv}
        onclick={closeOnBackdrop}
    >
        <header class="cv-header">
            <h2 id="cv-drawer-title" data-modal-title tabindex="-1">{$t("cv.title")}</h2>
            <button type="button" class="cv-close" onclick={closeCv}>
                {$t("cv.close")}
                <IconClose class="w-4 h-4" />
            </button>
        </header>

        <div class="cv-body">
            <div class="cv-identity">
                <div>
                    <h3>{$t("hero.title")}</h3>
                    <p class="cv-role">{$t("hero.role")}</p>
                </div>
                <p>{$t("hero.location")}</p>
            </div>

            <div class="cv-links">
                <a href="mailto:pablogozalvezr@gmail.com">{$t("contact.form.email")}</a>
                <span aria-hidden="true">/</span>
                <a href="https://github.com/pablogozalvez" target="_blank" rel="me noopener noreferrer">GitHub</a>
                <span aria-hidden="true">/</span>
                <a href="https://www.linkedin.com/in/pablogozalvez/" target="_blank" rel="me noopener noreferrer">LinkedIn</a>
                <a class="cv-download" href="/media/pdf/cv.pdf" download="pablo-gozalvez-cv.pdf">{$t("cv.download")}</a>
            </div>

            <section class="cv-section" aria-labelledby="cv-experience-title">
                <h3 id="cv-experience-title">{$t("cv.experience.title")}</h3>
                {#each jobs as job (job.id)}
                    {@const key = "cv.experience." + job.id}
                    <article class="cv-job">
                        <h4>{job.company} <span aria-hidden="true">|</span> {$t(key + ".role")}</h4>
                        <p class="cv-job-meta">{$t(key + ".dates")} | {$t(key + ".location")}</p>
                        <details open={job.expanded}>
                            <summary>
                                <span class="when-closed">{$t("cv.showDetails")}</span>
                                <span class="when-open">{$t("cv.hideDetails")}</span>
                            </summary>
                            <ul>
                                {#each $t(key + ".details") as detail}
                                    <li>{detail}</li>
                                {/each}
                            </ul>
                        </details>
                    </article>
                {/each}
            </section>
        </div>
    </dialog>
{/if}

<style>
    .cv-tab {
        position: fixed;
        inset-inline-end: 0;
        top: 43%;
        z-index: 45;
        display: flex;
    }

    .cv-trigger {
        min-height: var(--cv-tab-height);
        padding-inline: 1.0625rem;
        background: var(--color-heading);
        color: var(--color-paper);
        font-size: 0.875rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        text-transform: uppercase;
    }

    .cv-trigger:hover {
        background: var(--color-ink);
    }

    .cv-drawer {
        --cv-gutter: clamp(1.3125rem, 5vw, 3rem);
        position: fixed;
        inset: 0 0 0 auto;
        width: min(53.75rem, 100%);
        max-width: none;
        height: 100dvh;
        max-height: none;
        margin: 0;
        padding: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        background: var(--color-paper);
        color: var(--color-ink);
    }

    .cv-drawer::backdrop {
        background: #1f29373b;
    }

    .cv-header {
        position: sticky;
        top: 0;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        min-height: 3.5rem;
        padding-inline: var(--cv-gutter);
        border-bottom: 1px solid var(--color-rule);
        background: var(--color-paper);
        color: var(--color-heading);
    }

    .cv-header h2 {
        font-weight: 700;
    }

    .cv-close {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        min-height: 2.75rem;
    }

    .cv-close:hover {
        text-decoration: underline;
    }

    .cv-body {
        padding: 2rem var(--cv-gutter) 3.25rem;
    }

    .cv-identity {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
    }

    .cv-identity h3 {
        font-size: clamp(1.875rem, 4.7vw, 2.4375rem);
        font-weight: 700;
        line-height: 1.1;
    }

    .cv-role {
        margin-top: 0.375rem;
        font-size: clamp(1.125rem, 2.6vw, 1.375rem);
    }

    .cv-links {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 0.25rem 0.625rem;
        margin-top: 0.5625rem;
    }

    .cv-links a,
    summary span {
        text-decoration: underline;
        text-underline-offset: 0.22em;
    }

    .cv-download {
        margin-inline-start: auto;
        font-weight: 700;
    }

    .cv-section {
        margin-top: 1.75rem;
    }

    .cv-section h3 {
        padding-bottom: 0.25rem;
        margin-bottom: 0.5625rem;
        border-bottom: 1px solid var(--color-rule);
        color: var(--color-heading);
        font-size: 1.3125rem;
        font-weight: 700;
    }

    .cv-job + .cv-job {
        margin-top: 0.875rem;
    }

    .cv-job h4 {
        font-weight: 700;
    }

    .cv-job-meta {
        margin-top: 0.1875rem;
        color: var(--color-heading);
        font-size: 0.9375rem;
    }

    .cv-job details {
        margin-top: 0.3125rem;
    }

    .cv-job summary {
        width: fit-content;
        color: var(--color-heading);
    }

    .cv-job ul {
        margin-top: 0.375rem;
        padding-inline-start: 1.375rem;
        list-style: square;
    }

    .cv-job li + li {
        margin-top: 0.1875rem;
    }

    details[open] .when-closed,
    details:not([open]) .when-open {
        display: none;
    }

    @media (prefers-reduced-motion: no-preference) {
        .cv-drawer[open] {
            animation: cv-enter 280ms ease-out;
        }
    }

    @keyframes cv-enter {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    @media (max-width: 767px) {
        .cv-tab {
            inset: auto 0 0;
            justify-content: flex-end;
            border-top: 1px solid var(--color-rule);
            background: var(--color-paper);
        }

        .cv-trigger {
            padding-inline-end: calc(1.0625rem + env(safe-area-inset-right));
            min-height: calc(var(--cv-tab-height) + env(safe-area-inset-bottom));
            padding-bottom: env(safe-area-inset-bottom);
        }

        .cv-body {
            padding-top: 1.625rem;
        }

        .cv-identity {
            display: block;
        }

        .cv-identity > p {
            margin-top: 0.25rem;
        }

        .cv-download {
            margin-inline-start: 0;
        }
    }
</style>
