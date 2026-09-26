"use server";

import { issueMemberOtp } from "../../lib/member-otp";
import { signIn } from "../../lib/auth";
import { AuthError } from "next-auth";

export type OtpState = { ok: boolean; message: string; sent?: boolean };

export async function requestMemberCode(_prev: OtpState, formData: FormData): Promise<OtpState> {
  const phone = String(formData.get("phone") ?? "");
  const result = await issueMemberOtp(phone);
  if (!result.ok) return { ok: false, message: result.message };
  return {
    ok: true,
    sent: true,
    message: process.env.VERCEL
      ? "If this number is an active member, a sign-in code was issued. SMS/email is used when those keys are set; otherwise an officer can read the code in the office Members list."
      : "If this number is an active member, a sign-in code was issued. In local dev it is printed in the server log until SMS/email keys are set.",
  };
}

export async function verifyMemberCode(_prev: OtpState, formData: FormData): Promise<OtpState> {
  const phone = String(formData.get("phone") ?? "");
  const code = String(formData.get("code") ?? "");
  try {
    await signIn("member-otp", { phone, code, redirectTo: "/members" });
    return { ok: true, message: "Signed in." };
  } catch (err) {
    if (err instanceof AuthError) {
      return { ok: false, message: "That code is invalid or has expired." };
    }
    throw err;
  }
}
