<script>
    import { reveal, rafThrottle } from "./actions";
    import { onMount } from "svelte";
    import { getI18n } from "./i18n";

    export let turnstileSiteKey = "";

    let containerRef;
    let copied = false;
    let currentTime = "";

    const { t, locale } = getI18n();

    let formState = "idle";
    let formData = { name: "", email: "", message: "" };
    let honeypot = "";
    let formError = "";
    let turnstileElement;
    let turnstileToken = "";
    let turnstileWidgetId;

    const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";

    function loadTurnstile() {
        if (window.turnstile) return Promise.resolve(window.turnstile);

        return new Promise((resolve, reject) => {
            const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);
            const handleLoad = () =>
                window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile no está disponible."));

            if (existingScript) {
                existingScript.addEventListener("load", handleLoad, { once: true });
                existingScript.addEventListener("error", reject, { once: true });
                return;
            }

            const script = document.createElement("script");
            script.id = TURNSTILE_SCRIPT_ID;
            script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
            script.async = true;
            script.defer = true;
            script.addEventListener("load", handleLoad, { once: true });
            script.addEventListener("error", reject, { once: true });
            document.head.appendChild(script);
        });
    }

    function resetTurnstile() {
        turnstileToken = "";
        if (window.turnstile && turnstileWidgetId !== undefined) {
            window.turnstile.reset(turnstileWidgetId);
        }
    }

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
        if (formState === "sending" || formState === "success") return;

        if (!turnstileToken) {
            formError = "verification";
            formState = "error";
            return;
        }

        formState = "sending";
        formError = "";

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    website: honeypot,
                    locale: $locale,
                    turnstileToken,
                }),
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                formError = ["invalid", "verification"].includes(result.error) ? result.error : "unavailable";
                formState = "error";
                resetTurnstile();
                return;
            }

            formState = "success";
            formData = { name: "", email: "", message: "" };
            honeypot = "";
            resetTurnstile();
            setTimeout(() => (formState = "idle"), 3000);
        } catch {
            formError = "unavailable";
            formState = "error";
            resetTurnstile();
        }
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
        let isMounted = true;

        if (turnstileSiteKey) {
            loadTurnstile()
                .then((turnstile) => {
                    if (!isMounted || !turnstileElement) return;

                    turnstileWidgetId = turnstile.render(turnstileElement, {
                        sitekey: turnstileSiteKey,
                        action: "contact",
                        language: $locale,
                        theme: "dark",
                        size: "flexible",
                        callback: (token) => {
                            turnstileToken = token;
                            if (formError === "verification") {
                                formError = "";
                                formState = "idle";
                            }
                        },
                        "expired-callback": () => {
                            turnstileToken = "";
                        },
                        "error-callback": () => {
                            turnstileToken = "";
                            formError = "verificationUnavailable";
                            formState = "error";
                        },
                    });
                })
                .catch(() => {
                    if (!isMounted) return;
                    formError = "verificationUnavailable";
                    formState = "error";
                });
        } else {
            formError = "verificationUnavailable";
            formState = "error";
        }

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
        return () => {
            isMounted = false;
            clearInterval(interval);
            if (window.turnstile && turnstileWidgetId !== undefined) {
                window.turnstile.remove(turnstileWidgetId);
            }
        };
    });
</script>

<section
    id="contact"
    class="py-32 relative flex items-center justify-center overflow-hidden bg-[#060608] -mt-px"
>
    <!-- Section top accent divider -->
    <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent"></div>
    <!-- Horizontal line pattern -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none contact-lines"></div>
    <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style="background-image: url('/img/noise-transparent.webp');"
    ></div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        <!-- Section Header — outside the card, consistent with About & Projects -->
        <div class="mb-16 md:mb-20" use:reveal>
            <div class="flex items-center gap-3 mb-4">
                <span class="text-[11px] font-mono font-semibold text-gray-500 uppercase tracking-widest">03 —</span>
                <div class="h-px w-12 bg-gradient-to-r from-white/20 to-transparent"></div>
            </div>
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 class="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        {$t("contact.title")}
                    </h2>
                    <p class="text-lg text-gray-400 max-w-xl font-light leading-relaxed">
                        {$t("contact.subtitle")}
                    </p>
                </div>
                <div
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono shrink-0 self-start md:self-auto"
                >
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {$t("contact.openForOpportunities")}
                </div>
            </div>
        </div>

        <!-- Contact Card -->
        <div
            bind:this={containerRef}
            on:mousemove={handleMouseMove}
            role="region"
            aria-label="Contact card"
            class="contact-card group relative w-full bg-[#0F1115] border border-white/5 rounded-[2rem] overflow-hidden"
            use:reveal
        >
            <!-- Mouse follow glow -->
            <div
                class="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                style="background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%);"
            ></div>
            <div class="absolute inset-0 pointer-events-none z-0"></div>

            <div class="relative z-10 grid lg:grid-cols-5 gap-0">

                <!-- Left Panel: Direct Contact Info -->
                <div class="lg:col-span-2 p-8 md:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between bg-black/20">
                    <div class="flex flex-col gap-8">
                        <!-- Left panel intro text -->
                        <p class="text-base text-gray-400 leading-relaxed font-light">
                            {$t("contact.cardIntro")}
                        </p>
                        <!-- Email block -->
                        <div>
                            <span class="block text-xs font-mono text-gray-500 mb-3 uppercase tracking-wider"
                                >{$t("contact.directAccess")}</span
                            >
                            <div
                                class="flex items-center bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors hover:border-indigo-500/50 group/email"
                            >
                                <div class="pl-3 pr-2 font-mono text-gray-300 text-xs sm:text-sm truncate flex-1 select-all">
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
                                            ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg
                                        >
                                    {:else}
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg
                                        >
                                    {/if}
                                </button>
                            </div>
                        </div>

                        <!-- Socials block -->
                        <div>
                            <span class="block text-xs font-mono text-gray-500 mb-3 uppercase tracking-wider"
                                >{$t("footer.connect")}</span
                            >
                            <div class="flex gap-3">
                                {#each socials as social}
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="me noopener noreferrer"
                                        aria-label={social.label}
                                        class="social-icon p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                                    >
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                                            ><path d={social.icon} /></svg
                                        >
                                    </a>
                                {/each}
                            </div>
                        </div>
                    </div>

                    <!-- Location & time -->
                    <div class="flex items-center gap-4 text-xs text-gray-600 font-mono mt-10 lg:mt-12">
                        <span>{currentTime} (CET)</span>
                        <div class="w-1 h-1 bg-gray-700 rounded-full"></div>
                        <span>{$t("contact.location")}</span>
                    </div>
                </div>

                <!-- Right Panel: Contact Form -->
                <div class="lg:col-span-3 p-8 md:p-10 lg:p-12 relative">
                    <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-5 relative z-10">
                        <!-- Name & Email row -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div class="contact-field group/field">
                                <label for="name" class="contact-label">
                                    <svg class="w-3.5 h-3.5 text-gray-500 group-focus-within/field:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    {$t("contact.form.name")}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    bind:value={formData.name}
                                    placeholder={$t("contact.form.namePlaceholder")}
                                    autocomplete="name"
                                    maxlength="100"
                                    required
                                    class="contact-input"
                                />
                            </div>
                            <div class="contact-field group/field">
                                <label for="email" class="contact-label">
                                    <svg class="w-3.5 h-3.5 text-gray-500 group-focus-within/field:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    {$t("contact.form.email")}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    bind:value={formData.email}
                                    placeholder={$t("contact.form.emailPlaceholder")}
                                    autocomplete="email"
                                    maxlength="254"
                                    required
                                    class="contact-input"
                                />
                            </div>
                        </div>

                        <!-- Message -->
                        <div class="contact-field group/field">
                            <label for="message" class="contact-label">
                                <svg class="w-3.5 h-3.5 text-gray-500 group-focus-within/field:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                {$t("contact.form.message")}
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                bind:value={formData.message}
                                placeholder={$t("contact.form.messagePlaceholder")}
                                minlength="10"
                                maxlength="3000"
                                required
                                class="contact-input resize-y min-h-[130px] max-h-[300px]"
                            ></textarea>
                        </div>

                        <!-- Honeypot -->
                        <div class="contact-honeypot" aria-hidden="true">
                            <label for="website">Website</label>
                            <input
                                id="website"
                                name="website"
                                type="text"
                                bind:value={honeypot}
                                tabindex="-1"
                                autocomplete="off"
                            />
                        </div>

                        <!-- Turnstile -->
                        <div
                            class="min-h-[65px] w-full"
                            data-native-cursor
                            bind:this={turnstileElement}
                        ></div>

                        <!-- Divider + Submit -->
                        <div class="relative pt-4">
                            <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <button
                                    type="submit"
                                    disabled={formState === "sending" || formState === "success"}
                                    class="contact-submit group/btn"
                                >
                                    {#if formState === "success"}
                                        <span>{$t("contact.form.sent")}</span>
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg
                                        >
                                    {:else if formState === "sending"}
                                        <span>{$t("contact.form.sending")}</span>
                                        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            ><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle
                                            ><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg
                                        >
                                    {:else}
                                        <span>{$t("contact.form.send")}</span>
                                        <svg class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg
                                        >
                                    {/if}
                                </button>
                                {#if formState === "error"}
                                    <p class="text-sm text-red-300" role="alert">
                                        {$t(`contact.form.errors.${formError}`)}
                                    </p>
                                {:else if formState === "success"}
                                    <p class="text-sm text-emerald-300" role="status">
                                        {$t("contact.form.confirmationSent")}
                                    </p>
                                {/if}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .contact-lines {
        background-image: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.3) 0px,
            rgba(255, 255, 255, 0.3) 1px,
            transparent 1px,
            transparent 28px
        );
    }

    .contact-honeypot {
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }

    .contact-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .contact-label {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.7rem;
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
        color: rgb(107 114 128);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-left: 0.125rem;
    }

    .contact-input {
        width: 100%;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-left: 2px solid transparent;
        border-radius: 0.75rem;
        padding: 0.8rem 1rem;
        color: white;
        font-size: 0.9rem;
        transition: all 0.25s ease;
    }
    .contact-input::placeholder {
        color: rgb(75 85 99);
    }
    .contact-input:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.12);
        border-left-color: rgb(99 102 241);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
    }

    .contact-submit {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.85rem 2rem;
        min-width: 160px;
        background: linear-gradient(135deg, rgb(79 70 229), rgb(124 58 237));
        border-radius: 0.75rem;
        color: white;
        font-weight: 500;
        font-size: 0.9rem;
        cursor: pointer;
        border: none;
        transition: all 0.3s ease;
        position: relative;
    }
    .contact-submit:hover:not(:disabled) {
        box-shadow: 0 0 24px rgba(99, 102, 241, 0.3), 0 8px 24px rgba(0, 0, 0, 0.3);
        transform: translateY(-1px);
    }
    .contact-submit:active:not(:disabled) {
        transform: scale(0.98) translateY(0);
    }
    .contact-submit:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .contact-card {
        --mouse-x: 0px;
        --mouse-y: 0px;
        opacity: 0;
        transition:
            border-color 0.3s,
            box-shadow 0.5s ease;
    }

    .contact-card:global([data-revealed]) {
        animation: contactReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    .contact-card:hover {
        box-shadow:
            0 0 60px rgba(99, 102, 241, 0.06),
            0 25px 80px rgba(0, 0, 0, 0.3);
    }

    .social-icon {
        transition:
            transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            background-color 0.3s,
            border-color 0.3s,
            color 0.3s,
            box-shadow 0.3s;
    }
    .social-icon:hover {
        transform: translateY(-3px) scale(1.08);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        border-color: rgba(255, 255, 255, 0.15);
    }

    @keyframes contactReveal {
        from {
            opacity: 0;
            transform: translateY(40px) scale(0.98);
            filter: blur(4px);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
        }
    }
</style>
