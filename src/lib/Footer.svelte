<script>
    import { getI18n } from "./i18n";

    const { t } = getI18n();
    const currentYear = new Date().getFullYear();

    $: links = [
        { label: $t("nav.home"), href: "#home" },
        { label: $t("nav.projects"), href: "#projects" },
        { label: $t("nav.about"), href: "#about" },
        { label: $t("nav.contact"), href: "#contact" },
    ];
</script>

<footer class="portfolio-footer">
    <div class="page-width footer-inner">
        <div class="footer-links">
            <a
                class="footer-name"
                href="#home"
                on:click|preventDefault={() => window.scrollTo(0, 0)}
            >{$t("hero.title")}</a>

            <nav aria-label={$t("footer.navigation")}>
                {#each links as link, index (link.href)}
                    {#if index}<span aria-hidden="true">/</span>{/if}
                    <a href={link.href}>{link.label}</a>
                {/each}
            </nav>

            <nav aria-label={$t("footer.connect")}>
                <a href="https://www.linkedin.com/in/pablogozalvez/" target="_blank" rel="me noopener noreferrer">LinkedIn</a>
                <span aria-hidden="true">/</span>
                <a href="https://github.com/pablogozalvez" target="_blank" rel="me noopener noreferrer">GitHub</a>
                <span aria-hidden="true">/</span>
                <a href="https://pablogozalvez.itch.io/" target="_blank" rel="me noopener noreferrer">Itch.io</a>
                <span aria-hidden="true">/</span>
                <a href="mailto:pablogozalvezr@gmail.com">{$t("contact.form.email")}</a>
            </nav>
        </div>

        <p class="footer-rights">&copy; {currentYear} {$t("footer.rights")}</p>
    </div>
</footer>

<style>
    .portfolio-footer {
        background: var(--color-paper);
        color: var(--color-heading);
    }

    .footer-inner {
        padding-block: 1.25rem 2.5rem;
        border-top: 1px solid var(--color-rule);
    }

    .footer-links {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.75rem 1.5rem;
    }

    .footer-name {
        font-weight: 700;
    }

    nav {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem 0.625rem;
    }

    a {
        text-decoration: underline;
        text-underline-offset: 0.22em;
    }

    .footer-rights {
        margin-top: 1rem;
        font-size: 0.875rem;
    }

    @media (max-width: 767px) {
        .footer-inner {
            padding-bottom: calc(4.5rem + var(--cv-tab-height) + env(safe-area-inset-bottom));
        }

        .footer-links {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>
