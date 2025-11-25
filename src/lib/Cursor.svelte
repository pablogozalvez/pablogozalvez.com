<script>
    import { onMount } from "svelte";
    import { spring } from "svelte/motion";

    export let hidden = false;

    let coords = spring(
        { x: -100, y: -100 },
        {
            stiffness: 0.15,
            damping: 0.35,
        }
    );

    let size = spring(10, {
        stiffness: 0.1,
        damping: 0.25,
    });

    // Estados
    let isHovering = false;
    let isClicking = false;
    let isVisible = false;
    let isText = false;

    function updateBodyCursor() {
        if (typeof document !== "undefined") {
            if (!hidden && !isText) {
                document.body.classList.add("custom-cursor-active");
            } else {
                document.body.classList.remove("custom-cursor-active");
            }
        }
    }

    $: updateBodyCursor();

    onMount(() => {
        const handleMouseMove = (e) => {
            coords.set({ x: e.clientX, y: e.clientY });
            isVisible = true; // Asegurar visibilidad al mover
        };

        const handleMouseDown = () => {
            isClicking = true;
            size.set(isHovering ? 45 : 8); // Efecto de "presión"
        };

        const handleMouseUp = () => {
            isClicking = false;
            size.set(isHovering ? 60 : 10); // Restaurar tamaño
        };

        // Fade Out al salir de la ventana
        const handleMouseLeave = () => {
            isVisible = false;
        };

        // Fade In al entrar
        const handleMouseEnter = () => {
            isVisible = true;
        };

        const handleMouseOver = (e) => {
            const target = e.target;

            // Detección de Inputs (Cursor nativo)
            const tagName = target.tagName.toLowerCase();
            const isInput = tagName === "input" || tagName === "textarea" || target.isContentEditable;

            if (isInput) {
                isText = true;
                updateBodyCursor();
                return;
            }
            isText = false;
            updateBodyCursor();

            // Detección de elementos interactivos
            const clickableElement = target.closest('a, button, [role="button"], label, select, .cursor-pointer');
            const style = window.getComputedStyle(target);

            if (clickableElement || style.cursor === "pointer") {
                isHovering = true;
                if (!isClicking) size.set(60); // Círculo grande magnético
            } else {
                isHovering = false;
                if (!isClicking) size.set(10); // Punto normal
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
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
            document.body.classList.remove("custom-cursor-active");
        };
    });
</script>

<div
    class="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center will-change-transform"
    class:opacity-5={!isVisible || isText || hidden}
    class:opacity-100={isVisible && !isText && !hidden}
    style="
        transform: translate3d({$coords.x}px, {$coords.y}px, 0) translate(-50%, -50%);
        transition: opacity 0.4s cubic-bezier(.4,0,.2,1);
    "
>
    <div
        class="absolute bg-white rounded-full transition-all duration-300 ease-out"
        class:opacity-5={isHovering}
        style="width: 8px; height: 8px;"
    ></div>

    <div
        class="border rounded-full transition-colors duration-300"
        style="
            width: {$size}px; 
            height: {$size}px;
            border-width: {isHovering ? '1.5px' : '2px'};
            border-color: {isHovering ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'};
            background-color: {isHovering ? 'rgba(255,255,255,0.1)' : 'transparent'};
            backdrop-filter: {isHovering ? 'blur(1px)' : 'none'};
        "
    ></div>
</div>

<style>
    /* Ocultar cursor nativo solo si el cursor custom está visible */
    @media (hover: hover) and (pointer: fine) {
        :global(body.custom-cursor-active) {
            cursor: none;
        }
        :global(input),
        :global(textarea),
        :global([contenteditable]) {
            cursor: text;
        }
    }
    @media (hover: none) {
        div.fixed {
            display: none;
        }
        :global(body) {
            cursor: auto;
        }
    }
</style>
