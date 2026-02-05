<script>
    import { viewport } from "./actions";
    import { onMount } from "svelte";
    import { t } from "./i18n";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let visible = false;
    let isMobile = false;

    let heroOpacity = 1;
    let scrollY = 0;
    let innerHeight = 1;

    function scrollTo(id) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }

    $: heroOpacity = Math.max(0, 1 - (scrollY / innerHeight) * 1.5);

    onMount(() => {
        const handleResize = () => {
            isMobile = window.innerWidth < 1024;
            innerHeight = window.innerHeight;
        };
        handleResize();
        window.addEventListener("resize", handleResize, { passive: true });
        return () => window.removeEventListener("resize", handleResize);
    });
</script>

<svelte:window bind:scrollY />

<section
    id="home"
    class="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]"
    style="opacity: {heroOpacity};"
    use:viewport
    on:enterViewport={() => (visible = true)}
>
    <div class="absolute inset-0 bg-[#0a0a0a] z-0"></div>
    <div class="absolute inset-0 hero-grid opacity-[0.2] z-0 pointer-events-none"></div>
    <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] z-0 pointer-events-none"
    ></div>

    {#if !isMobile}
        <div
            class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none select-none z-0"
        ></div>
        <div
            class="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none select-none z-0"
        ></div>
    {/if}

    <div
        class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 h-full py-20 lg:py-0 flex flex-col lg:flex-row items-center justify-center lg:justify-between"
    >
        <div class="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2">
            {#if visible}
                <div in:fly={{ y: 30, duration: 800, easing: cubicOut }}>
                    <h1
                        class="text-6xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter mb-6 lg:mb-8 leading-[0.95] text-white drop-shadow-lg"
                    >
                        {@html $t("hero.title")}
                    </h1>
                </div>

                <div
                    in:fly={{ y: 20, duration: 800, delay: 150, easing: cubicOut }}
                    class="w-full flex justify-center lg:justify-start"
                >
                    <p
                        class="text-lg sm:text-lg lg:text-xl text-gray-300 lg:text-gray-400 mb-12 lg:mb-10 max-w-lg leading-relaxed font-light border-l-0 lg:border-l-2 border-indigo-500/50 p-6 lg:p-0 lg:pl-6 lg:pr-6 lg:py-4 bg-white/5 lg:bg-transparent lg:bg-gradient-to-r lg:from-indigo-950/20 lg:via-indigo-950/5 lg:to-transparent rounded-xl lg:rounded-none lg:rounded-r-lg backdrop-blur-md lg:backdrop-blur-sm shadow-lg lg:shadow-none"
                    >
                        {$t("hero.subtitle")}
                    </p>
                </div>

                <div
                    in:fly={{ y: 20, duration: 800, delay: 300, easing: cubicOut }}
                    class="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start w-full"
                >
                    <button
                        on:click={() => scrollTo("projects")}
                        class="px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-black font-bold rounded-full hover:from-gray-100 hover:to-white hover:shadow-lg hover:shadow-white/20 transition-all duration-300 flex items-center justify-center gap-2 group will-change-transform"
                    >
                        <span>{$t("hero.viewProjects")}</span>
                        <svg
                            class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            /></svg
                        >
                    </button>

                    <button
                        on:click={() => scrollTo("contact")}
                        class="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 backdrop-blur-sm will-change-transform"
                    >
                        {$t("hero.contactMe")}
                    </button>
                </div>
            {/if}
        </div>

        {#if visible}
            <div
                in:fly={{ y: 40, duration: 1000, delay: 150, easing: cubicOut }}
                class="w-[85%] sm:w-[70%] lg:w-[48%] max-w-2xl select-none z-0
                {isMobile
                    ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-45 blur-sm scale-110 pointer-events-none'
                    : 'absolute top-1/2 left-1/2 lg:left-[70%] -translate-x-1/2 -translate-y-1/2 opacity-90 code-tilt pointer-events-auto'}"
            >
                <div
                    class="bg-[#0f111a] rounded-xl border border-white/10 shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/30 hover:border-white/25 hover:backdrop-blur-lg group"
                >
                    <div
                        class="flex items-center px-4 py-3 bg-gradient-to-r from-[#1a1d2d] to-[#1e2136] border-b border-white/5 group-hover:border-white/10 transition-colors duration-500"
                    >
                        <div class="flex gap-2">
                            <div
                                class="w-3 h-3 rounded-full bg-[#ff5f56] hover:shadow-lg hover:shadow-red-500/60 transition-all duration-300 cursor-pointer"
                            ></div>
                            <div
                                class="w-3 h-3 rounded-full bg-[#ffbd2e] hover:shadow-lg hover:shadow-yellow-500/60 transition-all duration-300 cursor-pointer"
                            ></div>
                            <div
                                class="w-3 h-3 rounded-full bg-[#27c93f] hover:shadow-lg hover:shadow-green-500/60 transition-all duration-300 cursor-pointer"
                            ></div>
                        </div>
                        <div class="flex-1 text-center text-sm text-gray-400 font-mono">Main.java</div>
                    </div>
                    <div class="flex p-5 font-mono text-xs sm:text-sm leading-relaxed">
                        <div class="flex flex-col text-right text-gray-600 mr-4 select-none opacity-50">
                            <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span
                                >7</span
                            ><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span>
                        </div>
                        <pre class="text-gray-500 whitespace-pre-wrap break-words"><code
                                ><span class="text-purple-400">public record</span> <span class="text-yellow-200"
                                    >{$t("hero.code.class")}</span
                                >(
    <span class="text-blue-300">String</span> <span class="text-gray-300">{$t("hero.code.varName")}</span>,
    <span class="text-blue-300">String</span>[] <span class="text-gray-300">{$t("hero.code.varStack")}</span>,
    <span class="text-blue-300">String</span> <span class="text-gray-300">{$t("hero.code.varMood")}</span>,
    <span class="text-blue-300">String</span> <span class="text-gray-300">{$t("hero.code.varGoal")}</span>
) <span class="text-gray-400">&lbrace;</span>
    <span class="text-purple-400">public void</span> <span class="text-yellow-200">{$t("hero.code.method")}</span
                                >() <span class="text-gray-400">&lbrace;</span>
        <span class="text-blue-300">System</span>.<span class="text-purple-400">out</span>.<span class="text-yellow-200"
                                    >println</span
                                >(<span class="text-green-400">"{$t("hero.code.hello")}"</span> + {$t(
                                    "hero.code.varName",
                                )} + <span class="text-green-400">"."</span>);
        <span class="text-blue-300">System</span>.<span class="text-purple-400">out</span>.<span class="text-yellow-200"
                                    >println</span
                                >(<span class="text-green-400">"{$t("hero.code.stack")}"</span> + <span
                                    class="text-blue-300">String</span
                                >.join(<span class="text-green-400">", "</span>, {$t("hero.code.varStack")}));
        <span class="text-blue-300">System</span>.<span class="text-purple-400">out</span>.<span class="text-yellow-200"
                                    >println</span
                                >(<span class="text-green-400">"{$t("hero.code.mood")}"</span> + {$t(
                                    "hero.code.varMood",
                                )});
        <span class="text-blue-300">System</span>.<span class="text-purple-400">out</span>.<span class="text-yellow-200"
                                    >println</span
                                >(<span class="text-green-400">"{$t("hero.code.goal")}"</span> + {$t(
                                    "hero.code.varGoal",
                                )});
    <span class="text-gray-400">&rbrace;</span>
<span class="text-gray-400">&rbrace;</span><span class="animate-pulse text-blue-400 font-bold">|</span></code
                            ></pre>
                    </div>
                </div>
            </div>
        {/if}
    </div>

    <button
        on:click={() => scrollTo("about")}
        class="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 animate-bounce-slow z-20 will-change-transform"
        aria-label="Scroll down"
    >
        <svg class="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
            /></svg
        >
    </button>
</section>

<style>
    .hero-grid {
        background-size: 40px 40px;
        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
    }

    .perspective-container {
        perspective: 1200px;
    }

    .code-tilt {
        transform: perspective(1200px) rotateY(-5deg) rotateX(2deg);
        transition:
            transform 0.5s ease,
            filter 0.5s ease;
        will-change: transform, filter;
    }

    .code-tilt:hover {
        transform: perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1.05);
        filter: brightness(1.1);
    }

    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    @keyframes bounce-slow {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(8px);
        }
    }
    .animate-bounce-slow {
        animation: bounce-slow 2s ease-in-out infinite;
    }
</style>
