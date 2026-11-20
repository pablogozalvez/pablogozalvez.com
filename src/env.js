import { defineEnvVars } from "@sveltejs/kit/env";

const optional = { schema: (value) => value };

export const variables = defineEnvVars({
    TURNSTILE_SITE_KEY: { ...optional, static: true },
    TURNSTILE_SECRET_KEY: optional,
    RESEND_API_KEY: optional,
    CONTACT_TO_EMAIL: optional,
    CONTACT_FROM_EMAIL: optional,
});
