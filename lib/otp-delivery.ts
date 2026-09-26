/**
 * Production OTP delivery for Vercel.
 * Vercel does not send SMS or email itself — set provider keys in the project env.
 *
 * Phone is the login identifier (BRD sec. 12). The imported membership file has
 * no emails, so SMS is the real channel. Email is a bonus when a record has one.
 */

function toNigeriaInternational(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 11) return `234${digits.slice(1)}`;
  if (digits.startsWith("234") && digits.length === 13) return digits;
  return digits;
}

async function sendTermiiSms(phone: string, code: string) {
  const apiKey = process.env.TERMII_API_KEY?.trim();
  const sender = process.env.TERMII_SENDER_ID?.trim();
  if (!apiKey || !sender) return false;

  const res = await fetch("https://api.ng.termii.com/api/sms/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      to: toNigeriaInternational(phone),
      from: sender,
      sms: `AYF Lagos sign-in code: ${code}. Expires in 10 minutes. Do not share it.`,
      type: "plain",
      channel: "generic",
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[otp-delivery] Termii rejected the send", res.status, body.slice(0, 200));
    return false;
  }
  return true;
}

async function sendResendEmail(email: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your AYF Lagos sign-in code",
      text: `Your AYF Lagos sign-in code is ${code}. It expires in 10 minutes. Do not share it.`,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[otp-delivery] Resend rejected the send", res.status, body.slice(0, 200));
    return false;
  }
  return true;
}

export async function deliverMemberOtp(opts: { phone: string; email: string | null; code: string }) {
  const localDev = process.env.NODE_ENV !== "production" && !process.env.VERCEL;
  if (localDev) {
    console.info(`[member-otp] ${opts.phone} → ${opts.code} (dev only; never logged on Vercel)`);
  }

  const sent: string[] = [];
  try {
    if (await sendTermiiSms(opts.phone, opts.code)) sent.push("sms");
  } catch (err) {
    console.error("[otp-delivery] SMS failed", err);
  }
  if (opts.email) {
    try {
      if (await sendResendEmail(opts.email, opts.code)) sent.push("email");
    } catch (err) {
      console.error("[otp-delivery] Email failed", err);
    }
  }

  if (sent.length === 0 && !localDev) {
    console.error(
      "[otp-delivery] OTP issued but no channel delivered it. Set TERMII_API_KEY + TERMII_SENDER_ID on Vercel (SMS), and/or RESEND_API_KEY + EMAIL_FROM for members who have email."
    );
  }

  return sent;
}
