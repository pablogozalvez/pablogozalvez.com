import adapter from "@sveltejs/adapter-auto";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

export default {
    plugins: [
        sveltekit({ adapter: adapter(), preprocess: vitePreprocess() }),
        tailwindcss(),
    ],
};
