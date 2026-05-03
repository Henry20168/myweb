import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const body = await req.json();
  const replyText = String(body.body || "").trim();
  if (!replyText) return NextResponse.json({ error: "Reply text required" }, { status: 400 });

  const { id } = await ctx.params;
  const messageId = Number(id);
  if (!messageId || Number.isNaN(messageId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const message = await prisma.contactMessage.findUnique({ where: { id: messageId } });
  if (!message) return NextResponse.json({ error: "Message not found" }, { status: 404 });

  const reply = await prisma.contactReply.create({
    data: {
      messageId: message.id,
      fromAdmin: true,
      body: replyText,
    },
  });

  await prisma.contactMessage.update({
    where: { id: message.id },
    data: { status: "answered" },
  });

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || message.email;

  if (host && user && pass) {
    const company = await prisma.companyInfo.findFirst();

    const companyName = company?.name || "Aalikouch Car";

    const originalCreatedAt = message.createdAt.toISOString();
    const replyCreatedAt = reply.createdAt.toISOString();

    const subject = message.subject ? `Re: ${message.subject}` : `Reply from ${companyName}`;

    const html = `
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <title>${subject}</title>
        </head>
        <body style="margin:0;padding:0;background-color:#050505;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#050505;padding:24px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#111827;border-radius:16px;border:1px solid #1f2937;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.6);">
                  <tr>
                    <td style="padding:24px 32px;border-bottom:1px solid #1f2937;background:linear-gradient(135deg,#000000,#111827);">
                      <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#9ca3af;margin-bottom:8px;">Official response from</div>
                      <div style="font-size:24px;font-weight:700;color:#f9fafb;">${companyName}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px 32px 8px 32px;">
                      <div style="font-size:13px;color:#d1d5db;margin-bottom:8px;">Topic</div>
                      <div style="font-size:18px;font-weight:600;color:#f97373;">${message.subject || "Your recent contact request"}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 32px 8px 32px;">
                      <div style="font-size:13px;color:#9ca3af;margin-bottom:4px;">Your original message</div>
                      <div style="font-size:14px;line-height:1.6;color:#e5e7eb;white-space:pre-line;">${message.body}</div>
                      <div style="font-size:11px;color:#6b7280;margin-top:6px;">Received: ${originalCreatedAt}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 32px 8px 32px;">
                      <div style="font-size:13px;color:#f97373;margin-bottom:4px;">Our reply</div>
                      <div style="font-size:15px;line-height:1.7;color:#f9fafb;white-space:pre-line;">${replyText}</div>
                      <div style="font-size:11px;color:#6b7280;margin-top:6px;">Answered: ${replyCreatedAt}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 32px 24px 32px;">
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td style="font-size:12px;color:#9ca3af;line-height:1.6;">
                            If you have any other questions, simply reply to this email and our team will be happy to assist you.
                          </td>
                          <td align="right" style="white-space:nowrap;">
                            <a href="mailto:${from}" style="display:inline-block;padding:10px 18px;border-radius:999px;background:linear-gradient(135deg,#ef4444,#b91c1c);color:#f9fafb;text-decoration:none;font-size:13px;font-weight:600;box-shadow:0 10px 25px rgba(239,68,68,0.45);">Reply now</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 32px 20px 32px;background-color:#000000;border-top:1px solid #1f2937;">
                      <div style="font-size:10px;color:#6b7280;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    try {
      await transporter.sendMail({
        from,
        to: message.email,
        subject,
        text: replyText,
        html,
      });
    } catch (error) {
      console.error("/api/admin/contact-messages reply mail error", error);
      return NextResponse.json({ ok: false, reply, warning: "Reply saved but email failed." }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, reply });
}
