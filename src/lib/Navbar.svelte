<script>
    import { getI18n } from "./i18n";
    import { localizePath } from "./locales";
    import { modal } from "./modal";
    import { IconClose } from "./icons";

    export let activeSection = "home";
    export let currentPath;

    const { t, locale } = getI18n();
    const languages = [
        { code: "es", name: "Español" },
        { code: "en", name: "English" },
    ];

    let scrollY = 0;
    let innerWidth = 0;
    let innerHeight = 0;
    let isMenuOpen = false;

    $: if (innerWidth >= 768 && isMenuOpen) isMenuOpen = false;

    $: sections = [
        { id: "home", label: $t("nav.home") },
        { id: "about", label: $t("nav.about") },
        { id: "projects", label: $t("nav.projects") },
        { id: "contact", label: $t("nav.contact") },
    ];

    let lastScrollCheck = 0;
    $: if (typeof document !== "undefined" && innerHeight && scrollY >= 0) {
        const now = Date.now();
        if (now - lastScrollCheck > 100) {
            lastScrollCheck = now;
            const center = innerHeight / 3;
            for (const section of sections) {
                const el = document.getElementById(section.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < center && rect.bottom > center) {
                        activeSection = section.id;
                        break;
                    }
                }
            }
        }
    }
</script>

<svelte:window bind:scrollY bind:innerWidth bind:innerHeight />

<header class="portfolio-header">
    <div class="page-width header-inner">
        <a href="#home" class="wordmark">{$t("hero.title")}</a>

        <nav class="section-links" aria-label={$t("nav.primary")}>
            {#each sections as section, index (section.id)}
                {#if index}<span class="separator" aria-hidden="true">/</span>{/if}
                <a
                    href={"#" + section.id}
                    aria-current={activeSection === section.id ? "location" : undefined}
                >{section.label}</a>
            {/each}
        </nav>

        <div class="header-controls">
            <nav class="language-links" aria-label={$t("nav.language")}>
                {#each languages as language, index (language.code)}
                    {#if index}<span class="separator" aria-hidden="true">/</span>{/if}
                    <a
                        href={localizePath(currentPath, language.code)}
                        lang={language.code}
                        hreflang={language.code}
                        aria-label={language.name}
                        aria-current={$locale === language.code ? "page" : undefined}
                    >{language.code.toUpperCase()}</a>
                {/each}
            </nav>

            <button
                type="button"
                class="menu-toggle"
                on:click={() => (isMenuOpen = true)}
                aria-label={$t("nav.openMenu")}
                aria-expanded={isMenuOpen}
                aria-controls={isMenuOpen ? "mobile-navigation" : undefined}
            >
                <span aria-hidden="true"></span>
            </button>
        </div>
    </div>

    {#if isMenuOpen}
        <dialog
            id="mobile-navigation"
            class="mobile-menu"
            use:modal
            aria-labelledby="mobile-menu-title"
            on:cancel|preventDefault={() => (isMenuOpen = false)}
        >
            <div class="page-width">
                <div class="mobile-menu-header">
                    <h2 id="mobile-menu-title" data-modal-title tabindex="-1">{$t("nav.menu")}</h2>
                    <button
                        type="button"
                        class="menu-close"
                        aria-label={$t("nav.closeMenu")}
                        on:click={() => (isMenuOpen = false)}
                    >
                        <IconClose class="w-5 h-5" />
                    </button>
                </div>

                <nav class="mobile-links" aria-label={$t("nav.primary")}>
                    {#each sections as section (section.id)}
                        <a
                            href={"#" + section.id}
                            aria-current={activeSection === section.id ? "location" : undefined}
                            on:click={() => (isMenuOpen = false)}
                        >{section.label}</a>
                    {/each}
                </nav>
            </div>
        </dialog>
    {/if}
</header>

<style>
    .portfolio-header {
        position: sticky;
        top: 0;
        z-index: 50;
        border-bottom: 1px solid var(--color-rule);
        background: var(--color-paper);
        color: var(--color-heading);
    }

    .header-inner {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 1.75rem;
        min-height: 3.75rem;
    }

    .wordmark {
        justify-self: start;
        font-weight: 700;
    }

    .section-links,
    .language-links,
    .header-controls {
        display: flex;
        align-items: center;
        gap: 0.6875rem;
    }

    .section-links,
    .language-links {
        font-size: 0.9375rem;
    }

    .header-controls {
        justify-self: end;
    }

    .separator {
        color: var(--color-heading);
    }

    a[aria-current] {
        font-weight: 700;
    }

    a:hover {
        text-decoration: underline;
        text-underline-offset: 0.22em;
    }

    .menu-toggle,
    .menu-close {
        display: grid;
        width: 2.75rem;
        height: 2.75rem;
        place-items: center;
    }

    .menu-toggle {
        display: none;
    }

    .menu-toggle span {
        width: 1.125rem;
        height: 0.5625rem;
        border-block: 1px solid currentColor;
    }

    .mobile-menu {
        position: fixed;
        inset: 0;
        width: 100%;
        max-width: none;
        height: 100dvh;
        max-height: none;
        margin: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        background: var(--color-paper);
        color: var(--color-heading);
    }

    .mobile-menu-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding-block: 0.5rem;
        border-bottom: 1px solid var(--color-rule);
    }

    .mobile-menu-header h2 {
        font-weight: 700;
    }

    .mobile-links {
        display: flex;
        flex-direction: column;
        align-items: start;
        margin-block: 1.25rem;
        font-size: 1.25rem;
    }

    .mobile-links a {
        display: flex;
        align-items: center;
        min-height: 2.75rem;
    }

    @media (max-width: 767px) {
        .header-inner {
            display: flex;
            justify-content: space-between;
            gap: 0.625rem;
            min-height: 3.25rem;
        }

        .section-links {
            display: none;
        }

        .menu-toggle {
            display: grid;
        }
    }
</style>
