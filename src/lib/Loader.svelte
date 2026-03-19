<script>
    import { fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    export let isLoading = true;
    export let title = "Initializing System";
</script>

{#if isLoading}
    <div
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white"
        out:fade={{ duration: 600, easing: cubicOut }}
    >
        <!-- Logo Animation -->
        <div class="relative w-20 h-20 mb-8 loader-logo">
            <div
                class="absolute inset-0 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm animate-morph-spin"
            ></div>
            <div class="absolute inset-0 rounded-xl border border-indigo-500/20 animate-morph-spin-reverse"></div>
            <div
                class="absolute inset-0 flex items-center justify-center font-black text-2xl tracking-tighter animate-pulse-subtle"
            >
                PG
            </div>
        </div>

        <!-- Loading Bar -->
        <div class="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-loading-bar"></div>
        </div>

        <div class="mt-4 text-xs font-mono text-gray-500 uppercase tracking-widest animate-fade-pulse">
            {title}
        </div>
    </div>
{/if}

<style>
    .loader-logo {
        animation: logoEntrance 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    @keyframes logoEntrance {
        from {
            opacity: 0;
            transform: scale(0.7) rotate(-10deg);
            filter: blur(4px);
        }
        to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            filter: blur(0);
        }
    }

    @keyframes morph-spin {
        0% {
            transform: rotate(0deg) scale(1);
            border-radius: 20%;
        }
        25% {
            transform: rotate(90deg) scale(1.05);
            border-radius: 30%;
        }
        50% {
            transform: rotate(180deg) scale(1);
            border-radius: 20%;
        }
        75% {
            transform: rotate(270deg) scale(0.95);
            border-radius: 30%;
        }
        100% {
            transform: rotate(360deg) scale(1);
            border-radius: 20%;
        }
    }

    .animate-morph-spin {
        animation: morph-spin 3s ease-in-out infinite;
    }

    .animate-morph-spin-reverse {
        animation: morph-spin 4s ease-in-out infinite reverse;
        opacity: 0.5;
    }

    .animate-pulse-subtle {
        animation: pulseSub 2s ease-in-out infinite;
    }

    @keyframes pulseSub {
        0%,
        100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.8;
            transform: scale(0.95);
        }
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

    .animate-fade-pulse {
        animation: fadePulse 2s ease-in-out infinite;
    }

    @keyframes fadePulse {
        0%,
        100% {
            opacity: 0.3;
        }
        50% {
            opacity: 0.7;
        }
    }
</style>
