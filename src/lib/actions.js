export function viewport(element) {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const eventName = entry.isIntersecting ? "enterViewport" : "exitViewport";
            element.dispatchEvent(new CustomEvent(eventName));
        });
    });

    observer.observe(element);

    return {
        destroy() {
            observer.unobserve(element);
        },
    };
}
