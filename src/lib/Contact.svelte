<script>
    import { viewport, rafThrottle } from "./actions";
    import { onMount } from "svelte";
    import { t } from "./i18n";

    let visible = false;
    let containerRef;
    let copied = false;
    let currentTime = "";

    let formState = "idle";
    let formData = { name: "", email: "", message: "" };

    const email = "pablogozalvezr@gmail.com";

    const socials = [
        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/pablogoz%C3%A1lvez/",
            icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
            color: "hover:text-blue-400 hover:border-blue-400/30",
        },
        {
            label: "GitHub",
            href: "https://github.com/pablogozalvez",
            icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
            color: "hover:text-purple-400 hover:border-purple-400/30",
        },
        {
            label: "Itch.io",
            href: "https://pablogozalvez.itch.io/",
            icon: "M3.129 1.338c-1.047 0.622-3.109 2.991-3.129 3.612v1.029c0 1.304 1.219 2.45 2.325 2.45 1.329 0 2.436-1.101 2.436-2.408 0 1.307 1.069 2.408 2.398 2.408s2.364-1.101 2.364-2.408c0 1.307 1.137 2.408 2.466 2.408h0.024c1.329 0 2.466-1.101 2.466-2.408 0 1.307 1.035 2.408 2.364 2.408s2.398-1.101 2.398-2.408c0 1.307 1.107 2.408 2.436 2.408 1.107 0 2.325-1.146 2.325-2.45v-1.029c-0.020-0.621-2.082-2.991-3.129-3.612-3.254-0.114-5.51-0.134-8.871-0.133s-7.945 0.053-8.871 0.133zM9.506 7.815c-0.133 0.23-0.288 0.428-0.467 0.601l-0.001 0.001c-0.502 0.49-1.189 0.794-1.947 0.794-0.001 0-0.002 0-0.003 0-0.759 0-1.447-0.303-1.949-0.795l0 0c-0.182-0.178-0.320-0.368-0.446-0.59l-0.001 0c-0.126 0.222-0.302 0.412-0.485 0.59-0.502 0.491-1.19 0.794-1.949 0.794-0.001 0-0.002 0-0.003 0h0c-0.091 0-0.186-0.025-0.263-0.052-0.107 1.112-0.152 2.175-0.168 2.95l-0 0.004c-0.002 0.394-0.004 0.717-0.006 1.167 0.021 2.334-0.231 7.564 1.029 8.849 1.953 0.455 5.546 0.663 9.151 0.664h0.001c3.605-0.001 7.198-0.209 9.151-0.664 1.26-1.285 1.008-6.516 1.029-8.849-0.002-0.45-0.004-0.773-0.006-1.167l-0-0.004c-0.016-0.775-0.061-1.838-0.168-2.95-0.077 0.026-0.172 0.052-0.263 0.052-0.001 0-0.002 0-0.002 0-0.759 0-1.447-0.303-1.949-0.795l0.001 0c-0.178-0.174-0.331-0.372-0.456-0.589l-0.007-0.013c-0.132 0.23-0.286 0.428-0.463 0.602l-0 0c-0.502 0.491-1.19 0.795-1.949 0.795-0.001 0-0.002 0-0.003 0h0c-0.026 0-0.053-0.001-0.079-0.002h-0.001c-0.026 0.001-0.053 0.002-0.080 0.002-0.001 0-0.002 0-0.003 0-0.759 0-1.447-0.303-1.949-0.795l0.001 0c-0.178-0.174-0.331-0.372-0.456-0.589l-0.007-0.013zM7.502 10.406l-0 0.001h0.001c0.794 0.002 1.498 0 2.372 0.953 0.687-0.072 1.406-0.108 2.125-0.107h0.001c0.719-0.001 1.437 0.035 2.125 0.107 0.873-0.953 1.578-0.952 2.372-0.953h0.001l-0-0.001c0.375 0 1.875 0 2.92 2.935l1.122 4.026c0.832 2.995-0.266 3.069-1.636 3.071-2.031-0.076-3.156-1.551-3.156-3.026-1.124 0.184-2.436 0.276-3.748 0.276h-0.001c-1.312 0-2.624-0.092-3.748-0.276 0 1.475-1.125 2.95-3.156 3.026-1.37-0.003-2.468-0.076-1.636-3.071l1.123-4.026c1.045-2.935 2.545-2.935 2.92-2.935z",
            color: "hover:text-red-400 hover:border-red-400/30",
        },
    ];

    function copyToClipboard() {
        navigator.clipboard.writeText(email);
        copied = true;
        setTimeout(() => (copied = false), 2000);
    }

    const handleSubmit = async () => {
        if (!formData.email || !formData.message) return;
        formState = "sending";
        await new Promise((resolve) => setTimeout(resolve, 1500));
        formState = "success";
        formData = { name: "", email: "", message: "" };
        setTimeout(() => (formState = "idle"), 3000);
    };

    const handleMouseMove = rafThrottle((e) => {
        if (!containerRef) return;
        const rect = containerRef.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        containerRef.style.setProperty("--mouse-x", `${x}px`);
        containerRef.style.setProperty("--mouse-y", `${y}px`);
    });

    onMount(() => {
        const updateTime = () => {
            const now = new Date();
            currentTime = now.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Madrid",
            });
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    });
</script>

<section
    id="contact"
    class="py-32 relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#050505] to-black -mt-px"
    use:viewport
    on:enterViewport={() => (visible = true)}
>
    <div class="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.05]" style="background-size: 30px 30px;"></div>
    <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style="background-image: url('/img/noise-transparent.webp');"
    ></div>
    <div
        class="absolute -top-40 -left-20 w-[600px] h-[600px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none"
    ></div>
    <div
        class="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <div class="max-w-6xl w-full mx-auto px-4 sm:px-6 relative z-10">
        <div
            bind:this={containerRef}
            on:mousemove={handleMouseMove}
            role="region"
            aria-label="Contact card"
            class="contact-card group relative w-full bg-[#0F1115] border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-1000 transform {visible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'}"
        >
            <div
                class="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                style="background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%);"
            ></div>
            <div class="absolute inset-0 pointer-events-none z-0"></div>

            <div class="relative z-10 grid lg:grid-cols-5 gap-0">
                <div
                    class="lg:col-span-2 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between bg-black/20"
                >
                    <div>
                        <div
                            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-8 animate-fade-in-up"
                        >
                            <span class="relative flex h-2 w-2">
                                <span
                                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                                ></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            {$t("contact.openForOpportunities")}
                        </div>

                        <h2 class="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">
                            {@html $t("contact.title")}
                        </h2>

                        <div class="relative group/email mb-8">
                            <span class="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider"
                                >{$t("contact.directAccess")}</span
                            >
                            <div
                                class="flex items-center bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors group-hover/email:border-indigo-500/50"
                            >
                                <div
                                    class="pl-3 pr-2 font-mono text-gray-300 text-xs sm:text-sm truncate flex-1 select-all"
                                >
                                    {email}
                                </div>
                                <button
                                    on:click={copyToClipboard}
                                    class="flex items-center justify-center p-2 rounded-lg {copied
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'} transition-all duration-200"
                                >
                                    {#if copied}
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M5 13l4 4L19 7"
                                            ></path></svg
                                        >
                                    {:else}
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                            ></path></svg
                                        >
                                    {/if}
                                </button>
                            </div>
                        </div>

                        <div class="flex gap-3">
                            {#each socials as social}
                                <a
                                    href={social.href}
                                    target="_blank"
                                    class="p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:scale-105 transition-all text-gray-400 hover:text-white"
                                >
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                                        ><path d={social.icon} /></svg
                                    >
                                </a>
                            {/each}
                        </div>
                    </div>

                    <div class="hidden lg:flex items-center gap-4 text-xs text-gray-600 font-mono mt-12">
                        <span>{currentTime} (CET)</span>
                        <div class="w-1 h-1 bg-gray-700 rounded-full"></div>
                        <span>{$t("contact.location")}</span>
                    </div>
                </div>

                <div class="lg:col-span-3 p-8 md:p-12 relative">
                    <div
                        class="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm transition-all"
                    >
                        <div class="p-4 rounded-full bg-white/5 border border-white/10 mb-4 animate-pulse">
                            <svg
                                class="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                ></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">{$t("contact.form.disabledTitle")}</h3>
                        <p class="text-gray-400 text-sm text-center px-8">
                            {@html $t("contact.form.disabledMessage")}
                        </p>
                    </div>

                    <fieldset disabled class="contents">
                        <form on:submit|preventDefault={handleSubmit} class="space-y-6 relative z-10 opacity-50">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label
                                        for="name"
                                        class="text-xs font-mono text-gray-500 uppercase tracking-wider ml-1"
                                        >{$t("contact.form.name")}</label
                                    >
                                    <input
                                        type="text"
                                        id="name"
                                        bind:value={formData.name}
                                        placeholder={$t("contact.form.namePlaceholder")}
                                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <label
                                        for="email"
                                        class="text-xs font-mono text-gray-500 uppercase tracking-wider ml-1"
                                        >{$t("contact.form.email")}</label
                                    >
                                    <input
                                        type="email"
                                        id="email"
                                        bind:value={formData.email}
                                        placeholder={$t("contact.form.emailPlaceholder")}
                                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all"
                                    />
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label
                                    for="message"
                                    class="text-xs font-mono text-gray-500 uppercase tracking-wider ml-1"
                                    >{$t("contact.form.message")}</label
                                >
                                <textarea
                                    id="message"
                                    rows="4"
                                    bind:value={formData.message}
                                    placeholder={$t("contact.form.messagePlaceholder")}
                                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all resize-y min-h-[120px] max-h-[300px]"
                                ></textarea>
                            </div>

                            <div class="pt-2">
                                <button
                                    type="submit"
                                    disabled={formState !== "idle"}
                                    class="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-medium hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                                >
                                    {#if formState === "idle"}
                                        <span>{$t("contact.form.send")}</span>
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            ></path></svg
                                        >
                                    {:else if formState === "sending"}
                                        <svg
                                            class="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            ><circle
                                                class="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                stroke-width="4"
                                            ></circle><path
                                                class="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path></svg
                                        >
                                    {:else}
                                        <span class="text-white">{$t("contact.form.sent")}</span>
                                        <svg
                                            class="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M5 13l4 4L19 7"
                                            ></path></svg
                                        >
                                    {/if}
                                </button>
                            </div>
                        </form>
                    </fieldset>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .contact-card {
        --mouse-x: 0px;
        --mouse-y: 0px;
    }
</style>
