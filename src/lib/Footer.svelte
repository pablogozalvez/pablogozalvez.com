<script>
    import { reveal } from "./actions";
    import { t } from "./i18n";
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

<footer class="relative bg-[#050505] pt-20 pb-10 overflow-hidden">
    <div
        class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
    ></div>

    <div
        class="absolute inset-0 bg-[url('/img/noise-transparent.webp')] opacity-[0.03] mix-blend-overlay pointer-events-none"
    ></div>
    <div class="absolute inset-0 pointer-events-none"></div>

    <div
        class="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-900/20 blur-[100px] rounded-full pointer-events-none"
    ></div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div class="lg:col-span-2 space-y-4 footer-item" style="--footer-delay: 0ms" use:reveal>
                <a href="#home" class="inline-block" on:click|preventDefault={scrollToTop}>
                    <h2 class="text-2xl font-black text-white tracking-tighter">
                        PABLO<span class="text-gray-500">GOZÁLVEZ</span>
                    </h2>
                </a>
                <p class="text-gray-400 max-w-sm text-sm leading-relaxed">
                    {$t("footer.description")}
                </p>
            </div>

            <div class="footer-item" style="--footer-delay: 120ms" use:reveal>
                <h3 class="text-xs font-mono font-semibold text-gray-500 uppercase tracking-wider mb-6">
                    {$t("footer.navigation")}
                </h3>
                <ul class="space-y-3">
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
                <h3 class="text-xs font-mono font-semibold text-gray-500 uppercase tracking-wider mb-6">
                    {$t("footer.connect")}
                </h3>
                <ul class="space-y-3">
                    <li>
                        <a
                            href="https://linkedin.com/in/pablogozálvez/"
                            target="_blank"
                            class="text-sm text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group"
                        >
                            LinkedIn
                            <svg
                                class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1 group-hover:translate-x-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                ></path></svg
                            >
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://github.com/pablogozalvez"
                            target="_blank"
                            class="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                        >
                            GitHub
                            <svg
                                class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1 group-hover:translate-x-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                ></path></svg
                            >
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://pablogozalvez.itch.io/"
                            target="_blank"
                            class="text-sm text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group"
                        >
                            Itch.io
                            <svg
                                class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1 group-hover:translate-x-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                ></path></svg
                            >
                        </a>
                    </li>
                    <li>
                        <a
                            href="mailto:pablogozalvezr@gmail.com"
                            class="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Email
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div
            class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 footer-item"
            style="--footer-delay: 360ms"
            use:reveal
        >
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                    <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span class="text-[10px] font-mono text-gray-400 uppercase tracking-wider"
                        >{$t("footer.allSystemsOperational")}</span
                    >
                </div>
            </div>

            <div class="flex flex-col md:flex-row items-center gap-6">
                <span class="text-xs text-gray-600 font-mono">
                    &copy; {currentYear}
                    {$t("footer.rights")}
                </span>
            </div>
        </div>
    </div>
</footer>

<style>
    .footer-item {
        opacity: 0;
    }
    .footer-item:global([data-revealed]) {
        animation: footerReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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
