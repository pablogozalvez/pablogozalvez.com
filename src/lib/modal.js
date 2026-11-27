// showModal aporta aislamiento del fondo y navegación de foco nativos.
export function modal(dialog) {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    dialog.querySelector("[data-modal-title]")?.focus({ preventScroll: true });

    return {
        destroy() {
            dialog.close();
            document.body.style.overflow = previousOverflow;
            if (opener?.isConnected) opener.focus({ preventScroll: true });
        },
    };
}
