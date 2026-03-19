<script>
    import { onMount } from "svelte";
    import { isLowPerformanceMode } from "./actions";

    export let hidden = false;

    let x = -100;
    let y = -100;
    let size = 10;
    let isHovering = false;
    let isClicking = false;
    let isVisible = false;
    let isText = false;
    let isTouchDevice = false;
    let lowPerfMode = false;

    function updateBodyCursor() {
        if (typeof document !== "undefined") {
            if (!hidden && !isText && !isTouchDevice) {
                document.body.classList.add("custom-cursor-active");
            } else {
                document.body.classList.remove("custom-cursor-active");
            }
        }
    }

    $: updateBodyCursor();

    // Shared hover detection logic
    function createHoverHandler(onUpdate) {
        let lastTarget = null;
        let lastResult = { isInput: false, isClickable: false };

        return (e) => {
            const target = e.target;

            if (target === lastTarget) {
                isText = lastResult.isInput;
                if (!lastResult.isInput) {
                    isHovering = lastResult.isClickable;
                    onUpdate();
                }
                updateBodyCursor();
                return;
            }

            lastTarget = target;
            const tagName = target.tagName.toLowerCase();
            const inputEl = tagName === "input" || tagName === "textarea" || target.isContentEditable;

            if (inputEl) {
                isText = true;
                lastResult = { isInput: true, isClickable: false };
                updateBodyCursor();
                return;
            }

            isText = false;
            const clickable = !!target.closest('a, button, [role="button"], label, select, .cursor-pointer');
            lastResult = { isInput: false, isClickable: clickable };
            isHovering = clickable;
            onUpdate();
            updateBodyCursor();
        };
    }

    onMount(() => {
        isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        lowPerfMode = isLowPerformanceMode();

        if (lowPerfMode) {
            // Lightweight mode: direct position updates, CSS transitions handle smoothing
            // No RAF loop, no mix-blend-difference (expensive without GPU)
            const handleMouseMove = (e) => {
                x = e.clientX;
                y = e.clientY;
                isVisible = true;
            };

            const handleMouseDown = () => {
                isClicking = true;
                size = isHovering ? 40 : 6;
            };

            const handleMouseUp = () => {
                isClicking = false;
                size = isHovering ? 50 : 10;
            };

            const handleMouseLeave = () => {
                isVisible = false;
            };
            const handleMouseEnter = () => {
                isVisible = true;
            };

            const handleMouseOver = createHoverHandler(() => {
                if (!isClicking) size = isHovering ? 50 : 10;
            });

            window.addEventListener("mousemove", handleMouseMove, { passive: true });
            window.addEventListener("mousedown", handleMouseDown, { passive: true });
            window.addEventListener("mouseup", handleMouseUp, { passive: true });
            window.addEventListener("mouseover", handleMouseOver, { passive: true });
            document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
            document.addEventListener("mouseenter", handleMouseEnter, { passive: true });

            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mousedown", handleMouseDown);
                window.removeEventListener("mouseup", handleMouseUp);
                window.removeEventListener("mouseover", handleMouseOver);
                document.removeEventListener("mouseleave", handleMouseLeave);
                document.removeEventListener("mouseenter", handleMouseEnter);
                document.body.classList.remove("custom-cursor-active");
            };
        }

        // Full performance mode: RAF lerp for buttery smooth tracking
        let rafId = null;
        let targetX = -100;
        let targetY = -100;
        let targetSize = 10;

        const lerpFactor = 0.2;

        function animate() {
            x += (targetX - x) * lerpFactor;
            y += (targetY - y) * lerpFactor;
            size += (targetSize - size) * lerpFactor;

            if (Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5 || Math.abs(targetSize - size) > 0.5) {
                rafId = requestAnimationFrame(animate);
            } else {
                rafId = null;
            }
        }

        function startAnimation() {
            if (!rafId) {
                rafId = requestAnimationFrame(animate);
            }
        }

        const handleMouseMove = (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            isVisible = true;
            startAnimation();
        };

        const handleMouseDown = () => {
            isClicking = true;
            targetSize = isHovering ? 45 : 8;
            startAnimation();
        };

        const handleMouseUp = () => {
            isClicking = false;
            targetSize = isHovering ? 60 : 10;
            startAnimation();
        };

        const handleMouseLeave = () => {
            isVisible = false;
        };

        const handleMouseEnter = () => {
            isVisible = true;
        };

        const handleMouseOver = createHoverHandler(() => {
            if (!isClicking) {
                targetSize = isHovering ? 60 : 10;
                startAnimation();
            }
        });

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("mousedown", handleMouseDown, { passive: true });
        window.addEventListener("mouseup", handleMouseUp, { passive: true });
        window.addEventListener("mouseover", handleMouseOver, { passive: true });
        document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
        document.addEventListener("mouseenter", handleMouseEnter, { passive: true });

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.body.classList.remove("custom-cursor-active");
        };
    });
</script>

{#if !isTouchDevice}
    <div
        class="cursor-root fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        class:mix-blend-difference={!lowPerfMode}
        class:cursor-low-perf={lowPerfMode}
        class:opacity-0={!isVisible || isText || hidden}
        class:opacity-100={isVisible && !isText && !hidden}
        style="transform: translate3d({x}px, {y}px, 0) translate(-50%, -50%);"
    >
        <!-- Dot center -->
        <div
            class="absolute bg-white rounded-full transition-opacity duration-150"
            class:opacity-5={isHovering}
            style="width: 8px; height: 8px;"
        ></div>

        <!-- Ring -->
        <div
            class="cursor-ring border rounded-full"
            style="
                width: {size}px;
                height: {size}px;
                border-width: {isHovering ? '1.5px' : '2px'};
                border-color: {isHovering ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'};
                background-color: {isHovering ? 'rgba(255,255,255,0.08)' : 'transparent'};
            "
        ></div>
    </div>
{/if}

<style>
    .cursor-root {
        transition: opacity 0.2s ease-out;
        will-change: transform;
    }

    /* Low-perf mode: let CSS handle position smoothing, skip mix-blend-difference */
    .cursor-low-perf {
        transition:
            opacity 0.2s ease-out,
            transform 0.06s linear;
    }

    .cursor-ring {
        transition:
            width 0.2s cubic-bezier(0.22, 1, 0.36, 1),
            height 0.2s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.15s ease,
            background-color 0.15s ease;
    }
</style>
