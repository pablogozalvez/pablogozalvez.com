export function viewport(element, options = {}) {
    if (typeof IntersectionObserver === "undefined") return;

    const { threshold = 0.1, rootMargin = "0px" } = options;
    let hasEntered = false;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasEntered) {
                    hasEntered = true;
                    element.dispatchEvent(new CustomEvent("enterViewport"));
                } else if (!entry.isIntersecting && hasEntered) {
                    hasEntered = false;
                    element.dispatchEvent(new CustomEvent("exitViewport"));
                }
            });
        },
        { threshold, rootMargin },
    );

    observer.observe(element);

    return {
        destroy() {
            observer.unobserve(element);
        },
    };
}

export function debounce(fn, delay = 16) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

let _revealObserver = null;
const _revealCallbacks = new WeakMap();

function getRevealObserver() {
    if (_revealObserver) return _revealObserver;
    _revealObserver = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const cb = _revealCallbacks.get(entry.target);
                    if (cb) cb();
                }
            }
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    return _revealObserver;
}

export function reveal(element) {
    // El HTML es visible de partida. Solo se prepara el reveal fuera de pantalla.
    const rect = element.getBoundingClientRect();
    if (typeof IntersectionObserver === "undefined" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        (rect.top < window.innerHeight && rect.bottom > 0)) return;

    const observer = getRevealObserver();
    element.dataset.revealPending = "";
    const finish = (animate = true) => {
        delete element.dataset.revealPending;
        if (animate) element.dataset.revealed = "";
        observer.unobserve(element);
        _revealCallbacks.delete(element);
        element.removeEventListener("focusin", handleFocus);
    };
    const handleFocus = () => finish(false);
    element.addEventListener("focusin", handleFocus);
    _revealCallbacks.set(element, finish);
    observer.observe(element);

    return {
        destroy() {
            observer.unobserve(element);
            _revealCallbacks.delete(element);
            element.removeEventListener("focusin", handleFocus);
            delete element.dataset.revealPending;
        },
    };
}
