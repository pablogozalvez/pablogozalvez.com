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
            if (!hidden && !isText && !isTouchDevice && !lowPerfMode) {
                document.body.classList.add("custom-cursor-active");
            } else {
                document.body.classList.remove("custom-cursor-active");
            }
        }
    }

    $: updateBodyCursor();

    onMount(() => {
        // Detectar dispositivos táctiles
        isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        lowPerfMode = isLowPerformanceMode();

        // Si es touch o bajo rendimiento, no activar cursor custom
        if (isTouchDevice || lowPerfMode) return;

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

        // Cachear el último elemento verificado para evitar recálculos
        let lastTarget = null;
        let lastTargetResult = { isInput: false, isClickable: false };

        const handleMouseOver = (e) => {
            const target = e.target;

            // Evitar recalcular si es el mismo elemento
            if (target === lastTarget) {
                isText = lastTargetResult.isInput;
                if (!lastTargetResult.isInput) {
                    isHovering = lastTargetResult.isClickable;
                    if (!isClicking) {
                        targetSize = isHovering ? 60 : 10;
                        startAnimation();
                    }
                }
                updateBodyCursor();
                return;
            }

            lastTarget = target;
            const tagName = target.tagName.toLowerCase();
            const isInput = tagName === "input" || tagName === "textarea" || target.isContentEditable;

            if (isInput) {
                isText = true;
                lastTargetResult = { isInput: true, isClickable: false };
                updateBodyCursor();
                return;
            }

            isText = false;
            const clickableElement = target.closest('a, button, [role="button"], label, select, .cursor-pointer');
            const isClickable = !!clickableElement;

            lastTargetResult = { isInput: false, isClickable };
            isHovering = isClickable;
            if (!isClicking) {
                targetSize = isHovering ? 60 : 10;
                startAnimation();
            }
            updateBodyCursor();
        };

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

{#if !isTouchDevice && !lowPerfMode}
    <div
        class="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
        class:opacity-5={!isVisible || isText || hidden}
        class:opacity-100={isVisible && !isText && !hidden}
        style="
        transform: translate3d({x}px, {y}px, 0) translate(-50%, -50%);
        transition: opacity 0.2s ease-out;
    "
    >
        <div class="absolute bg-white rounded-full" class:opacity-5={isHovering} style="width: 8px; height: 8px;"></div>

        <div
            class="border rounded-full"
            style="
            width: {size}px; 
            height: {size}px;
            border-width: {isHovering ? '1.5px' : '2px'};
            border-color: {isHovering ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'};
            background-color: {isHovering ? 'rgba(255,255,255,0.1)' : 'transparent'};
        "
        ></div>
    </div>
{/if}
