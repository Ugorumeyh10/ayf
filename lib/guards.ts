import { redirect } from "next/navigation";
import type { AdminRole } from "@prisma/client";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { hasCapability, type Capability } from "./capabilities";

export type AdminActor = { id: string; role: AdminRole; name: string; email: string };

export async function requireAdminSession(): Promise<AdminActor> {
  const session = await auth();
  if (!session?.user?.id || session.user.kind === "member") {
    redirect("/admin/login");
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: session.user.id } });
  if (!admin || !admin.isActive) {
    redirect("/admin/login");
  }

  return { id: admin.id, role: admin.role, name: admin.name, email: admin.email };
}

export async function requireCapability(cap: Capability): Promise<AdminActor> {
  const admin = await requireAdminSession();
  if (!hasCapability(admin.role, cap)) {
    redirect("/admin/dashboard");
  }
  return admin;
}

export async function requireMemberSession() {
  const session = await auth();
  if (!session?.user?.id || session.user.kind !== "member") {
    redirect("/members/login");
  }
  const member = await prisma.member.findUnique({
    where: { id: session.user.id },
    include: { village: true },
  });
  if (!member || member.status !== "ACTIVE") {
    redirect("/members/login");
  }
  return member;
}
