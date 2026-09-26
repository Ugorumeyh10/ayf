import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { checkRateLimit } from "./rate-limit";
import { deliverMemberOtp } from "./otp-delivery";

function normalizePhone(phone: string) {
  return phone.trim().replace(/\s+/g, "");
}

export async function issueMemberOtp(phone: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const normalized = normalizePhone(phone);
  if (!/^0\d{10}$/.test(normalized)) {
    return { ok: false, message: "Enter an 11-digit Nigerian number starting with 0." };
  }

  const { success } = await checkRateLimit(`member-otp:${normalized}`);
  if (!success) return { ok: false, message: "Too many sign-in codes. Try again shortly." };

  const member = await prisma.member.findUnique({ where: { phone: normalized } });
  if (!member || member.status !== "ACTIVE") {
    // Same message either way — do not leak whether the number is on file.
    return { ok: true };
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.memberOtp.updateMany({
    where: { phone: normalized, consumedAt: null },
    data: { consumedAt: new Date() },
  });

  await prisma.memberOtp.create({
    data: { phone: normalized, codeHash, expiresAt },
  });

  await deliverMemberOtp({ phone: normalized, email: member.email, code });

  return { ok: true };
}

export async function consumeMemberOtp(phone: string, code: string) {
  const normalized = normalizePhone(phone);
  const otp = await prisma.memberOtp.findFirst({
    where: { phone: normalized, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) return null;

  const valid = await bcrypt.compare(code, otp.codeHash);
  if (!valid) return null;

  await prisma.memberOtp.update({
    where: { id: otp.id },
    data: { consumedAt: new Date() },
  });

  const member = await prisma.member.findUnique({ where: { phone: normalized } });
  if (!member || member.status !== "ACTIVE") return null;
  return member;
}
