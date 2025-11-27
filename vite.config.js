import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";

export default {
    plugins: [
        sveltekit(),
        tailwindcss(),
        obfuscatorPlugin({
            enabled: process.env.NODE_ENV === "production",
            obfuscatorOptions: {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.8,
                numbersToExpressions: true,
                simplify: true,
                stringArray: true,
                stringArrayThreshold: 0.75,
                stringArrayEncoding: ["rc4"],
                splitStrings: true,
                splitStringsChunkLength: 5,
                transformObjectKeys: true,
                renameGlobals: false,
            },
        }),
    ],
};
