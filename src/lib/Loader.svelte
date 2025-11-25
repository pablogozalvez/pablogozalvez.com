<script>
    import { fade } from "svelte/transition";

    export let isLoading = true;
    export let title = "Initializing System";
</script>

{#if isLoading}
    <div
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white"
        out:fade={{ duration: 500 }}
    >
        <!-- Logo Animation -->
        <div class="relative w-20 h-20 mb-8">
            <div
                class="absolute inset-0 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm animate-spin-slow"
            ></div>
            <div
                class="absolute inset-0 flex items-center justify-center font-black text-2xl tracking-tighter animate-pulse"
            >
                PG
            </div>
        </div>

        <!-- Loading Bar -->
        <div class="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 animate-loading-bar"></div>
        </div>

        <div class="mt-4 text-xs font-mono text-gray-500 uppercase tracking-widest animate-pulse">
            {title}
        </div>
    </div>
{/if}

<style>
    @keyframes spin-slow {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .animate-spin-slow {
        animation: spin-slow 3s linear infinite;
    }

    @keyframes loading-bar {
        0% {
            transform: translateX(-100%);
        }
        50% {
            transform: translateX(0%);
        }
        100% {
            transform: translateX(100%);
        }
    }
    .animate-loading-bar {
        animation: loading-bar 1.5s ease-in-out infinite;
    }
</style>
