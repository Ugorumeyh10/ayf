"use server";

import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { checkRateLimit } from "../../lib/rate-limit";
import { headers } from "next/headers";

// Deliberately narrower than the BRD's "suggested" field list: we collect
// birth day + month (not full date of birth) — enough for birthday
// shout-outs, without holding a full DOB on file for members who may be
// minors. See BRD sec. 10/11 on handling under-18 members' data carefully.
const RegisterSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{10}$/, "Enter an 11-digit Nigerian number starting with 0"),
  email: z.string().trim().email().optional().or(z.literal("")),
  birthDay: z.coerce.number().int().min(1).max(31),
  birthMonth: z.enum([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]),
  villageId: z.string().min(1, "Select your village / Onuku"),
  residentialLocation: z.string().trim().max(200).optional(),
  occupation: z.string().trim().max(120).optional(),
  areaOfInterest: z.string().trim().max(200).optional(),
  skills: z.string().trim().max(300).optional(),
  isMinor: z.coerce.boolean().default(false),
});

export type RegisterState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function registerMember(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = RegisterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Rate-limit by IP so a script can't flood the pending-approvals queue.
  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const { success } = await checkRateLimit(`register:${ip}`);
  if (!success) {
    return { ok: false, message: "Too many submissions from this connection. Please try again in a few minutes." };
  }

  const data = parsed.data;

  const existing = await prisma.member.findUnique({ where: { phone: data.phone } });
  if (existing) {
    return { ok: false, message: "This phone number is already registered with AYF." };
  }

  await prisma.member.create({
    data: {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || null,
      birthDay: data.birthDay,
      birthMonth: data.birthMonth,
      villageId: data.villageId,
      residentialLocation: data.residentialLocation || null,
      occupation: data.occupation || null,
      areaOfInterest: data.areaOfInterest || null,
      skills: data.skills || null,
      isMinor: data.isMinor,
      status: "PENDING", // BRD sec. 11: application is submitted for admin review
      source: "web_registration",
    },
  });

  return { ok: true, message: "Thanks — your application has been submitted for review. AYF will confirm once it's approved." };
}
