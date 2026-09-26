import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { consumeMemberOtp } from "./member-otp";

const adminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const memberOtpSchema = z.object({
  phone: z.string().trim().regex(/^0\d{10}$/),
  code: z.string().trim().regex(/^\d{6}$/),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = adminSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const admin = await prisma.adminUser.findUnique({ where: { email } });
        if (!admin || !admin.isActive) return null;

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) return null;

        await prisma.adminUser.update({
          where: { id: admin.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          kind: "admin" as const,
        };
      },
    }),
    Credentials({
      id: "member-otp",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        code: { label: "Code", type: "text" },
      },
      async authorize(raw) {
        const parsed = memberOtpSchema.safeParse(raw);
        if (!parsed.success) return null;
        const member = await consumeMemberOtp(parsed.data.phone, parsed.data.code);
        if (!member) return null;
        return {
          id: member.id,
          name: member.fullName,
          email: member.email ?? undefined,
          role: "",
          kind: "member" as const,
        };
      },
    }),
  ],
});
