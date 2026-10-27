"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireCapability } from "../../lib/guards";
import { deletePublicImage, uploadPublicImage } from "../../lib/blob";
import { GALLERY_ALBUMS } from "../../lib/gallery";

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
    bankName: z.string().trim().max(80).optional(),
    accountName: z.string().trim().max(120).optional(),
    accountNumber: z.string().trim().max(20).optional(),
  });

  const parsed = Schema.safeParse({
    ...Object.fromEntries(formData),
    phone: formData.get("phone") || undefined,
    whatsapp: formData.get("whatsapp") || undefined,
    facebookUrl: formData.get("facebookUrl") || "",
    instagramUrl: formData.get("instagramUrl") || "",
    bankName: formData.get("bankName") || undefined,
    accountName: formData.get("accountName") || undefined,
    accountNumber: formData.get("accountNumber") || undefined,
  });
  if (!parsed.success) return { ok: false, message: "Check the fields and try again." };

  const current = await prisma.siteConfig.findUnique({ where: { id: "ayf" } });
  const heroFile = formData.get("heroImage");
  let heroImageUrl = current?.heroImageUrl ?? null;
  if (formData.get("clearHeroImage") === "on") {
    await deletePublicImage(heroImageUrl);
    heroImageUrl = null;
  } else if (heroFile instanceof File && heroFile.size > 0) {
    const uploaded = await uploadPublicImage(heroFile, "hero");
    if (!uploaded.ok) return uploaded;
    await deletePublicImage(heroImageUrl);
    heroImageUrl = uploaded.url;
  }

  const payload = {
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
    bankName: parsed.data.bankName || null,
    accountName: parsed.data.accountName || null,
    accountNumber: parsed.data.accountNumber || null,
    heroImageUrl,
  };

  await prisma.siteConfig.upsert({
    where: { id: "ayf" },
    create: { id: "ayf", ...payload },
    update: payload,
  });

  await prisma.auditLog.create({
    data: { adminId: admin.id, action: "settings.update", targetType: "SiteConfig", targetId: "ayf" },
  });

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/get-involved");
  revalidatePath("/members");
  revalidatePath("/admin/settings");
  return { ok: true, message: "Public site settings saved." };
}

const albumIds = GALLERY_ALBUMS.map((a) => a.id) as [string, ...string[]];

export async function createGalleryItem(_prev: { ok: boolean; message: string } | null, formData: FormData) {
  const admin = await requireCapability("content.publish");
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  if (!albumIds.includes(category)) {
    return { ok: false, message: "Choose an album." };
  }
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose a photo to upload." };
  }
  const uploaded = await uploadPublicImage(file, `gallery/${category}`);
  if (!uploaded.ok) return uploaded;

  const item = await prisma.galleryItem.create({
    data: {
      title: title || null,
      mediaUrl: uploaded.url,
      mediaType: "image",
      category,
    },
  });
  await prisma.auditLog.create({
    data: { adminId: admin.id, action: "gallery.create", targetType: "GalleryItem", targetId: item.id },
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { ok: true, message: "Photo added to the gallery." };
}

export async function deleteGalleryItem(id: string) {
  const admin = await requireCapability("content.publish");
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (item) {
    await deletePublicImage(item.mediaUrl);
    await prisma.galleryItem.delete({ where: { id } });
    await prisma.auditLog.create({
      data: { adminId: admin.id, action: "gallery.delete", targetType: "GalleryItem", targetId: id },
    });
  }
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function createExecutive(_prev: { ok: boolean; message: string } | null, formData: FormData) {
  const admin = await requireCapability("content.publish");
  const Schema = z.object({
    fullName: z.string().trim().min(2).max(120),
    position: z.string().trim().min(2).max(80),
    bio: z.string().trim().max(600).optional(),
    displayOrder: z.coerce.number().int().min(0).max(99).default(0),
  });
  const parsed = Schema.safeParse({
    fullName: formData.get("fullName"),
    position: formData.get("position"),
    bio: formData.get("bio") || undefined,
    displayOrder: formData.get("displayOrder") || 0,
  });
  if (!parsed.success) return { ok: false, message: "Check the executive fields and try again." };

  let photoUrl: string | null = null;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadPublicImage(file, "executives");
    if (!uploaded.ok) return uploaded;
    photoUrl = uploaded.url;
  }

  const exec = await prisma.executive.create({
    data: {
      fullName: parsed.data.fullName,
      position: parsed.data.position,
      bio: parsed.data.bio || null,
      displayOrder: parsed.data.displayOrder,
      photoUrl,
    },
  });
  await prisma.auditLog.create({
    data: { adminId: admin.id, action: "executive.create", targetType: "Executive", targetId: exec.id },
  });
  revalidatePath("/admin/team");
  revalidatePath("/team");
  return { ok: true, message: "Executive published." };
}

export async function updateExecutivePhoto(id: string, formData: FormData) {
  const admin = await requireCapability("content.publish");
  const exec = await prisma.executive.findUnique({ where: { id } });
  if (!exec) return;
  if (formData.get("removePhoto") === "on") {
    await deletePublicImage(exec.photoUrl);
    await prisma.executive.update({ where: { id }, data: { photoUrl: null } });
  } else {
    const file = formData.get("photo");
    if (!(file instanceof File) || file.size === 0) return;
    const uploaded = await uploadPublicImage(file, "executives");
    if (!uploaded.ok) return;
    await deletePublicImage(exec.photoUrl);
    await prisma.executive.update({ where: { id }, data: { photoUrl: uploaded.url } });
  }
  await prisma.auditLog.create({
    data: { adminId: admin.id, action: "executive.photo", targetType: "Executive", targetId: id },
  });
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function deleteExecutive(id: string) {
  const admin = await requireCapability("content.publish");
  const exec = await prisma.executive.findUnique({ where: { id } });
  if (exec) {
    await deletePublicImage(exec.photoUrl);
    await prisma.executive.delete({ where: { id } });
    await prisma.auditLog.create({
      data: { adminId: admin.id, action: "executive.delete", targetType: "Executive", targetId: id },
    });
  }
  revalidatePath("/admin/team");
  revalidatePath("/team");
}
