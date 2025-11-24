<script>
    import { onMount } from "svelte";
    import { spring } from "svelte/motion";

    // Configuración del movimiento
    let coords = spring(
        { x: -50, y: -50 },
        {
            stiffness: 0.1,
            damping: 0.25,
        }
    );

    // Configuración del tamaño
    let size = spring(12, {
        stiffness: 0.15,
        damping: 0.3,
    });

    // Estados
    let isHovering = false;
    let isClicking = false;
    let isVisible = false;
    let isText = false;

    onMount(() => {
        const handleMouseMove = (e) => {
            coords.set({ x: e.clientX, y: e.clientY });
            isVisible = true;
        };

        const handleMouseDown = () => {
            isClicking = true;
            size.set(isHovering ? 50 : 10); // Efecto visual al clickar
        };

        const handleMouseUp = () => {
            isClicking = false;
            size.set(isHovering ? 64 : 12); // Restaurar tamaño
        };

        const handleMouseLeave = () => {
            isVisible = false;
        };

        const handleMouseEnter = () => {
            isVisible = true;
        };

        const handleMouseOver = (e) => {
            const target = e.target;

            // 1. Detección de Inputs / Texto
            const tagName = target.tagName.toLowerCase();
            const isInput = tagName === "input" || tagName === "textarea" || target.isContentEditable;

            if (isInput) {
                isText = true;
                isHovering = false;
                size.set(12);
                return;
            }

            isText = false;

            // 2. Detección MEJORADA de elementos clicables
            // Usamos .closest() para ver si el elemento O alguno de sus padres es interactivo
            const clickableElement = target.closest('a, button, [role="button"], label, select');

            // También comprobamos el estilo computado por si es un div con cursor: pointer
            const style = window.getComputedStyle(target);
            const hasPointerCursor = style.cursor === "pointer";

            if (clickableElement || hasPointerCursor) {
                isHovering = true;
                if (!isClicking) size.set(64); // Círculo grande
            } else {
                isHovering = false;
                if (!isClicking) size.set(12); // Punto normal
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        // Usamos mouseover en window para delegación global
        window.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    });
</script>

<div
    class="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center will-change-transform"
    class:opacity-0={!isVisible || isText}
    class:opacity-100={isVisible && !isText}
    style="
        transform: translate3d({$coords.x}px, {$coords.y}px, 0) translate(-50%, -50%); 
        transition: opacity 0.3s ease;
    "
>
    <div class="bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" style="width: 8px; height: 8px;"></div>

    <div
        class="absolute border border-white/30 rounded-full transition-all duration-300 ease-out"
        style="
            width: {$size}px; 
            height: {$size}px; 
            opacity: {isHovering ? 1 : 0.5};
            border-width: {isHovering ? 2 : 1}px;
            background: {isHovering ? 'rgba(255,255,255,0.05)' : 'transparent'};
            backdrop-filter: {isHovering ? 'blur(2px)' : 'none'};
        "
    ></div>
</div>

<style>
    @media (hover: hover) and (pointer: fine) {
        :global(body) {
            cursor: none;
        }
        :global(input),
        :global(textarea),
        :global([contenteditable]) {
            cursor: text;
        }
    }
    @media (hover: none) {
        :global(body) {
            cursor: auto;
        }
        div.fixed {
            display: none;
        }
    }
</style>
