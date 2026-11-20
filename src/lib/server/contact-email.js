const SITE_URL = "https://www.pablogozalvez.com";

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function withName(template, name) {
    return template.replaceAll("{{name}}", () => name);
}

function renderLayout({ locale, website, subject, preheader, title, content }) {
    return `<!doctype html>
<html lang="${locale}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;background:#f5f5f7;color:#17171c;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f5f7;">
        <tr>
            <td align="center" style="padding:28px 12px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:540px;background:#ffffff;border:1px solid #e4e4e9;border-radius:12px;">
                    <tr>
                        <td style="padding:28px 24px 24px;font-size:16px;line-height:1.6;overflow-wrap:anywhere;">
                            <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;">${escapeHtml(title)}</h1>
                            ${content}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:14px 24px;border-top:1px solid #e4e4e9;font-size:13px;line-height:1.5;">
                            <a href="${SITE_URL}" style="color:#5145a6;text-decoration:underline;">${escapeHtml(website)}</a>
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
    const { owner, website } = copy;
    const subject = withName(owner.subject, name);
    const replyUrl = `mailto:${encodeURIComponent(email).replace("%40", "@")}`;
    const content = `
        <p style="margin:0 0 18px;color:#575762;font-size:14px;">${escapeHtml(email)}</p>
        <div style="margin:0 0 22px;padding-left:14px;border-left:2px solid #c9c2ee;">${escapeHtml(message).replaceAll("\n", "<br>")}</div>
        <p style="margin:0;"><a href="${replyUrl}" style="color:#5145a6;text-decoration:underline;">${escapeHtml(owner.replyAction)}</a></p>`;

    return {
        subject,
        text: `${subject}\n${email}\n\n${message}\n\n${website}`,
        html: renderLayout({
            locale,
            website,
            subject,
            preheader: owner.preheader,
            title: subject,
            content,
        }),
    };
}

export function createConfirmationEmail(copy, locale, { name }) {
    const { confirmation, brand, website } = copy;
    const greeting = withName(confirmation.greeting, name);
    const content = `
        <p style="margin:0 0 16px;">${escapeHtml(confirmation.body)}</p>
        <p style="margin:0 0 18px;">${escapeHtml(confirmation.signOff)}<br><strong>${escapeHtml(brand)}</strong></p>
        <p style="margin:0;color:#575762;font-size:13px;">${escapeHtml(confirmation.note)}</p>`;

    return {
        subject: confirmation.subject,
        text: [greeting, confirmation.body, `${confirmation.signOff}\n${brand}`, confirmation.note, website].join("\n\n"),
        html: renderLayout({
            locale,
            website,
            subject: confirmation.subject,
            preheader: confirmation.body,
            title: greeting,
            content,
        }),
    };
}
