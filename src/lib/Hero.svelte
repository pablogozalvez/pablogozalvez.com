<script>
    import { viewport } from "./actions";
    import { onMount } from "svelte";
    import { t } from "./i18n";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let visible = false;
    let scrollY = 0;
    let innerHeight = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isMobile = false;

    $: rawProgress = Math.min(scrollY / innerHeight, 1);

    $: progress = 1 - Math.pow(1 - rawProgress, 3);

    $: opacity = isMobile ? 1 : Math.max(0, 1 - rawProgress * 1.2);

    $: scale = isMobile ? 1 : 1 - progress * 0.05;

    $: blur = isMobile ? 0 : rawProgress * rawProgress * 10;

    $: titleY = isMobile ? 0 : progress * -150;
    $: textY = isMobile ? 0 : progress * -100;
    $: btnY = isMobile ? 0 : progress * -50;

    $: codeParallax = isMobile ? 0 : progress * -300;

    $: codeScale = isMobile ? 1 : 1 + progress * 0.25;

    $: codeRotateX = isMobile ? 0 : 10 + mouseY * 0.5 + progress * 25;
    $: codeRotateY = isMobile ? 0 : -10 + mouseX * 0.5 - progress * 10;

    function handleMouseMove(e) {
        if (isMobile) return;
        mouseX = (e.clientX / window.innerWidth - 0.5) * 15;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 15;
    }

    function scrollTo(id) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }

    onMount(() => {
        isMobile = window.innerWidth < 1024;
        window.addEventListener("resize", () => {
            isMobile = window.innerWidth < 1024;
        });
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", () => {});
        };
    });
</script>

<svelte:window bind:scrollY bind:innerHeight />

<section
    id="home"
    class="h-screen sticky top-0 flex items-center relative overflow-hidden bg-[#0a0a0a]"
    style="opacity: {opacity}; transform: scale({scale}); filter: blur({blur}px); will-change: transform, opacity, filter;"
    use:viewport
    on:enterViewport={() => (visible = true)}
>
    <div class="absolute inset-0 bg-[#0a0a0a]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#0a0a0a_50%,#000000_100%)]"></div>
    <div class="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.05]" style="background-size: 65px 65px;"></div>

    <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_120%)] transition-opacity duration-300"
        style="opacity: {0.6 + progress * 0.4}"
    ></div>

    <div
        class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-950/30 rounded-full filter blur-[120px] pointer-events-none animate-float-slow transition-transform duration-[2000ms] cubic-bezier(0.2, 0.8, 0.2, 1)"
        style={!isMobile ? `transform: translate3d(${mouseX * 3}px, ${mouseY * 3}px, 0)` : ""}
    ></div>
    <div
        class="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-slate-900/40 rounded-full filter blur-[100px] pointer-events-none animate-float-medium transition-transform duration-[2500ms] cubic-bezier(0.2, 0.8, 0.2, 1)"
        style={!isMobile ? `transform: translate3d(${mouseX * -3}px, ${mouseY * -3}px, 0)` : ""}
    ></div>

    <div
        class="absolute inset-0 pointer-events-none transition-all duration-700 ease-out {!isMobile ? '' : 'hidden'}"
        style="background: radial-gradient(1000px circle at {mouseX * 15 + 50}% {mouseY * 15 +
            50}%, rgba(255,255,255,0.03), rgba(139,92,246,0.01) 40%, transparent 70%);"
    ></div>

    <div
        class="absolute inset-0 pointer-events-none transition-all duration-[1200ms] ease-out mix-blend-screen"
        style="background: radial-gradient(400px circle at {mouseX * 1.2 + 50}% {mouseY * 1.2 +
            50}%, rgba(99, 102, 241, 0.04), transparent 50%);"
    ></div>

    <div
        class="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col justify-center lg:grid lg:grid-cols-2 gap-12 items-center h-full"
    >
        <div
            class="order-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-2xl lg:max-w-[700px] -ml-2 sm:-ml-4 md:-ml-8 lg:-ml-12 perspective-container"
        >
            {#if visible}
                <h1
                    in:fly={{ y: 50, duration: 1000, delay: 0, easing: cubicOut }}
                    class="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-500 drop-shadow-lg select-none will-change-transform"
                    style="transform: translate3d(0, {titleY}px, 0)"
                >
                    {@html $t("hero.title")}
                </h1>

                <p
                    in:fly={{ y: 30, duration: 1000, delay: 200, easing: cubicOut }}
                    class="text-lg sm:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed font-light will-change-transform border-l-4 border-indigo-500 pl-6 italic bg-gradient-to-r from-indigo-900/15 via-transparent to-transparent"
                    style="transform: translate3d(0, {textY}px, 0)"
                >
                    <span class="text-indigo-400 text-2xl font-serif select-none mr-2">“</span>{$t(
                        "hero.subtitle"
                    )}<span class="text-indigo-400 text-2xl font-serif select-none ml-2">”</span>
                </p>

                <div
                    in:fly={{ y: 20, duration: 1000, delay: 400, easing: cubicOut }}
                    class="flex flex-col sm:flex-row gap-5 w-auto will-change-transform"
                    style="transform: translate3d(0, {btnY}px, 0)"
                >
                    <button
                        on:click={() => scrollTo("projects")}
                        class="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 focus:outline-none"
                    >
                        <span class="relative z-10">{$t("hero.viewProjects")}</span>
                        <svg
                            class="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        ></div>
                    </button>

                    <button
                        on:click={() => scrollTo("contact")}
                        class="group relative px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-medium rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)] flex items-center justify-center gap-3 focus:outline-none"
                    >
                        <span class="relative z-10">{$t("hero.contactMe")}</span>
                        <svg
                            class="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </button>
                </div>
            {/if}
        </div>

        <div class="order-2 h-0 lg:h-auto"></div>

        <div
            class="absolute top-1/2 left-1/2 lg:left-[70%] w-[90%] sm:w-[80%] lg:w-[55%] max-w-3xl opacity-25 lg:opacity-100 blur-[2px] lg:blur-none select-none pointer-events-none transition-transform duration-[50ms] ease-out z-0 will-change-transform"
            style="transform: 
            translate3d(-50%, -50%, 0) 
            perspective(1200px) 
            rotateX({codeRotateX}deg) 
            rotateY({codeRotateY}deg) 
            rotateZ(-2deg) 
            translate3d({isMobile ? 0 : mouseX * -2}px, {isMobile ? 0 : mouseY * -2 + codeParallax}px, -50px) 
            scale({codeScale});"
        >
            <div
                class="bg-[#0f111a] rounded-xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-sm {isMobile
                    ? 'animate-float-code'
                    : ''}"
            >
                <div class="flex items-center px-4 py-3 bg-[#1a1d2d] border-b border-white/5">
                    <div class="flex gap-2">
                        <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div class="flex-1 text-center text-sm text-gray-400 font-mono">Main.java</div>
                </div>
                <div class="flex p-6 font-mono text-sm sm:text-base leading-relaxed relative group">
                    <div
                        class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    ></div>

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
                                "hero.code.varName"
                            )} + <span class="text-green-400">"."</span>);
        <span class="text-blue-300">System</span>.<span class="text-purple-400">out</span>.<span class="text-yellow-200"
                                >println</span
                            >(<span class="text-green-400">"{$t("hero.code.stack")}"</span> + <span
                                class="text-blue-300">String</span
                            >.join(<span class="text-green-400">", "</span>, {$t("hero.code.varStack")}));
        <span class="text-blue-300">System</span>.<span class="text-purple-400">out</span>.<span class="text-yellow-200"
                                >println</span
                            >(<span class="text-green-400">"{$t("hero.code.mood")}"</span> + {$t("hero.code.varMood")});
        <span class="text-blue-300">System</span>.<span class="text-purple-400">out</span>.<span class="text-yellow-200"
                                >println</span
                            >(<span class="text-green-400">"{$t("hero.code.goal")}"</span> + {$t("hero.code.varGoal")});
    <span class="text-gray-400">&rbrace;</span>
<span class="text-gray-400">&rbrace;</span><span class="animate-pulse text-blue-400 font-bold">|</span></code
                        ></pre>
                </div>
            </div>
        </div>

        <button
            type="button"
            class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer group opacity-80 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            on:click={() => scrollTo("about")}
            aria-label="Scroll to about section"
        >
            <span
                class="text-xs font-mono text-gray-400 uppercase tracking-widest transition-all duration-300 group-hover:text-gray-300 group-hover:tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(99,102,241,0.15)]"
            >
                {$t("hero.scroll")}
            </span>
            <div class="relative flex items-center justify-center">
                <div class="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping pointer-events-none"></div>
                <svg
                    class="w-7 h-7 text-indigo-400 relative z-10 animate-bounce-smooth transition-all duration-200 group-hover:text-indigo-300 group-hover:scale-110 drop-shadow-[0_4px_12px_rgba(99,102,241,0.25)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </div>
            <div
                class="w-px h-12 bg-gradient-to-b from-indigo-400/0 via-indigo-400/60 to-indigo-400/0 group-hover:h-16 transition-all duration-700 ease-in-out"
            ></div>
        </button>
    </div>
</section>

<style>
    @keyframes bounce-smooth {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(10px);
        }
    }

    @keyframes smoothBounce {
        0%,
        100% {
            transform: translateY(0);
            opacity: 0.5;
        }
        50% {
            transform: translateY(-8px);
            opacity: 0.8;
        }
    }

    @keyframes float-slow {
        0%,
        100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-20px) scale(1.02);
            opacity: 0.4;
        }
    }

    @keyframes float-medium {
        0%,
        100% {
            transform: translateY(0) scale(1);
            opacity: 0.4;
        }
        50% {
            transform: translateY(-30px) scale(1.05);
            opacity: 0.5;
        }
    }

    @keyframes float-code {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-15px);
        }
    }

    .animate-float-slow {
        animation: float-slow 15s ease-in-out infinite;
    }
    .animate-float-medium {
        animation: float-medium 10s ease-in-out infinite;
        animation-delay: 2s;
    }
    .animate-float-code {
        animation: float-code 6s ease-in-out infinite;
    }

    .perspective-container {
        transform-style: preserve-3d;
    }
</style>
