<script>
    import { reveal } from "./actions";
    import { animationVisibility } from "./animation-visibility";
    import { getI18n } from "./i18n";
    import { IconArrowRight } from "./icons";
    const { t } = getI18n();
    const currentYear = new Date().getFullYear();

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    $: links = [
        { name: $t("nav.home"), href: "#home" },
        { name: $t("nav.projects"), href: "#projects" },
        { name: $t("nav.about"), href: "#about" },
        { name: $t("nav.contact"), href: "#contact" },
    ];
</script>

<footer use:animationVisibility class="relative bg-[#040406] pt-12 md:pt-14 pb-8 overflow-hidden">
    <!-- Section top accent divider -->
    <div
        class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
    ></div>

    <div
        class="absolute inset-0 bg-[url('/img/noise-transparent.webp')] opacity-[0.03] mix-blend-overlay pointer-events-none"
    ></div>


    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10 md:mb-12">
            <div class="lg:col-span-2 space-y-2.5 footer-item" style="--footer-delay: 0ms" use:reveal>
                <a href="#home" class="inline-block" on:click|preventDefault={scrollToTop}>
                    <p class="text-2xl font-black text-white tracking-tighter">
                        PABLO<span class="text-gray-500">GOZÁLVEZ</span>
                    </p>
                </a>
                <p class="text-gray-400 max-w-sm text-sm leading-relaxed">
                    {$t("footer.description")}
                </p>
                <p class="text-gray-400 max-w-sm text-sm leading-relaxed">
                    {$t("footer.tagline")}
                </p>
            </div>

            <div class="footer-item" style="--footer-delay: 120ms" use:reveal>
                <h3 class="text-xs font-mono font-semibold text-gray-500 uppercase tracking-wider mb-3.5">
                    {$t("footer.navigation")}
                </h3>
                <ul class="space-y-2">
                    {#each links as link}
                        <li>
                            <a
                                href={link.href}
                                class="footer-link text-sm text-gray-400 hover:text-white transition-all duration-200 inline-block"
                            >
                                {link.name}
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>

            <div class="footer-item" style="--footer-delay: 240ms" use:reveal>
                <h3 class="text-xs font-mono font-semibold text-gray-500 uppercase tracking-wider mb-3.5">
                    {$t("footer.connect")}
                </h3>
                <ul class="space-y-2">
                    <li>
                        <a
                            href="https://www.linkedin.com/in/pablogozalvez/"
                            target="_blank"
                            rel="me noopener noreferrer"
                            class="footer-link text-sm text-gray-400 hover:text-white transition-all duration-200 inline-flex items-center gap-1.5 group"
                        >
                            <span>LinkedIn</span>
                            <IconArrowRight class="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://github.com/pablogozalvez"
                            target="_blank"
                            rel="me noopener noreferrer"
                            class="footer-link text-sm text-gray-400 hover:text-white transition-all duration-200 inline-flex items-center gap-1.5 group"
                        >
                            <span>GitHub</span>
                            <IconArrowRight class="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://pablogozalvez.itch.io/"
                            target="_blank"
                            rel="me noopener noreferrer"
                            class="footer-link text-sm text-gray-400 hover:text-white transition-all duration-200 inline-flex items-center gap-1.5 group"
                        >
                            <span>Itch.io</span>
                            <IconArrowRight class="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
                        </a>
                    </li>
                    <li>
                        <a
                            href="mailto:pablogozalvezr@gmail.com"
                            class="footer-link text-sm text-gray-400 hover:text-white transition-all duration-200 inline-block"
                        >
                            {$t("contact.form.email")}
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div
            class="border-t border-white/5 pt-5 flex justify-center md:justify-start items-center footer-item"
            style="--footer-delay: 360ms"
            use:reveal
        >
            <span class="text-xs text-gray-400 font-mono">
                &copy; {currentYear}
                {$t("footer.rights")}
            </span>
        </div>
    </div>
</footer>

<style>
    .footer-item {
        opacity: 1;
    }
    .footer-item:global([data-revealed]) {
        animation: footerReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: var(--footer-delay, 0ms);
    }

    .footer-link {
        position: relative;
    }
    .footer-link::after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 0;
        height: 1px;
        background: linear-gradient(90deg, rgba(99, 102, 241, 0.6), transparent);
        transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .footer-link:hover::after {
        width: 100%;
    }
    .footer-link:hover {
        transform: translateX(4px);
    }

    @keyframes footerReveal {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
