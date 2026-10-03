<script>
    import { fade, scale } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { createEventDispatcher } from "svelte";
    import { getI18n } from "./i18n";
    import { modal } from "./modal";

    const { t } = getI18n();

    export let showPdfModal = false;
    export let pdfUrl = "";
    export let title = "PDF";
    export let downloadName = "document.pdf";

    const dispatch = createEventDispatcher();

    $: dispatch("showPdfModalChange", showPdfModal);

    let zoomLevel = 100;
    const ZOOM_MIN = 50;
    const ZOOM_MAX = 300;
    const ZOOM_STEP = 25;

    let isLoading = true;
    let viewerUnavailable = false;
    let loadTimer;

    $: pdfSrc = `${pdfUrl}#toolbar=0&navpanes=0&zoom=${zoomLevel}`;

    function zoomIn() {
        zoomLevel = Math.min(ZOOM_MAX, zoomLevel + ZOOM_STEP);
        isLoading = true;
    }
    function zoomOut() {
        zoomLevel = Math.max(ZOOM_MIN, zoomLevel - ZOOM_STEP);
        isLoading = true;
    }
    function zoomReset() {
        if (zoomLevel !== 100) {
            zoomLevel = 100;
            isLoading = true;
        }
    }

    $: if (!showPdfModal) {
        zoomLevel = 100;
    } else {
        isLoading = true;
    }

    function prepareFrame() {
        isLoading = true;
        viewerUnavailable = false;
        loadTimer = setTimeout(() => {
            isLoading = false;
            viewerUnavailable = true;
        }, 10000);
        return { destroy: () => clearTimeout(loadTimer) };
    }

    function handleIframeLoad() {
        clearTimeout(loadTimer);
        isLoading = false;
        viewerUnavailable = false;
    }

    function closeOnBackdrop(event) {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
            showPdfModal = false;
        }
    }
</script>

{#if showPdfModal}
    <dialog
        use:modal
        class="pdf-dialog text-white"
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 120 }}
        on:click={closeOnBackdrop}
        on:cancel|preventDefault={() => (showPdfModal = false)}
        aria-labelledby="pdf-title"
    >
        <div
            class="relative w-full max-w-6xl h-full bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
            in:scale={{ start: 0.95, duration: 200, easing: cubicOut }}
        >
            <div class="flex flex-wrap items-center justify-between gap-2 px-3 md:px-6 py-3 bg-[#2a2a2a] border-b border-white/10">
                <h2 id="pdf-title" data-modal-title tabindex="-1" class="text-white font-medium text-lg">{title}</h2>

                <div class="flex items-center gap-1.5">
                    <button
                        on:click={zoomOut}
                        disabled={zoomLevel <= ZOOM_MIN}
                        class="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={$t("pdf.zoomOut")}
                        aria-label={$t("pdf.zoomOut")}
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                    </button>

                    <button
                        on:click={zoomReset}
                        class="px-2 py-1 text-xs font-mono text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-w-[52px] text-center"
                        title={$t("pdf.resetZoom")}
                        aria-label={$t("pdf.resetZoom")}
                    >
                        {zoomLevel}%
                    </button>

                    <button
                        on:click={zoomIn}
                        disabled={zoomLevel >= ZOOM_MAX}
                        class="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={$t("pdf.zoomIn")}
                        aria-label={$t("pdf.zoomIn")}
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>

                    <div class="w-px h-5 bg-white/10 mx-1.5"></div>

                    <a
                        href={pdfUrl}
                        download={downloadName}
                        class="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title={$t("pdf.download")}
                        aria-label={$t("pdf.download")}
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                    </a>
                    <button
                        on:click={() => (showPdfModal = false)}
                        class="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title={$t("pdf.close")}
                        aria-label={$t("pdf.close")}
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" class="px-4 py-2 text-sm text-indigo-200 underline">{$t("pdf.openDirectly")}</a>
            <div class="flex-1 min-h-0 bg-[#222] relative overflow-hidden" aria-busy={isLoading}>
                {#if isLoading}
                    <div class="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#222]">
                        <svg class="w-10 h-10 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span role="status" class="text-gray-300 font-mono text-sm tracking-widest animate-pulse">{$t("pdf.loading")}</span>
                    </div>
                {/if}

                {#if viewerUnavailable}
                    <p role="status" class="absolute inset-x-4 top-4 z-30 bg-[#222] p-3 text-gray-200">{$t("pdf.unavailable")}</p>
                {/if}
                <div
                    class="w-full h-full relative z-20 transition-opacity duration-500"
                    class:opacity-0={isLoading}
                    class:opacity-100={!isLoading}
                >
                    {#key pdfSrc}
                        <iframe
                            use:prepareFrame
                            src={pdfSrc}
                            class="absolute inset-0 w-full h-full border-0"
                            title={$t("pdf.viewer") + ": " + title}
                            on:load={handleIframeLoad}
                        ></iframe>
                    {/key}
                </div>
            </div>
        </div>
    </dialog>
{/if}

<style>
    .pdf-dialog {
        width: calc(100% - 2rem);
        max-width: 1152px;
        height: calc(100dvh - 2rem);
        max-height: calc(100dvh - 2rem);
        margin: auto;
        padding: 0;
        border: 0;
        border-radius: 1rem;
        background: #1a1a1a;
        overflow: hidden;
    }
    .pdf-dialog::backdrop {
        background: rgb(0 0 0 / 70%);
    }
    .pdf-dialog :global(button), .pdf-dialog :global(a[download]) {
        min-width: 44px;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
</style>
