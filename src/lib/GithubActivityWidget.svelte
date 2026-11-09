<script>
    import { onMount } from "svelte";
    import { getI18n } from "./i18n";
    import { fetchJson } from "./fetch-json";
    import { parseGithubActivity } from "./github-activity";
    import { animationVisibility } from "./animation-visibility";
    import { IconExternalLink } from "./icons";

    const { locale, t } = getI18n();

    // Datos de contribción recientes (fallback en caso de error al obtener los datos de GitHub)
    const fallbackDays = [
        {"d":"2026-03-18","c":0,"l":0},{"d":"2026-03-19","c":1,"l":1},{"d":"2026-03-20","c":1,"l":1},{"d":"2026-03-21","c":1,"l":1},{"d":"2026-03-22","c":10,"l":1},{"d":"2026-03-23","c":3,"l":1},{"d":"2026-03-24","c":4,"l":1},
        {"d":"2026-03-25","c":3,"l":1},{"d":"2026-03-26","c":8,"l":1},{"d":"2026-03-27","c":12,"l":1},{"d":"2026-03-28","c":6,"l":1},{"d":"2026-03-29","c":9,"l":1},{"d":"2026-03-30","c":8,"l":1},{"d":"2026-03-31","c":0,"l":0},
        {"d":"2026-04-01","c":5,"l":1},{"d":"2026-04-02","c":0,"l":0},{"d":"2026-04-03","c":2,"l":1},{"d":"2026-04-04","c":0,"l":0},{"d":"2026-04-05","c":0,"l":0},{"d":"2026-04-06","c":0,"l":0},{"d":"2026-04-07","c":4,"l":1},
        {"d":"2026-04-08","c":0,"l":0},{"d":"2026-04-09","c":1,"l":1},{"d":"2026-04-10","c":9,"l":1},{"d":"2026-04-11","c":4,"l":1},{"d":"2026-04-12","c":8,"l":1},{"d":"2026-04-13","c":1,"l":1},{"d":"2026-04-14","c":12,"l":1},
        {"d":"2026-04-15","c":8,"l":1},{"d":"2026-04-16","c":0,"l":0},{"d":"2026-04-17","c":5,"l":1},{"d":"2026-04-18","c":0,"l":0},{"d":"2026-04-19","c":1,"l":1},{"d":"2026-04-20","c":4,"l":1},{"d":"2026-04-21","c":14,"l":2},
        {"d":"2026-04-22","c":0,"l":0},{"d":"2026-04-23","c":7,"l":1},{"d":"2026-04-24","c":0,"l":0},{"d":"2026-04-25","c":10,"l":1},{"d":"2026-04-26","c":3,"l":1},{"d":"2026-04-27","c":3,"l":1},{"d":"2026-04-28","c":1,"l":1},
        {"d":"2026-04-29","c":3,"l":1},{"d":"2026-04-30","c":2,"l":1},{"d":"2026-05-01","c":0,"l":0},{"d":"2026-05-02","c":0,"l":0},{"d":"2026-05-03","c":2,"l":1},{"d":"2026-05-04","c":0,"l":0},{"d":"2026-05-05","c":7,"l":1},
        {"d":"2026-05-06","c":2,"l":1},{"d":"2026-05-07","c":1,"l":1},{"d":"2026-05-08","c":0,"l":0},{"d":"2026-05-09","c":0,"l":0},{"d":"2026-05-10","c":0,"l":0},{"d":"2026-05-11","c":4,"l":1},{"d":"2026-05-12","c":1,"l":1},
        {"d":"2026-05-13","c":0,"l":0},{"d":"2026-05-14","c":4,"l":1},{"d":"2026-05-15","c":3,"l":1},{"d":"2026-05-16","c":0,"l":0},{"d":"2026-05-17","c":0,"l":0},{"d":"2026-05-18","c":0,"l":0},{"d":"2026-05-19","c":2,"l":1},
        {"d":"2026-05-20","c":4,"l":1},{"d":"2026-05-21","c":0,"l":0},{"d":"2026-05-22","c":0,"l":0},{"d":"2026-05-23","c":2,"l":1},{"d":"2026-05-24","c":5,"l":1},{"d":"2026-05-25","c":1,"l":1},{"d":"2026-05-26","c":1,"l":1},
        {"d":"2026-05-27","c":0,"l":0},{"d":"2026-05-28","c":3,"l":1},{"d":"2026-05-29","c":4,"l":1},{"d":"2026-05-30","c":0,"l":0},{"d":"2026-05-31","c":1,"l":1},{"d":"2026-06-01","c":0,"l":0},{"d":"2026-06-02","c":0,"l":0},
        {"d":"2026-06-03","c":0,"l":0},{"d":"2026-06-04","c":0,"l":0},{"d":"2026-06-05","c":0,"l":0},{"d":"2026-06-06","c":0,"l":0},{"d":"2026-06-07","c":0,"l":0},{"d":"2026-06-08","c":2,"l":1},{"d":"2026-06-09","c":0,"l":0},
        {"d":"2026-06-10","c":8,"l":1},{"d":"2026-06-11","c":3,"l":1},{"d":"2026-06-12","c":0,"l":0},{"d":"2026-06-13","c":1,"l":1},{"d":"2026-06-14","c":0,"l":0},{"d":"2026-06-15","c":4,"l":1},{"d":"2026-06-16","c":0,"l":0},
        {"d":"2026-06-17","c":1,"l":1},{"d":"2026-06-18","c":4,"l":1},{"d":"2026-06-19","c":7,"l":1},{"d":"2026-06-20","c":4,"l":1},{"d":"2026-06-21","c":7,"l":1},{"d":"2026-06-22","c":0,"l":0},{"d":"2026-06-23","c":0,"l":0},
        {"d":"2026-06-24","c":0,"l":0},{"d":"2026-06-25","c":2,"l":1},{"d":"2026-06-26","c":0,"l":0},{"d":"2026-06-27","c":0,"l":0},{"d":"2026-06-28","c":0,"l":0},{"d":"2026-06-29","c":5,"l":1},{"d":"2026-06-30","c":2,"l":1},
        {"d":"2026-07-01","c":1,"l":1},{"d":"2026-07-02","c":0,"l":0},{"d":"2026-07-03","c":0,"l":0},{"d":"2026-07-04","c":0,"l":0},{"d":"2026-07-05","c":0,"l":0},{"d":"2026-07-06","c":0,"l":0},{"d":"2026-07-07","c":0,"l":0},
        {"d":"2026-07-08","c":0,"l":0},{"d":"2026-07-09","c":0,"l":0},{"d":"2026-07-10","c":0,"l":0},{"d":"2026-07-11","c":1,"l":1},{"d":"2026-07-12","c":4,"l":1},{"d":"2026-07-13","c":0,"l":0},{"d":"2026-07-14","c":0,"l":0},
        {"d":"2026-07-15","c":0,"l":0},{"d":"2026-07-16","c":0,"l":0},{"d":"2026-07-17","c":0,"l":0},{"d":"2026-07-18","c":4,"l":1},{"d":"2026-07-19","c":0,"l":0},{"d":"2026-07-20","c":0,"l":0},{"d":"2026-07-21","c":7,"l":1},
        {"d":"2026-07-22","c":0,"l":0},{"d":"2026-07-23","c":0,"l":0},{"d":"2026-07-24","c":0,"l":0},{"d":"2026-07-25","c":0,"l":0},{"d":"2026-07-26","c":0,"l":0},{"d":"2026-07-27","c":3,"l":1},{"d":"2026-07-28","c":0,"l":0},
        {"d":"2026-07-29","c":1,"l":1},{"d":"2026-07-30","c":0,"l":0},{"d":"2026-07-31","c":0,"l":0},{"d":"2026-08-01","c":0,"l":0},{"d":"2026-08-02","c":0,"l":0},{"d":"2026-08-03","c":0,"l":0},{"d":"2026-08-04","c":0,"l":0},
        {"d":"2026-08-05","c":0,"l":0},{"d":"2026-08-06","c":0,"l":0},{"d":"2026-08-07","c":0,"l":0},{"d":"2026-08-08","c":0,"l":0},{"d":"2026-08-09","c":0,"l":0},{"d":"2026-08-10","c":0,"l":0},{"d":"2026-08-11","c":15,"l":2},
        {"d":"2026-08-12","c":0,"l":0},{"d":"2026-08-13","c":0,"l":0},{"d":"2026-08-14","c":33,"l":3},{"d":"2026-08-15","c":31,"l":3},{"d":"2026-08-16","c":11,"l":1},{"d":"2026-08-17","c":24,"l":2},{"d":"2026-08-18","c":13,"l":1},
        {"d":"2026-08-19","c":10,"l":1},{"d":"2026-08-20","c":4,"l":1},{"d":"2026-08-21","c":3,"l":1},{"d":"2026-08-22","c":0,"l":0},{"d":"2026-08-23","c":0,"l":0},{"d":"2026-08-24","c":3,"l":1},{"d":"2026-08-25","c":0,"l":0},
        {"d":"2026-08-26","c":0,"l":0},{"d":"2026-08-27","c":0,"l":0},{"d":"2026-08-28","c":0,"l":0},{"d":"2026-08-29","c":0,"l":0},{"d":"2026-08-30","c":11,"l":1},{"d":"2026-08-31","c":52,"l":4},{"d":"2026-09-01","c":9,"l":1},
        {"d":"2026-09-02","c":16,"l":2},{"d":"2026-09-03","c":2,"l":1},{"d":"2026-09-04","c":0,"l":0},{"d":"2026-09-05","c":0,"l":0},{"d":"2026-09-06","c":0,"l":0},{"d":"2026-09-07","c":0,"l":0},{"d":"2026-09-08","c":0,"l":0},
        {"d":"2026-09-09","c":0,"l":0},{"d":"2026-09-10","c":34,"l":3},{"d":"2026-09-11","c":0,"l":0},{"d":"2026-09-12","c":0,"l":0},{"d":"2026-09-13","c":0,"l":0},{"d":"2026-09-14","c":8,"l":1},{"d":"2026-09-15","c":0,"l":0}
    ];

    let days = fallbackDays;
    let totalYearContributions = 692;
    let hoveredDay = null;
    let isLive = false;
    let focusedIndex = 0;

    function moveFocus(event, index) {
        const offsets = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 };
        let next;
        if (event.key === "Home") next = 0;
        else if (event.key === "End") next = days.length - 1;
        else if (event.key in offsets) next = Math.max(0, Math.min(days.length - 1, index + offsets[event.key]));
        else return;
        event.preventDefault();
        focusedIndex = next;
        event.currentTarget.parentElement.children[next]?.focus();
    }

    onMount(() => {
        const controller = new AbortController();
        // La gráfica está oculta en móvil: tampoco necesita una petición allí.
        const desktop = window.matchMedia("(min-width: 1024px)");
        let requested = false;
        const load = async () => {
            if (!desktop.matches || requested) return;
            requested = true;
            try {
                const { ok, data } = await fetchJson("https://github-contributions-api.jogruber.de/v4/pablogozalvez?y=last", { signal: controller.signal });
                if (!ok || controller.signal.aborted) return;
                const activity = parseGithubActivity(data);
                totalYearContributions = activity.total;
                days = activity.days;
                hoveredDay = null;
                isLive = true;
            } catch {
                // Se conserva la instantánea existente, identificada como guardada.
            }
        };
        load();
        desktop.addEventListener("change", load);
        return () => {
            controller.abort();
            desktop.removeEventListener("change", load);
        };
    });

    function formatDate(dateStr) {
        if (!dateStr) return "";
        try {
            const [y, m, d] = dateStr.split("-").map(Number);
            const date = new Date(y, m - 1, d);
            return date.toLocaleDateString($locale === "es" ? "es-ES" : "en-US", { day: "numeric", month: "short", year: "numeric" });
        } catch {
            return dateStr;
        }
    }

    function getLevelClass(level) {
        switch (level) {
            case 1:
                return "bg-emerald-950/70 border border-emerald-500/40 hover:bg-emerald-500";
            case 2:
                return "bg-emerald-700/80 border border-emerald-400/50 hover:bg-emerald-400";
            case 3:
                return "bg-emerald-500 border border-emerald-300 hover:bg-emerald-300";
            case 4:
                return "bg-emerald-400 border border-white/60 hover:bg-white";
            default:
                return "bg-white/[0.04] border border-white/5 hover:bg-white/20";
        }
    }
</script>

<div
    use:animationVisibility
    class="w-full max-w-lg my-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 transition-colors hover:border-white/20"
    role="region"
    aria-label={$t("githubActivity.ariaLabel")}
>
    <!-- Top Header Bar -->
    <div class="flex items-center justify-between mb-3">
        <!-- User Link -->
        <a
            href="https://github.com/pablogozalvez"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/25 transition-colors text-xs text-gray-200"
        >
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span class="font-mono font-medium tracking-tight">pablogozalvez</span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5"></span>
            <IconExternalLink class="w-3 h-3 text-gray-400" />
        </a>

        <!-- Metric counter -->
        <div class="text-right">
            <span class="text-xs font-mono font-bold text-emerald-400">{totalYearContributions}</span>
            <span class="text-[10px] text-gray-400 font-mono ml-1">{$t("githubActivity.commitsPerYear")}</span>
        </div>
    </div>

    <!-- Authentic GitHub Contribution Grid (26 columns x 7 rows = 182 real days / ~6 months) -->
    <div
        class="grid grid-rows-7 grid-flow-col gap-[2px] sm:gap-[2.5px] w-full justify-between py-1 select-none"
        role="group"
        aria-label={$t("githubActivity.gridAriaLabel")}
    >
        {#each days as day, index}
            <button
                type="button"
                class="p-0 w-[7.5px] h-[7.5px] sm:w-[8.5px] sm:h-[8.5px] rounded-[1.5px] transition-colors duration-150 cursor-pointer {getLevelClass(day.l)} focus:outline-none"
                on:mouseenter={() => (hoveredDay = day)}
                on:mouseleave={() => (hoveredDay = null)}
                on:focus={() => { hoveredDay = day; focusedIndex = index; }}
                on:blur={() => (hoveredDay = null)}
                on:keydown={(event) => moveFocus(event, index)}
                on:click={() => { hoveredDay = day; focusedIndex = index; }}
                title={$t("githubActivity.contributionTitle").replace("{{count}}", day.c).replace("{{date}}", day.d)}
                aria-label={$t("githubActivity.contributionTitle").replace("{{count}}", day.c).replace("{{date}}", formatDate(day.d))}
                tabindex={focusedIndex === index ? 0 : -1}
            ></button>
        {/each}
    </div>

    <!-- Bottom Status / Tooltip Bar & Legend -->
    <div class="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
        <!-- Interactive Tooltip or Default Text -->
        <div class="flex items-center gap-1.5 min-w-0">
            {#if hoveredDay}
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <span class="text-white font-semibold truncate">
                    {hoveredDay.c} {hoveredDay.c === 1 ? $t("githubActivity.commit") : $t("githubActivity.commits")}
                </span>
                <span class="text-gray-400 truncate">{$t("githubActivity.on")} {formatDate(hoveredDay.d)}</span>
            {:else}
                <span class="text-gray-400 truncate" title={isLive ? $t("githubActivity.summary") : $t("githubActivity.saved") + " " + formatDate(fallbackDays.at(-1).d)}>{isLive ? $t("githubActivity.summary") : $t("githubActivity.saved")}</span>
            {/if}
        </div>

        <!-- Heatmap Legend -->
        <div class="flex items-center gap-1 shrink-0 ml-2">
            <span class="text-[9px] text-gray-400 mr-0.5">{$t("githubActivity.less")}</span>
            <span class="w-2 h-2 rounded-[1.5px] bg-white/[0.04] border border-white/5"></span>
            <span class="w-2 h-2 rounded-[1.5px] bg-emerald-950/70 border border-emerald-500/40"></span>
            <span class="w-2 h-2 rounded-[1.5px] bg-emerald-700/80 border border-emerald-400/50"></span>
            <span class="w-2 h-2 rounded-[1.5px] bg-emerald-500 border border-emerald-300"></span>
            <span class="w-2 h-2 rounded-[1.5px] bg-emerald-400 border border-white/60"></span>
            <span class="text-[9px] text-gray-400 ml-0.5">{$t("githubActivity.more")}</span>
        </div>
    </div>
</div>


