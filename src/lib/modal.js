// showModal aporta aislamiento del fondo y navegación de foco nativos.
export function modal(dialog) {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const cursorWasHidden = document.body.classList.contains("hide-global-cursor");
    document.body.style.overflow = "hidden";
    document.body.classList.add("hide-global-cursor");
    dialog.showModal();
    dialog.querySelector("[data-modal-title]")?.focus({ preventScroll: true });

    return {
        destroy() {
            dialog.close();
            document.body.style.overflow = previousOverflow;
            if (!cursorWasHidden) document.body.classList.remove("hide-global-cursor");
            if (opener?.isConnected) opener.focus({ preventScroll: true });
        },
    };
}
