import { json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { Resend } from "resend";

export const prerender = false;

const MAX_REQUEST_SIZE = 10_000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 3_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    return Boolean(env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL);
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

    try {
        const resend = new Resend(env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
            from: env.CONTACT_FROM_EMAIL,
            to: [env.CONTACT_TO_EMAIL],
            replyTo: email,
            subject: `Nuevo mensaje de ${name}`,
            text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
        });

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
