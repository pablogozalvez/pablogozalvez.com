<script>
    import Hero from "../lib/Hero.svelte";
    import About from "../lib/About.svelte";
    import Projects from "../lib/Projects.svelte";
    import Contact from "../lib/Contact.svelte";
    import Footer from "../lib/Footer.svelte";
    import CvDrawer from "../lib/CvDrawer.svelte";

    export let data;

    export const hydrate = false;
    export const router = false;
</script>

<main id="main-content" tabindex="-1">
    <Hero />
    <Projects />
    <About />
    <Contact turnstileSiteKey={data.turnstileSiteKey} />
</main>

<Footer />
<CvDrawer />
