let _isLowPerformance = null;
export function isLowPerformanceMode() {
    if (_isLowPerformance !== null) return _isLowPerformance;
    if (typeof window === "undefined") return false;

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReducedMotion) {
        _isLowPerformance = true;
        return true;
    }

    const cores = navigator.hardwareConcurrency || 4;
    if (cores <= 2) {
        _isLowPerformance = true;
        return true;
    }

    const memory = navigator.deviceMemory;
    if (memory && memory <= 2) {
        _isLowPerformance = true;
        return true;
    }

    // Detectar si probablemente no hay aceleración por hardware
    // Canvas 2D suele ser lento sin GPU
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) {
            _isLowPerformance = true;
            return true;
        }
        // Verificar si es un renderer de software
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            if (
                renderer.toLowerCase().includes("swiftshader") ||
                renderer.toLowerCase().includes("software") ||
                renderer.toLowerCase().includes("llvmpipe")
            ) {
                _isLowPerformance = true;
                return true;
            }
        }
    } catch (e) {
        // Si falla, asumir que no hay buena aceleración
        _isLowPerformance = true;
        return true;
    }

    _isLowPerformance = false;
    return false;
}

export function resetPerformanceDetection() {
    _isLowPerformance = null;
}

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

export function rafThrottle(fn) {
    let ticking = false;
    return (...args) => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                fn(...args);
                ticking = false;
            });
        }
    };
}
