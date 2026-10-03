export function animationVisibility(element, onChange = () => {}) {
    let inViewport = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
        const active = inViewport && !document.hidden && !reducedMotion.matches;
        element.toggleAttribute("data-animations-paused", !active);
        onChange(active);
    };
    const observer = new IntersectionObserver(([entry]) => {
        inViewport = entry.isIntersecting;
        update();
    });
    update();
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    reducedMotion.addEventListener("change", update);

    return {
        destroy() {
            observer.disconnect();
            document.removeEventListener("visibilitychange", update);
            reducedMotion.removeEventListener("change", update);
            element.removeAttribute("data-animations-paused");
            onChange(false);
        },
    };
}
