// El plazo incluye descargar y leer el cuerpo. No se reintentan envíos POST.
export async function fetchJson(url, { timeoutMs = 8000, signal, ...options } = {}) {
    const controller = new AbortController();
    const cancel = () => controller.abort(signal.reason);
    if (signal?.aborted) cancel();
    else signal?.addEventListener("abort", cancel, { once: true });
    const timer = setTimeout(() => controller.abort(new DOMException("Request timed out", "TimeoutError")), timeoutMs);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        const data = await response.json();
        return { ok: response.ok, status: response.status, data };
    } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", cancel);
    }
}
