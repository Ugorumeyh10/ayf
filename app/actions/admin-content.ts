"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireCapability } from "../../lib/guards";

const EventSchema = z.object({
  name: z.string().trim().min(3).max(160),
  date: z.string().min(1),
  venue: z.string().trim().min(2).max(160),
  address: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  isFeatured: z.boolean(),
  registrationOpen: z.boolean(),
});

export async function createEvent(_prev: { ok: boolean; message: string } | null, formData: FormData) {
  const admin = await requireCapability("events.write");
  const parsed = EventSchema.safeParse({
    name: formData.get("name"),
    date: formData.get("date"),
    venue: formData.get("venue"),
    address: formData.get("address") || undefined,
    description: formData.get("description") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    registrationOpen: formData.get("registrationOpen") === "on",
  });
  if (!parsed.success) return { ok: false, message: "Check the event fields and try again." };

  const date = new Date(parsed.data.date);
  if (Number.isNaN(date.getTime())) return { ok: false, message: "Enter a valid date and time." };

  if (parsed.data.isFeatured) {
    await prisma.event.updateMany({ data: { isFeatured: false } });
  }

  const event = await prisma.event.create({
    data: {
      name: parsed.data.name,
      date,
      venue: parsed.data.venue,
      address: parsed.data.address || null,
      description: parsed.data.description || null,
      isFeatured: parsed.data.isFeatured,
      registrationOpen: parsed.data.registrationOpen,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "event.create",
      targetType: "Event",
      targetId: event.id,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/");
  revalidatePath("/events");
  return { ok: true, message: "Event published." };
}

export async function deleteEvent(eventId: string) {
  const admin = await requireCapability("events.write");
  await prisma.event.delete({ where: { id: eventId } });
  await prisma.auditLog.create({
    data: { adminId: admin.id, action: "event.delete", targetType: "Event", targetId: eventId },
  });
  revalidatePath("/admin/events");
  revalidatePath("/");
  revalidatePath("/events");
}

export async function handleEnquiry(kind: "contact" | "partnership", id: string) {
  const admin = await requireCapability("enquiries.handle");
  const data = { handledBy: admin.id, handledAt: new Date() };
  if (kind === "contact") {
    await prisma.contactEnquiry.update({ where: { id }, data });
  } else {
    await prisma.partnershipEnquiry.update({ where: { id }, data });
  }
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "enquiry.handle",
      targetType: kind === "contact" ? "ContactEnquiry" : "PartnershipEnquiry",
      targetId: id,
    },
  });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
}

export async function updateSiteConfig(_prev: { ok: boolean; message: string } | null, formData: FormData) {
  const admin = await requireCapability("settings.write");
  const Schema = z.object({
    officialName: z.string().trim().min(3).max(160),
    rcNumber: z.string().trim().min(2).max(40),
    motto: z.string().trim().min(2).max(200),
    slogan: z.string().trim().min(2).max(200),
    email: z.string().trim().email(),
    phone: z.string().trim().max(30).optional(),
    whatsapp: z.string().trim().max(30).optional(),
    address: z.string().trim().min(4).max(240),
    facebookUrl: z.string().trim().url().optional().or(z.literal("")),
    instagramUrl: z.string().trim().url().optional().or(z.literal("")),
    meetingNote: z.string().trim().min(4).max(240),
    meetingVenue: z.string().trim().min(4).max(240),
  });

  const parsed = Schema.safeParse({
    ...Object.fromEntries(formData),
    phone: formData.get("phone") || undefined,
    whatsapp: formData.get("whatsapp") || undefined,
    facebookUrl: formData.get("facebookUrl") || "",
    instagramUrl: formData.get("instagramUrl") || "",
  });
  if (!parsed.success) return { ok: false, message: "Check the fields and try again." };

  await prisma.siteConfig.upsert({
    where: { id: "ayf" },
    create: {
      id: "ayf",
      officialName: parsed.data.officialName,
      rcNumber: parsed.data.rcNumber,
      motto: parsed.data.motto,
      slogan: parsed.data.slogan,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      address: parsed.data.address,
      facebookUrl: parsed.data.facebookUrl || null,
      instagramUrl: parsed.data.instagramUrl || null,
      meetingNote: parsed.data.meetingNote,
      meetingVenue: parsed.data.meetingVenue,
    },
    update: {
      officialName: parsed.data.officialName,
      rcNumber: parsed.data.rcNumber,
      motto: parsed.data.motto,
      slogan: parsed.data.slogan,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      address: parsed.data.address,
      facebookUrl: parsed.data.facebookUrl || null,
      instagramUrl: parsed.data.instagramUrl || null,
      meetingNote: parsed.data.meetingNote,
      meetingVenue: parsed.data.meetingVenue,
    },
  });

  await prisma.auditLog.create({
    data: { adminId: admin.id, action: "settings.update", targetType: "SiteConfig", targetId: "ayf" },
  });

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
  return { ok: true, message: "Public site settings saved." };
}
