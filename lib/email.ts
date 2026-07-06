import nodemailer from 'nodemailer'

type ActivationEmailInput = {
  to: string
  name: string
  activationLink: string
}

export async function sendActivationEmail({ to, name, activationLink }: ActivationEmailInput) {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  if (!host || !user || !pass) {
    return { sent: false, reason: 'smtp_not_configured' }
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  })

  await transporter.sendMail({
    from: `"Mindera" <${user}>`,
    to,
    subject: 'Mindera account aktivatsiyasi',
    text: [
      `Salom, ${name}!`,
      '',
      "Mindera account parolini yaratish uchun quyidagi havolani oching:",
      activationLink,
      '',
      "Agar bu so'rovni siz yubormagan bo'lsangiz, xabarni e'tiborsiz qoldiring.",
    ].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#202020">
        <h1 style="margin:0 0 12px">Salom, ${escapeHtml(name)}!</h1>
        <p>Mindera account parolini yaratish uchun tugmani bosing.</p>
        <p style="margin:24px 0">
          <a href="${activationLink}" style="display:inline-block;background:#ffc329;color:#202020;padding:14px 22px;border-radius:12px;font-weight:700;text-decoration:none">
            Accountni faollashtirish
          </a>
        </p>
        <p>Havola ochilmasa, quyidagi manzilni brauzerga kiriting:</p>
        <p style="word-break:break-all">${activationLink}</p>
      </div>
    `,
  })

  return { sent: true, reason: 'sent' }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
