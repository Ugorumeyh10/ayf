import type { AdminRole } from "@prisma/client";

export type Capability =
  | "members.read"
  | "members.approve"
  | "dues.confirm"
  | "content.publish"
  | "events.write"
  | "attendance.write"
  | "enquiries.handle"
  | "settings.write"
  | "admins.manage";

const ALL: Capability[] = [
  "members.read",
  "members.approve",
  "dues.confirm",
  "content.publish",
  "events.write",
  "attendance.write",
  "enquiries.handle",
  "settings.write",
  "admins.manage",
];

const FULL_DASHBOARD: Capability[] = ALL.filter((c) => c !== "admins.manage");

const ROLE_CAPS: Record<AdminRole, readonly Capability[]> = {
  SUPER_ADMIN: ALL,
  PRESIDENT: FULL_DASHBOARD,
  VICE_PRESIDENT: FULL_DASHBOARD,
  PRO_1: FULL_DASHBOARD,
  GENERAL_SECRETARY: ["members.read", "members.approve", "attendance.write", "enquiries.handle", "content.publish"],
  ASST_GENERAL_SECRETARY: ["members.read", "members.approve", "attendance.write", "enquiries.handle"],
  FINANCIAL_SECRETARY: ["members.read", "dues.confirm"],
  TREASURER: ["members.read", "dues.confirm"],
  PRO_2: ["content.publish", "events.write", "enquiries.handle"],
  DOS_1: ["events.write", "attendance.write", "content.publish"],
  DOS_2: ["events.write", "attendance.write", "content.publish"],
  PROVOST_1: ["members.read", "attendance.write"],
  PROVOST_2: ["members.read", "attendance.write"],
};

export function capabilitiesFor(role: AdminRole): readonly Capability[] {
  return ROLE_CAPS[role] ?? [];
}

export function hasCapability(role: AdminRole, cap: Capability): boolean {
  return capabilitiesFor(role).includes(cap);
}

export const ADMIN_NAV: { href: string; label: string; cap?: Capability }[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/members", label: "Members", cap: "members.read" },
  { href: "/admin/events", label: "Events", cap: "events.write" },
  { href: "/admin/enquiries", label: "Enquiries", cap: "enquiries.handle" },
  { href: "/admin/settings", label: "Site settings", cap: "settings.write" },
];
