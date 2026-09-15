import { json } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import { Resend } from "resend";
import en from "../../../i18n/en.json";
import es from "../../../i18n/es.json";
import { createConfirmationEmail, createOwnerEmail } from "$lib/server/contact-email";

export const prerender = false;

const MAX_REQUEST_SIZE = 10_000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 3_000;
const MAX_TURNSTILE_TOKEN_LENGTH = 2_048;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TRANSLATIONS = { en, es };
const TURNSTILE_ACTION = "contact";
const TURNSTILE_SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TEST_SECRET_KEYS = new Set([
    "1x0000000000000000000000000000000AA",
    "2x0000000000000000000000000000000AA",
    "3x0000000000000000000000000000000AA",
]);

function getSingleLineText(value) {
    return typeof value === "string" ? value.replace(/[\r\n]+/g, " ").trim() : "";
}

function getMessageText(value) {
    return typeof value === "string" ? value.replace(/\r\n?/g, "\n").trim() : "";
}

function isSameOrigin(request, url) {
    const origin = request.headers.get("origin");
    return !origin || origin === url.origin;
}

function isConfigured() {
    return Boolean(
        env.RESEND_API_KEY &&
            env.CONTACT_TO_EMAIL &&
            env.CONTACT_FROM_EMAIL &&
            env.TURNSTILE_SITE_KEY &&
            env.TURNSTILE_SECRET_KEY,
    );
}

async function verifyTurnstile(token, expectedHostname) {
    if (typeof token !== "string" || !token || token.length > MAX_TURNSTILE_TOKEN_LENGTH) {
        return { isAvailable: true, isValid: false };
    }

    const body = new FormData();
    body.append("secret", env.TURNSTILE_SECRET_KEY);
    body.append("response", token);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8_000);

    try {
        const response = await fetch(TURNSTILE_SITEVERIFY_URL, {
            method: "POST",
            body,
            signal: controller.signal,
        });

        if (!response.ok) return { isAvailable: false, isValid: false };

        const result = await response.json();
        const isDevelopmentTest = dev && TURNSTILE_TEST_SECRET_KEYS.has(env.TURNSTILE_SECRET_KEY);
        const hasExpectedMetadata =
            isDevelopmentTest || (result.action === TURNSTILE_ACTION && result.hostname === expectedHostname);

        return {
            isAvailable: true,
            isValid: result.success === true && hasExpectedMetadata,
        };
    } catch (error) {
        console.error(
            "La validación de Turnstile ha fallado.",
            error instanceof Error ? error.name : "Error desconocido",
        );
        return { isAvailable: false, isValid: false };
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function POST({ request, url }) {
    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_SIZE) {
        return json({ error: "invalid" }, { status: 413 });
    }

    if (!isSameOrigin(request, url)) {
        return json({ error: "invalid" }, { status: 403 });
    }

    let payload;
    try {
        payload = await request.json();
    } catch {
        return json({ error: "invalid" }, { status: 400 });
    }

    // Los bots suelen completar este campo que permanece oculto para personas.
    if (getSingleLineText(payload.website)) {
        return json({ success: true });
    }

    const name = getSingleLineText(payload.name);
    const email = getSingleLineText(payload.email);
    const message = getMessageText(payload.message);
    const locale = payload.locale === "es" ? "es" : "en";

    if (
        !name ||
        name.length > MAX_NAME_LENGTH ||
        !EMAIL_PATTERN.test(email) ||
        email.length > MAX_EMAIL_LENGTH ||
        message.length < 10 ||
        message.length > MAX_MESSAGE_LENGTH
    ) {
        return json({ error: "invalid" }, { status: 400 });
    }

    if (!isConfigured()) {
        console.error("El formulario de contacto no tiene configuradas sus variables de entorno.");
        return json({ error: "unavailable" }, { status: 503 });
    }

    const turnstile = await verifyTurnstile(payload.turnstileToken, url.hostname);
    if (!turnstile.isAvailable) {
        return json({ error: "unavailable" }, { status: 503 });
    }
    if (!turnstile.isValid) {
        return json({ error: "verification" }, { status: 400 });
    }

    try {
        const resend = new Resend(env.RESEND_API_KEY);
        const copy = TRANSLATIONS[locale].contact.emails;
        const ownerEmail = createOwnerEmail(copy, locale, { name, email, message });
        const confirmationEmail = createConfirmationEmail(copy, locale, { name });
        const { error } = await resend.batch.send([
            {
                from: env.CONTACT_FROM_EMAIL,
                to: [env.CONTACT_TO_EMAIL],
                replyTo: email,
                ...ownerEmail,
            },
            {
                from: env.CONTACT_FROM_EMAIL,
                to: [email],
                ...confirmationEmail,
            },
        ]);

        if (error) {
            console.error("Resend no ha podido enviar el formulario de contacto.", error.name);
            return json({ error: "unavailable" }, { status: 502 });
        }
    } catch (error) {
        console.error("La petición a Resend ha fallado.", error instanceof Error ? error.name : "Error desconocido");
        return json({ error: "unavailable" }, { status: 502 });
    }

    return json({ success: true });
}
