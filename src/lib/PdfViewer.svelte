<script>
    import { fade, scale } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { createEventDispatcher } from "svelte";

    export let showPdfModal = false;
    export let pdfUrl = "";
    export let title = "PDF Viewer";
    export let downloadName = "document.pdf";

    const dispatch = createEventDispatcher();

    $: dispatch("showPdfModalChange", showPdfModal);

    let zoomLevel = 100;
    const ZOOM_MIN = 50;
    const ZOOM_MAX = 300;
    const ZOOM_STEP = 25;

    let isLoading = true;

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

    $: {
        if (typeof window !== "undefined") {
            document.body.style.overflow = showPdfModal ? "hidden" : "";
        }
    }

    function handleIframeLoad() {
        setTimeout(() => {
            isLoading = false;
        }, 500);
    }
</script>

{#if showPdfModal}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-8"
        transition:fade={{ duration: 200 }}
        on:click|self={() => (showPdfModal = false)}
        on:keydown|self={(e) => e.key === "Escape" && (showPdfModal = false)}
        role="button"
        tabindex="0"
        aria-label="Close dialog"
    >
        <div
            class="relative w-full max-w-6xl h-full bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
            in:scale={{ start: 0.95, duration: 200, easing: cubicOut }}
        >
            <div class="flex items-center justify-between px-6 py-3 bg-[#2a2a2a] border-b border-white/10">
                <h3 class="text-white font-medium text-lg">{title}</h3>

                <div class="flex items-center gap-1.5">
                    <button
                        on:click={zoomOut}
                        disabled={zoomLevel <= ZOOM_MIN}
                        class="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Zoom out"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                    </button>

                    <button
                        on:click={zoomReset}
                        class="px-2 py-1 text-xs font-mono text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-w-[52px] text-center"
                        title="Reset zoom"
                    >
                        {zoomLevel}%
                    </button>

                    <button
                        on:click={zoomIn}
                        disabled={zoomLevel >= ZOOM_MAX}
                        class="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Zoom in"
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
                        title="Download PDF"
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
                        title="Close"
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
            <div class="flex-1 bg-[#222] relative overflow-hidden">
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
                        <span class="text-gray-400 font-mono text-sm tracking-widest animate-pulse">CARGANDO PDF</span>
                    </div>
                {/if}

                <div
                    class="w-full h-full relative z-20 transition-opacity duration-500"
                    class:opacity-0={isLoading}
                    class:opacity-100={!isLoading}
                >
                    {#key pdfSrc}
                        <iframe
                            src={pdfSrc}
                            class="absolute inset-0 w-full h-full border-0"
                            title="PDF Viewer"
                            on:load={handleIframeLoad}
                        ></iframe>
                    {/key}
                </div>
            </div>
        </div>
    </div>
{/if}
