"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireCapability } from "../../lib/guards";

export type MinutesState = { ok: boolean; message: string };

const MinutesSchema = z.object({
  title: z.string().trim().min(3).max(200),
  date: z.string().min(1),
  venue: z.string().trim().max(200).optional(),
  agenda: z.string().trim().max(5000).optional(),
  minutesBody: z.string().trim().max(50000).optional(),
  decisions: z.string().trim().max(10000).optional(),
  attendeesNote: z.string().trim().max(5000).optional(),
});

function parseMinutes(formData: FormData) {
  return MinutesSchema.safeParse({
    title: formData.get("title"),
    date: formData.get("date"),
    venue: String(formData.get("venue") ?? "").trim() || undefined,
    agenda: String(formData.get("agenda") ?? "").trim() || undefined,
    minutesBody: String(formData.get("minutesBody") ?? "").trim() || undefined,
    decisions: String(formData.get("decisions") ?? "").trim() || undefined,
    attendeesNote: String(formData.get("attendeesNote") ?? "").trim() || undefined,
  });
}

function revalidateMinutes(id?: string) {
  revalidatePath("/admin/minutes");
  revalidatePath("/members/minutes");
  revalidatePath("/members");
  if (id) {
    revalidatePath(`/admin/minutes/${id}`);
    revalidatePath(`/members/minutes/${id}`);
  }
}

export async function createMinutes(_prev: MinutesState | null, formData: FormData): Promise<MinutesState> {
  const admin = await requireCapability("attendance.write");
  const parsed = parseMinutes(formData);
  if (!parsed.success) return { ok: false, message: "Check the meeting fields and try again." };

  const date = new Date(parsed.data.date);
  if (Number.isNaN(date.getTime())) return { ok: false, message: "Enter a valid date and time." };

  const meeting = await prisma.meeting.create({
    data: {
      title: parsed.data.title,
      date,
      venue: parsed.data.venue || null,
      agenda: parsed.data.agenda || null,
      minutesBody: parsed.data.minutesBody || null,
      decisions: parsed.data.decisions || null,
      attendeesNote: parsed.data.attendeesNote || null,
      status: "DRAFT",
      createdByAdminId: admin.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "minutes.create",
      targetType: "Meeting",
      targetId: meeting.id,
    },
  });

  revalidateMinutes(meeting.id);
  redirect(`/admin/minutes/${meeting.id}`);
}

export async function updateMinutes(
  meetingId: string,
  _prev: MinutesState | null,
  formData: FormData,
): Promise<MinutesState> {
  const admin = await requireCapability("attendance.write");
  const parsed = parseMinutes(formData);
  if (!parsed.success) return { ok: false, message: "Check the meeting fields and try again." };

  const date = new Date(parsed.data.date);
  if (Number.isNaN(date.getTime())) return { ok: false, message: "Enter a valid date and time." };

  await prisma.meeting.update({
    where: { id: meetingId },
    data: {
      title: parsed.data.title,
      date,
      venue: parsed.data.venue || null,
      agenda: parsed.data.agenda || null,
      minutesBody: parsed.data.minutesBody || null,
      decisions: parsed.data.decisions || null,
      attendeesNote: parsed.data.attendeesNote || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "minutes.update",
      targetType: "Meeting",
      targetId: meetingId,
    },
  });

  revalidateMinutes(meetingId);
  return { ok: true, message: "Minutes saved." };
}

export async function publishMinutes(meetingId: string) {
  const admin = await requireCapability("attendance.write");
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) return;

  await prisma.meeting.update({
    where: { id: meetingId },
    data: {
      status: "PUBLISHED",
      publishedAt: meeting.publishedAt ?? new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "minutes.publish",
      targetType: "Meeting",
      targetId: meetingId,
    },
  });

  revalidateMinutes(meetingId);
}

export async function unpublishMinutes(meetingId: string) {
  const admin = await requireCapability("attendance.write");
  await prisma.meeting.update({
    where: { id: meetingId },
    data: { status: "DRAFT" },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "minutes.unpublish",
      targetType: "Meeting",
      targetId: meetingId,
    },
  });

  revalidateMinutes(meetingId);
}

export async function deleteMinutes(meetingId: string) {
  const admin = await requireCapability("attendance.write");
  await prisma.meeting.delete({ where: { id: meetingId } });
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "minutes.delete",
      targetType: "Meeting",
      targetId: meetingId,
    },
  });
  revalidateMinutes();
  redirect("/admin/minutes");
}
