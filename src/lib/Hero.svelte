<script>
    import { getI18n } from "./i18n";

    const { t } = getI18n();
</script>

<section id="home" class="portfolio-hero">
    <div class="page-width">
        <div class="identity">
            <h1>{$t("hero.title")}</h1>
            <span class="location">{$t("hero.location")}</span>
        </div>

        <p class="role">{$t("hero.role")}</p>

        <div class="profile-links">
            <a href="mailto:pablogozalvezr@gmail.com">{$t("contact.form.email")}</a>
            <span aria-hidden="true">/</span>
            <a href="https://github.com/pablogozalvez" target="_blank" rel="me noopener noreferrer">GitHub</a>
            <span aria-hidden="true">/</span>
            <a href="https://www.linkedin.com/in/pablogozalvez/" target="_blank" rel="me noopener noreferrer">LinkedIn</a>
        </div>

        <p class="description">{$t("hero.subtitle")}</p>
    </div>
</section>

<style>
    .portfolio-hero {
        padding-block: clamp(2.5rem, 5.2vw, 4.625rem) clamp(2.625rem, 4.4vw, 3.875rem);
        background: var(--color-paper);
        color: var(--color-ink);
    }

    .identity {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 1.375rem;
    }

    h1 {
        font-size: clamp(2.375rem, 5.2vw, 4.375rem);
        font-weight: 700;
        line-height: 1.05;
        letter-spacing: -0.02em;
    }

    .location {
        color: var(--color-heading);
        white-space: nowrap;
    }

    .role {
        margin-top: 0.5625rem;
        font-size: clamp(1.125rem, 2.15vw, 1.5rem);
        line-height: 1.3;
    }

    .profile-links {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.6875rem;
        margin-top: 0.8125rem;
    }

    .profile-links a {
        text-decoration: underline;
        text-underline-offset: 0.22em;
    }

    .profile-links span {
        color: var(--color-heading);
    }

    .description {
        max-width: 38.5rem;
        margin-top: 1.625rem;
        font-size: 1.125rem;
        line-height: 1.5;
    }

    @media (max-width: 767px) {
        .identity {
            flex-direction: column;
            gap: 0.3125rem;
        }

        .role {
            margin-top: 0.4375rem;
        }

        .description {
            margin-top: 1.0625rem;
            font-size: 1.0625rem;
        }
    }
</style>
