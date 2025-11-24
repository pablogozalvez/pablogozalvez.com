<script>
    import { viewport } from "./actions";
    import { t } from "./i18n";
    import { fade, scale } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let visible = false;
    let containerRef;

    $: stats = [
        { label: $t("about.stats.projects"), value: "20+" },
        { label: $t("about.stats.releases"), value: "5+" },
        { label: $t("about.stats.commitment"), value: "100%" },
    ];

    $: skills = [
        {
            category: $t("about.skills.languages"),
            icon: "M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z", // Code brackets
            color: "text-indigo-400",
            items: ["Java", "TypeScript", "JavaScript", "C#", "PHP", "Kotlin", "Python", "SQL"],
        },
        {
            category: $t("about.skills.frontend"),
            icon: "M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25", // Monitor
            color: "text-blue-400",
            items: ["Angular", "Next.js", "React", "Tailwind", "Bootstrap", "Java FX"],
        },
        {
            category: $t("about.skills.backend"),
            icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z", // Servidor
            color: "text-pink-400",
            items: ["Spring Boot", "Node.js", "Express", "Laravel", "Oracle DB", "MongoDB"],
        },
        {
            category: $t("about.skills.gamedev"),
            icon: "M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z", // Piezo de puzle
            color: "text-purple-400",
            items: ["Unity", "Godot", "Blender"],
        },
    ];

    export let showPdfModal = false;

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    $: dispatch("showPdfModalChange", showPdfModal);

    // Deshabilitar scroll cuando el modal de pdf esté abierto
    $: {
        if (typeof window !== "undefined") {
            document.body.style.overflow = showPdfModal ? "hidden" : "";
        }
    }

    function handleMouseMove(e) {
        if (!containerRef) return;
        const cards = containerRef.getElementsByClassName("spotlight-card");

        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        }
    }
</script>

{#if showPdfModal}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
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
            <div class="flex items-center justify-between px-6 py-4 bg-[#2a2a2a] border-b border-white/10">
                <h3 class="text-white font-medium text-lg">Curriculum Vitae</h3>
                <div class="flex items-center gap-3">
                    <a
                        href="/media/pdf/cv.pdf"
                        download
                        class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
                        class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
            <div class="flex-1 bg-[#333] relative">
                <iframe
                    src="/media/pdf/cv.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
                    class="w-full h-full border-0"
                    title="CV Viewer"
                ></iframe>
            </div>
        </div>
    </div>
{/if}

<section
    id="about"
    aria-label="About"
    class="py-32 relative overflow-hidden bg-gradient-to-b from-[#050505] to-[#080808]"
    use:viewport
    on:enterViewport={() => (visible = true)}
    on:mousemove={handleMouseMove}
    bind:this={containerRef}
>
    <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" style="background-size: 30px 30px;"></div>
    <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"
    ></div>

    <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none"
    ></div>
    <div
        class="absolute -top-20 -left-20 w-[500px] h-[500px] bg-slate-900/20 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <div
        class="absolute -bottom-[300px] -right-20 w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <div
        class="absolute -bottom-[250px] -left-20 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div
            class="mb-16 md:mb-24 transition-all duration-1000 transform {visible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'}"
        >
            <h2 class="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                {@html $t("about.title")}
            </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div
                class="lg:col-span-5 flex flex-col justify-between transition-all duration-1000 delay-200 {visible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-10'}"
            >
                <div class="prose prose-invert prose-lg">
                    <p class="text-gray-400 leading-relaxed text-lg">
                        {@html $t("about.p1")}
                    </p>
                    <p class="text-gray-400 leading-relaxed text-lg mt-6">
                        {@html $t("about.p2")}
                    </p>
                </div>

                <div class="grid grid-cols-3 gap-4 mt-12 border-t border-white/10 pt-8">
                    {#each stats as stat}
                        <div>
                            <div class="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div class="text-xs text-gray-500 uppercase tracking-wider font-mono">{stat.label}</div>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each skills as skill, i}
                    <div
                        class="spotlight-card group relative bg-white/[0.02] border border-white/10 p-6 rounded-2xl overflow-hidden transition-all duration-500 {visible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-10'}"
                        style="transition-delay: {300 + i * 100}ms"
                    >
                        <div
                            class="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                            style="background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%);"
                        ></div>

                        <div class="relative z-10">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="p-2 rounded-lg bg-white/5 border border-white/5 {skill.color}">
                                    <svg
                                        class="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                    >
                                        <path d={skill.icon} />
                                    </svg>
                                </div>
                                <h3 class="text-lg font-bold text-gray-100">{skill.category}</h3>
                            </div>

                            <div class="flex flex-wrap gap-2">
                                {#each skill.items as item}
                                    <span
                                        class="px-2.5 py-1 text-xs font-mono text-gray-400 bg-white/5 border border-white/5 rounded-md transition-colors group-hover:text-gray-200 group-hover:border-white/20"
                                    >
                                        {item}
                                    </span>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/each}

                <div
                    class="md:col-span-2 mt-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/20 to-blue-900/20 border border-white/10 flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all {visible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'}"
                    style="transition-delay: 800ms"
                    on:click={() => (showPdfModal = true)}
                    on:keydown={(e) => e.key === "Enter" && (showPdfModal = true)}
                    role="button"
                    tabindex="0"
                >
                    <div class="flex flex-col">
                        <span class="text-white font-bold text-lg">{$t("about.resume.title")}</span>
                        <span class="text-gray-400 text-sm">{$t("about.resume.subtitle")}</span>
                    </div>
                    <div
                        class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transform group-hover:scale-110 transition-transform"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path></svg
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .spotlight-card {
        --mouse-x: 0px;
        --mouse-y: 0px;
    }
</style>
