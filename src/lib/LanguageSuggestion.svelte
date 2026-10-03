<script>
    import { onMount, tick } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { getI18n, localizePath } from "./i18n";
    import { modal } from "./modal";
    import { getSuggestedLocale, getLanguageSuggestionCopy, LANGUAGE_SUGGESTION_SESSION_KEY } from "./language-suggestion";

    const { locale } = getI18n();
    let dialog;
    let suggestedLocale = null;
    let closing = false;
    let closeTimer;
    let mounted = false;

    $: copy = suggestedLocale ? getLanguageSuggestionCopy(suggestedLocale) : null;

    onMount(() => {
        mounted = true;
        let dismissed = false;
        try {
            dismissed = Boolean(sessionStorage.getItem(LANGUAGE_SUGGESTION_SESSION_KEY));
        } catch {
            // Sin almacenamiento, el layout conserva la decisión durante esta visita.
        }
        if (!dismissed) {
            suggestedLocale = getSuggestedLocale(navigator.languages?.length ? navigator.languages : [navigator.language], $locale);
        }
        return () => {
            mounted = false;
            window.clearTimeout(closeTimer);
        };
    });

    function rememberDecision() {
        try {
            sessionStorage.setItem(LANGUAGE_SUGGESTION_SESSION_KEY, "1");
        } catch {
            // Cerrar y aceptar siguen disponibles si el navegador bloquea storage.
        }
    }

    function dismiss(destination = null) {
        if (closing || !suggestedLocale) return;
        closing = true;
        rememberDecision();
        const finish = async () => {
            suggestedLocale = null;
            // Restaurar foco y scroll antes de empezar la navegación de idioma.
            await tick();
            if (mounted && destination) await goto(destination);
        };
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
        else closeTimer = window.setTimeout(finish, 140);
    }

    function handleAccept(event) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            rememberDecision();
            return;
        }
        event.preventDefault();
        dismiss(event.currentTarget.href);
    }

    function handleBackdropClick(event) {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) dismiss();
    }
</script>

{#if suggestedLocale}
    <dialog
        bind:this={dialog}
        use:modal
        on:cancel|preventDefault={() => dismiss()}
        on:click={handleBackdropClick}
        lang={suggestedLocale}
        aria-labelledby="language-suggestion-title"
        aria-describedby="language-suggestion-description"
        class="language-suggestion"
        class:is-closing={closing}
    >
        <div class="sheet-content">
            <div class="sheet-handle" aria-hidden="true"></div>
            <div class="flex items-start justify-between gap-3">
                <div class="flex min-w-0 items-center gap-3 pt-2">
                    <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-200" aria-hidden="true">
                        <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6.5h14M5 17.5h14" /></svg>
                    </span>
                    <h2 id="language-suggestion-title" data-modal-title tabindex="-1" class="text-xl font-extrabold sm:text-2xl">{copy.title}</h2>
                </div>
                <button type="button" on:click={() => dismiss()} aria-label={copy.close} class="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-gray-300 hover:bg-white/10 hover:text-white">
                    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
                </button>
            </div>
            <p id="language-suggestion-description" class="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">{copy.description}</p>
            <div class="mt-5 flex flex-wrap justify-end gap-3">
                <button type="button" on:click={() => dismiss()} class="min-h-11 rounded-xl border border-white/20 px-5 py-2 font-bold hover:bg-white/10">{copy.cancel}</button>
                <a
                    href={localizePath(`${$page.url.pathname}${$page.url.search}${$page.url.hash}`, suggestedLocale)}
                    hreflang={suggestedLocale}
                    on:click={handleAccept}
                    class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-blue-600 px-5 py-2 font-bold hover:bg-blue-500"
                >
                    <img src={suggestedLocale === "en" ? "/img/icons/us.png" : "/img/icons/es.png"} alt="" width="20" height="20" class="h-5 w-5 shrink-0 object-contain" />
                    <span>{copy.accept}</span>
                </a>
            </div>
        </div>
    </dialog>
{/if}

<style>
    .language-suggestion {
        position: fixed;
        inset: auto 0 0;
        margin: 0 auto;
        width: min(40rem, calc(100% - 1rem));
        max-width: none;
        max-height: calc(100dvh - 2rem);
        overflow-y: auto;
        overflow-wrap: anywhere;
        padding: 0;
        color: white;
        background: #0f172a;
        border: 1px solid rgb(255 255 255 / 0.16);
        border-bottom: 0;
        border-radius: 1.5rem 1.5rem 0 0;
        box-shadow: 0 -8px 40px rgb(0 0 0 / 0.3);
    }
    .language-suggestion::backdrop { background: rgb(3 7 18 / 0.3); }
    .sheet-content {
        padding: 0.75rem 1.5rem max(1.5rem, env(safe-area-inset-bottom));
    }
    .sheet-handle {
        width: 3rem;
        height: 0.375rem;
        margin: 0 auto 0.5rem;
        border-radius: 9999px;
        background: rgb(255 255 255 / 0.2);
    }
    #language-suggestion-title:focus { outline: none !important; }
    @media (prefers-reduced-motion: no-preference) {
        .language-suggestion[open] { animation: sheet-enter 220ms ease-out; }
        .language-suggestion[open].is-closing { animation: sheet-exit 140ms ease-in forwards; }
        .language-suggestion.is-closing::backdrop { animation: backdrop-exit 140ms ease-in forwards; }
    }
    @keyframes sheet-enter {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
    }
    @keyframes sheet-exit {
        to { transform: translateY(100%); opacity: 0; }
    }
    @keyframes backdrop-exit {
        to { background-color: transparent; }
    }
</style>
