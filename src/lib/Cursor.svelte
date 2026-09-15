<script>
    import { onMount } from "svelte";
    import { isLowPerformanceMode } from "./actions";

    export let hidden = false;

    let cursorRoot;
    let cursorRing;
    let isHovering = false;
    let isClicking = false;
    let isVisible = false;
    let usesNativeCursor = false;
    let isTouchDevice = false;
    let cursorDisabled = false;
    let externalHideToggle = false;

    function updateBodyCursor() {
        if (typeof document === "undefined") return;

        const shouldUseCustomCursor =
            !cursorDisabled &&
            !isTouchDevice &&
            !hidden &&
            !externalHideToggle &&
            !usesNativeCursor &&
            isVisible;

        document.body.classList.toggle("custom-cursor-active", shouldUseCustomCursor);
    }

    $: updateBodyCursor();

    onMount(() => {
        isTouchDevice = window.matchMedia?.("(pointer: coarse)")?.matches || navigator.maxTouchPoints > 0;
        cursorDisabled = isTouchDevice || isLowPerformanceMode();
        updateBodyCursor();

        if (cursorDisabled) {
            return () => document.body.classList.remove("custom-cursor-active");
        }

        let animationFrame = null;
        let currentX = -100;
        let currentY = -100;
        let currentScale = 1;
        let targetX = -100;
        let targetY = -100;
        let targetScale = 1;
        let hasPosition = false;
        let lastTarget = null;

        const renderCursor = () => {
            if (!cursorRoot || !cursorRing) return;
            cursorRoot.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
            cursorRing.style.transform = `scale(${currentScale})`;
        };

        const animate = () => {
            currentX += (targetX - currentX) * 0.28;
            currentY += (targetY - currentY) * 0.28;
            currentScale += (targetScale - currentScale) * 0.24;
            renderCursor();

            const isMoving =
                Math.abs(targetX - currentX) > 0.2 ||
                Math.abs(targetY - currentY) > 0.2 ||
                Math.abs(targetScale - currentScale) > 0.01;

            animationFrame = isMoving ? requestAnimationFrame(animate) : null;
        };

        const startAnimation = () => {
            if (animationFrame === null) animationFrame = requestAnimationFrame(animate);
        };

        const setInteractionTarget = (target) => {
            if (!(target instanceof Element) || target === lastTarget) return;
            lastTarget = target;

            const nativeSurface = target.closest("[data-native-cursor], iframe, embed, object");
            const textSurface = target.closest('input:not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]');
            const nextUsesNativeCursor = Boolean(nativeSurface || textSurface);
            const nextIsHovering =
                !nextUsesNativeCursor &&
                Boolean(target.closest('a, button, [role="button"], label, select, .cursor-pointer'));

            if (usesNativeCursor !== nextUsesNativeCursor) usesNativeCursor = nextUsesNativeCursor;
            if (isHovering !== nextIsHovering) isHovering = nextIsHovering;
            if (!isClicking) targetScale = isHovering ? 3.5 : 1;

            updateBodyCursor();
            startAnimation();
        };

        const handlePointerMove = (event) => {
            targetX = event.clientX;
            targetY = event.clientY;

            if (!hasPosition) {
                currentX = targetX;
                currentY = targetY;
                hasPosition = true;
                renderCursor();
            }

            if (!isVisible) isVisible = true;
            setInteractionTarget(event.target);
            updateBodyCursor();
            startAnimation();
        };

        const handlePointerDown = () => {
            isClicking = true;
            targetScale = isHovering ? 2.8 : 0.72;
            startAnimation();
        };

        const handlePointerUp = () => {
            isClicking = false;
            targetScale = isHovering ? 3.5 : 1;
            startAnimation();
        };

        const handlePointerOver = (event) => setInteractionTarget(event.target);
        const handleDocumentLeave = () => {
            isVisible = false;
            updateBodyCursor();
        };
        const handleDocumentEnter = () => {
            isVisible = hasPosition;
            updateBodyCursor();
        };
        const handleVisibilityChange = () => {
            if (document.hidden) handleDocumentLeave();
        };

        const observer = new MutationObserver(() => {
            const isHiddenNow = document.body.classList.contains("hide-global-cursor");
            if (externalHideToggle !== isHiddenNow) {
                externalHideToggle = isHiddenNow;
                updateBodyCursor();
            }
        });

        observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerdown", handlePointerDown, { passive: true });
        window.addEventListener("pointerup", handlePointerUp, { passive: true });
        window.addEventListener("pointerover", handlePointerOver, { passive: true });
        document.addEventListener("mouseleave", handleDocumentLeave, { passive: true });
        document.addEventListener("mouseenter", handleDocumentEnter, { passive: true });
        document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });

        return () => {
            if (animationFrame !== null) cancelAnimationFrame(animationFrame);
            observer.disconnect();
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointerover", handlePointerOver);
            document.removeEventListener("mouseleave", handleDocumentLeave);
            document.removeEventListener("mouseenter", handleDocumentEnter);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.body.classList.remove("custom-cursor-active");
        };
    });
</script>

{#if !cursorDisabled && !isTouchDevice}
    <div
        bind:this={cursorRoot}
        class="cursor-root fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
        class:opacity-0={!isVisible || usesNativeCursor || hidden || externalHideToggle}
        class:opacity-100={isVisible && !usesNativeCursor && !hidden && !externalHideToggle}
        aria-hidden="true"
    >
        <div class="cursor-dot absolute bg-white rounded-full" class:cursor-dot-hover={isHovering}></div>
        <div
            bind:this={cursorRing}
            class="cursor-ring border border-white/50 rounded-full"
            class:cursor-ring-hover={isHovering}
            class:cursor-ring-clicking={isClicking}
        ></div>
    </div>
{/if}

<style>
    :global(body.custom-cursor-active),
    :global(body.custom-cursor-active *) {
        cursor: none !important;
    }

    .cursor-root {
        transition: opacity 140ms ease-out;
        will-change: transform;
    }

    .cursor-dot {
        width: 3px;
        height: 3px;
        transition: opacity 140ms ease-out;
    }

    .cursor-dot-hover {
        opacity: 0.55;
    }

    .cursor-ring {
        width: 12px;
        height: 12px;
        background: transparent;
        transform: scale(1);
        transition:
            border-color 140ms ease-out,
            background-color 140ms ease-out,
            opacity 140ms ease-out;
        will-change: transform;
    }

    .cursor-ring-hover {
        border-color: rgba(255, 255, 255, 0.82);
        background-color: rgba(255, 255, 255, 0.09);
    }

    .cursor-ring-clicking {
        border-color: rgba(255, 255, 255, 0.95);
    }
</style>
