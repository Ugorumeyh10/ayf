"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { requireCapability } from "../../lib/guards";
import { issueMemberOtp } from "../../lib/member-otp";

export type OfficeOtpState = { ok: boolean; message: string };

export async function issueOfficeMemberCode(
  _prev: OfficeOtpState,
  formData: FormData,
): Promise<OfficeOtpState> {
  const admin = await requireCapability("members.approve");
  const phone = String(formData.get("phone") ?? "").trim();
  const result = await issueMemberOtp(phone, { revealToOfficer: true });
  if (!result.ok) return { ok: false, message: result.message };

  const otp = await prisma.memberOtp.findFirst({
    where: { phone, revealCode: { not: null }, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "member.otp_issue",
      targetType: "Member",
      targetId: phone,
    },
  });

  revalidatePath("/admin/members");
  return {
    ok: true,
    message: otp?.revealCode
      ? `Sign-in code for ${phone}: ${otp.revealCode} (valid 10 minutes). Pass it to the member — do not post it publicly.`
      : `A sign-in code was issued for ${phone}.`,
  };
}

export async function approveMember(memberId: string) {
  const admin = await requireCapability("members.approve");

  await prisma.$transaction([
    prisma.member.update({
      where: { id: memberId },
      data: { status: "ACTIVE", approvedAt: new Date() },
    }),
    prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "member.approve",
        targetType: "Member",
        targetId: memberId,
      },
    }),
  ]);

  revalidatePath("/admin/members");
  revalidatePath("/admin/dashboard");
}

export async function rejectMember(memberId: string) {
  const admin = await requireCapability("members.approve");

  await prisma.$transaction([
    prisma.member.update({
      where: { id: memberId },
      data: { status: "REJECTED" },
    }),
    prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "member.reject",
        targetType: "Member",
        targetId: memberId,
      },
    }),
  ]);

  revalidatePath("/admin/members");
  revalidatePath("/admin/dashboard");
}
