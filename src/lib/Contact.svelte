<script>
    import { onMount } from "svelte";
    import { getI18n } from "./i18n";
    import { fetchJson } from "./fetch-json";
    import { IconCheck, IconCopy, IconSpinner } from "./icons";

    export let turnstileSiteKey = "";

    let copied = false;
    let copyError = false;
    let copyTimer;
    let successTimer;
    let isMounted = false;
    const lifetime = new AbortController();

    const { t, locale } = getI18n();

    let formState = "idle";
    let formData = { name: "", email: "", message: "" };
    let honeypot = "";
    let formError = "";
    let turnstileElement;
    let turnstileToken = "";
    let turnstileWidgetId;

    const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";

    function loadTurnstile(signal) {
        if (window.turnstile) return Promise.resolve(window.turnstile);

        return new Promise((resolve, reject) => {
            const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);
            const script = existingScript || document.createElement("script");
            const cleanup = () => {
                clearTimeout(timer);
                script.removeEventListener("load", handleLoad);
                script.removeEventListener("error", handleError);
                signal.removeEventListener("abort", handleAbort);
            };
            const handleLoad = () => {
                cleanup();
                window.turnstile
                    ? resolve(window.turnstile)
                    : reject(new Error("Turnstile no está disponible."));
            };
            const handleError = () => {
                cleanup();
                reject(new Error("Turnstile no está disponible."));
            };
            const handleAbort = () => {
                cleanup();
                reject(signal.reason);
            };
            const timer = setTimeout(handleError, 15000);
            script.addEventListener("load", handleLoad);
            script.addEventListener("error", handleError);
            signal.addEventListener("abort", handleAbort, { once: true });
            if (signal.aborted) {
                handleAbort();
                return;
            }
            if (existingScript) return;
            script.id = TURNSTILE_SCRIPT_ID;
            script.src =
                "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
            script.async = true;
            script.defer = true;
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
        },
        {
            label: "GitHub",
            href: "https://github.com/pablogozalvez",
        },
        {
            label: "Itch.io",
            href: "https://pablogozalvez.itch.io/",
        },
    ];

    async function copyToClipboard() {
        clearTimeout(copyTimer);
        copyError = false;
        try {
            await navigator.clipboard.writeText(email);
            if (!isMounted) return;
            copied = true;
            copyTimer = setTimeout(() => (copied = false), 2000);
        } catch {
            if (isMounted) copyError = true;
        }
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
            const { ok, data: result } = await fetchJson("/api/contact", {
                timeoutMs: 20000,
                signal: lifetime.signal,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    website: honeypot,
                    locale: $locale,
                    turnstileToken,
                }),
            });
            if (!isMounted) return;

            if (!ok || result?.success !== true) {
                formError = ["invalid", "verification"].includes(result?.error)
                    ? result.error
                    : "unavailable";
                formState = "error";
                resetTurnstile();
                return;
            }

            formState = "success";
            formData = { name: "", email: "", message: "" };
            honeypot = "";
            resetTurnstile();
            successTimer = setTimeout(() => (formState = "idle"), 3000);
        } catch (error) {
            if (!isMounted || lifetime.signal.aborted) return;
            formError =
                error.name === "TimeoutError" ? "timeout" : "unavailable";
            formState = "error";
            resetTurnstile();
        }
    };

    onMount(() => {
        isMounted = true;

        if (turnstileSiteKey) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (!entry.isIntersecting) return;
                    observer.disconnect();
                    loadTurnstile(lifetime.signal)
                        .then((turnstile) => {
                            if (!isMounted || !turnstileElement) return;

                            turnstileWidgetId = turnstile.render(
                                turnstileElement,
                                {
                                    sitekey: turnstileSiteKey,
                                    action: "contact",
                                    language: $locale,
                                    theme: "light",
                                    size: turnstileElement.clientWidth < 300 ? "compact" : "flexible",
                                    callback: (token) => {
                                        if (!isMounted) return;
                                        turnstileToken = token;
                                        if (formError === "verification") {
                                            formError = "";
                                            formState = "idle";
                                        }
                                    },
                                    "expired-callback": () => {
                                        if (!isMounted) return;
                                        turnstileToken = "";
                                    },
                                    "error-callback": () => {
                                        if (!isMounted) return;
                                        turnstileToken = "";
                                        formError = "verificationUnavailable";
                                        formState = "error";
                                    },
                                },
                            );
                        })
                        .catch(() => {
                            if (!isMounted) return;
                            formError = "verificationUnavailable";
                            formState = "error";
                        });
                },
                { rootMargin: "400px" },
            );
            observer.observe(turnstileElement);
            lifetime.signal.addEventListener(
                "abort",
                () => observer.disconnect(),
                { once: true },
            );
        } else {
            formError = "verificationUnavailable";
            formState = "error";
        }

        return () => {
            isMounted = false;
            lifetime.abort();
            clearTimeout(copyTimer);
            clearTimeout(successTimer);
            if (window.turnstile && turnstileWidgetId !== undefined) {
                window.turnstile.remove(turnstileWidgetId);
            }
        };
    });
</script>

<section id="contact" class="portfolio-contact" aria-labelledby="contact-title">
    <div class="page-width">
        <h2 id="contact-title">{$t("contact.title")}</h2>

        <div class="contact-layout">
            <div class="contact-info">
                <p>{$t("contact.subtitle")}</p>

                <div class="contact-email">
                    <a href={"mailto:" + email}>{email}</a>
                    <button
                        type="button"
                        class="copy-email"
                        on:click={copyToClipboard}
                        aria-label={copied ? $t("contact.copied") : $t("contact.copyEmail")}
                        title={$t("contact.copyEmail")}
                    >
                        {#if copied}
                            <IconCheck class="w-4 h-4" />
                        {:else}
                            <IconCopy class="w-4 h-4" />
                        {/if}
                    </button>
                </div>

                <p class="copy-status" role="status">
                    {copyError ? $t("contact.copyFailed") : copied ? $t("contact.copied") : ""}
                </p>

                <div class="contact-profiles">
                    {#each socials as social, index (social.href)}
                        {#if index}<span aria-hidden="true">/</span>{/if}
                        <a href={social.href} target="_blank" rel="me noopener noreferrer">{social.label}</a>
                    {/each}
                </div>
            </div>

            <form
                class="contact-form"
                on:submit|preventDefault={handleSubmit}
                aria-busy={formState === "sending"}
            >
                <div class="contact-short-fields">
                    <div class="contact-field">
                        <label for="name">{$t("contact.form.name")}</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            bind:value={formData.name}
                            placeholder={$t("contact.form.namePlaceholder")}
                            autocomplete="name"
                            maxlength="100"
                            required
                        />
                    </div>

                    <div class="contact-field">
                        <label for="email">{$t("contact.form.email")}</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            bind:value={formData.email}
                            placeholder={$t("contact.form.emailPlaceholder")}
                            autocomplete="email"
                            maxlength="254"
                            required
                        />
                    </div>
                </div>

                <div class="contact-field">
                    <label for="message">{$t("contact.form.message")}</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        bind:value={formData.message}
                        placeholder={$t("contact.form.messagePlaceholder")}
                        minlength="10"
                        maxlength="3000"
                        required
                    ></textarea>
                </div>

                <div class="contact-honeypot" aria-hidden="true">
                    <label for="website">{$t("contact.form.website")}</label>
                    <input
                        id="website"
                        name="website"
                        type="text"
                        bind:value={honeypot}
                        tabindex="-1"
                        autocomplete="off"
                    />
                </div>

                <div class="turnstile-slot" bind:this={turnstileElement}></div>

                <button
                    type="submit"
                    class="contact-submit"
                    disabled={formState === "sending" || formState === "success"}
                >
                    {#if formState === "success"}
                        <span>{$t("contact.form.sent")}</span>
                        <IconCheck class="w-4 h-4" />
                    {:else if formState === "sending"}
                        <span>{$t("contact.form.sending")}</span>
                        <IconSpinner class="w-4 h-4" />
                    {:else}
                        <span>{$t("contact.form.send")}</span>
                    {/if}
                </button>

                <div class="form-status">
                    {#if formState === "error"}
                        <p class="form-error" role="alert">{$t(`contact.form.errors.${formError}`)}</p>
                    {:else if formState === "success"}
                        <p role="status">{$t("contact.form.confirmationSent")}</p>
                    {/if}
                </div>
            </form>
        </div>
    </div>
</section>

<style>
    .portfolio-contact {
        padding-block: clamp(3rem, 5vw, 4.5rem);
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

    .contact-layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
        gap: clamp(1.5rem, 6vw, 4.5rem);
    }

    .contact-info > p:first-child {
        max-width: 23rem;
        line-height: 1.5;
    }

    .contact-email,
    .contact-profiles {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.625rem;
    }

    .contact-email {
        margin-top: 0.75rem;
    }

    .contact-email a {
        overflow-wrap: anywhere;
    }

    .contact-info a {
        text-decoration: underline;
        text-underline-offset: 0.22em;
    }

    .copy-email,
    .contact-submit {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.75rem;
        border: 1px solid var(--color-heading);
        color: var(--color-heading);
    }

    .copy-email {
        min-width: 2.75rem;
    }

    .copy-email:hover,
    .contact-submit:not(:disabled):hover {
        background: var(--color-heading);
        color: var(--color-paper);
    }

    .copy-status,
    .form-status {
        min-height: 1.5rem;
        color: var(--color-heading);
        font-size: 0.9375rem;
    }

    .contact-form {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 0.875rem;
    }

    .contact-short-fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.875rem;
    }

    .contact-field {
        display: grid;
        gap: 0.375rem;
    }

    .contact-field label {
        color: var(--color-heading);
        font-weight: 700;
    }

    .contact-field :is(input, textarea) {
        width: 100%;
        min-height: 2.75rem;
        padding: 0.5rem 0.625rem;
        border: 1px solid #64748b;
        background: var(--color-paper);
    }

    .contact-field :is(input, textarea)::placeholder {
        color: #475569;
    }

    .contact-field textarea {
        min-height: 6rem;
        max-height: 15rem;
        resize: vertical;
    }

    .contact-honeypot {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }

    .turnstile-slot {
        min-height: 65px;
    }

    .contact-submit {
        justify-self: start;
        gap: 0.5rem;
        padding-inline: 0.875rem;
        font-weight: 700;
    }

    .contact-submit:disabled {
        opacity: 0.7;
    }

    .form-error {
        color: #991b1b;
    }

    @media (max-width: 767px) {
        .contact-layout {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    @media (max-width: 479px) {
        .contact-short-fields {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    @media (max-width: 341px) {
        .turnstile-slot {
            min-height: 140px;
        }
    }
</style>
