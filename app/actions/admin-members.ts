"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { requireCapability } from "../../lib/guards";

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
