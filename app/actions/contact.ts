"use server";

import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { checkRateLimit } from "../../lib/rate-limit";
import { headers } from "next/headers";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(5).max(2000),
});

export type ContactState = { ok: boolean; message: string };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = ContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please fill in all required fields correctly." };

  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const { success } = await checkRateLimit(`contact:${ip}`);
  if (!success) return { ok: false, message: "Too many messages from this connection. Try again shortly." };

  await prisma.contactEnquiry.create({ data: parsed.data });
  return { ok: true, message: "Message sent — AYF will get back to you." };
}
