const SITE_URL = "https://www.pablogozalvez.com";

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function renderTemplate(template, values) {
    return Object.entries(values).reduce(
        (text, [key, value]) => text.replaceAll(`{{${key}}}`, value),
        template,
    );
}

function renderMultiline(value) {
    return escapeHtml(value).replaceAll("\n", "<br>");
}

function renderLayout({ locale, copy, preheader, eyebrow, title, content }) {
    return `<!doctype html>
<html lang="${locale}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;color:#111827;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f4f6;">
        <tr>
            <td align="center" style="padding:40px 16px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden;box-shadow:0 12px 30px rgba(17,24,39,0.08);">
                    <tr>
                        <td style="padding:24px 32px;background:#0b0d12;border-bottom:3px solid #6366f1;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="vertical-align:middle;">
                                        <span style="display:inline-block;padding:8px 10px;border:1px solid #343845;border-radius:10px;color:#ffffff;font-size:15px;font-weight:800;letter-spacing:-0.5px;">PG.</span>
                                    </td>
                                    <td align="right" style="vertical-align:middle;color:#9ca3af;font-size:12px;letter-spacing:0.4px;">${escapeHtml(copy.website)}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:40px 32px 36px;">
                            <div style="margin-bottom:14px;color:#4f46e5;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">${escapeHtml(eyebrow)}</div>
                            <h1 style="margin:0 0 22px;color:#111827;font-size:28px;line-height:1.25;letter-spacing:-0.6px;">${escapeHtml(title)}</h1>
                            ${content}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:22px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.6;">
                            <strong style="color:#374151;">${escapeHtml(copy.brand)}</strong><br>
                            ${escapeHtml(copy.role)}<br>
                            <a href="${SITE_URL}" style="color:#4f46e5;text-decoration:none;">${escapeHtml(copy.website)}</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

export function createOwnerEmail(copy, locale, { name, email, message }) {
    const owner = copy.owner;
    const title = renderTemplate(owner.title, { name });
    const content = `
        <p style="margin:0 0 26px;color:#4b5563;font-size:15px;line-height:1.7;">${escapeHtml(owner.intro)}</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;">
            <tr>
                <td style="padding:18px 20px;border-bottom:1px solid #e5e7eb;">
                    <div style="margin-bottom:5px;color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">${escapeHtml(owner.nameLabel)}</div>
                    <div style="color:#111827;font-size:15px;font-weight:600;">${escapeHtml(name)}</div>
                </td>
            </tr>
            <tr>
                <td style="padding:18px 20px;">
                    <div style="margin-bottom:5px;color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">${escapeHtml(owner.emailLabel)}</div>
                    <a href="mailto:${escapeHtml(email)}" style="color:#4f46e5;font-size:15px;text-decoration:none;">${escapeHtml(email)}</a>
                </td>
            </tr>
        </table>
        <div style="margin-bottom:8px;color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">${escapeHtml(owner.messageLabel)}</div>
        <div style="margin-bottom:28px;padding:20px;background:#111827;border-radius:14px;color:#f3f4f6;font-size:15px;line-height:1.7;">${renderMultiline(message)}</div>
        <a href="mailto:${escapeHtml(email)}" style="display:inline-block;padding:13px 20px;background:#4f46e5;border-radius:10px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">${escapeHtml(renderTemplate(owner.replyAction, { name }))}</a>`;

    return {
        subject: renderTemplate(owner.subject, { name }),
        text: `${title}\n\n${owner.nameLabel}: ${name}\n${owner.emailLabel}: ${email}\n\n${owner.messageLabel}:\n${message}`,
        html: renderLayout({
            locale,
            copy,
            preheader: renderTemplate(owner.preheader, { name }),
            eyebrow: owner.eyebrow,
            title,
            content,
        }),
    };
}

export function createConfirmationEmail(copy, locale, { name }) {
    const confirmation = copy.confirmation;
    const title = renderTemplate(confirmation.title, { name });
    const content = `
        <p style="margin:0 0 26px;color:#4b5563;font-size:15px;line-height:1.7;">${escapeHtml(confirmation.intro)}</p>
        <div style="margin-bottom:24px;padding:20px;background:#eef2ff;border:1px solid #c7d2fe;border-radius:14px;">
            <div style="margin-bottom:7px;color:#3730a3;font-size:14px;font-weight:700;">${escapeHtml(confirmation.nextTitle)}</div>
            <div style="color:#4338ca;font-size:14px;line-height:1.65;">${escapeHtml(confirmation.nextBody)}</div>
        </div>
        <div style="margin-bottom:28px;padding:16px 18px;background:#f9fafb;border-left:3px solid #9ca3af;color:#6b7280;font-size:12px;line-height:1.6;">
            <strong style="display:block;margin-bottom:3px;color:#4b5563;">${escapeHtml(confirmation.noReplyTitle)}</strong>
            ${escapeHtml(confirmation.noReplyBody)}
        </div>
        <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;">${escapeHtml(confirmation.signOff)}<br><strong style="color:#111827;">${escapeHtml(copy.brand)}</strong></p>`;

    return {
        subject: confirmation.subject,
        text: `${title}\n\n${confirmation.intro}\n\n${confirmation.nextTitle}\n${confirmation.nextBody}\n\n${confirmation.noReplyTitle}: ${confirmation.noReplyBody}\n\n${confirmation.signOff}\n${copy.brand}`,
        html: renderLayout({
            locale,
            copy,
            preheader: confirmation.preheader,
            eyebrow: confirmation.eyebrow,
            title,
            content,
        }),
    };
}
