<script>
    import Hero from "../lib/Hero.svelte";
    import About from "../lib/About.svelte";
    import Projects from "../lib/Projects.svelte";
    import Contact from "../lib/Contact.svelte";
    import Footer from "../lib/Footer.svelte";

    export const hydrate = false;
    export const router = false;

    let showPdfModal = false;
</script>

<Hero />

<main class="bg-[#030712] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
    <About {showPdfModal} on:showPdfModalChange={(e) => (showPdfModal = e.detail)} />
    <Projects />
    <Contact />
</main>

<Footer />
