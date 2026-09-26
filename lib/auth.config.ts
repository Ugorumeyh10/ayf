import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Edge-safe Auth.js config for Vercel middleware.
 * Do not import Prisma, bcrypt, or Node-only adapters here.
 */
export const authConfig = {
  trustHost: true,
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    }),
    Credentials({
      id: "member-otp",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        code: { label: "Code", type: "text" },
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const kind = auth?.user?.kind;

      if (pathname.startsWith("/members") && !pathname.startsWith("/members/login")) {
        if (kind === "member") return true;
        const url = request.nextUrl.clone();
        url.pathname = kind === "admin" ? "/admin/dashboard" : "/members/login";
        return Response.redirect(url);
      }

      if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
        if (kind === "admin") return true;
        if (kind === "member") {
          const url = request.nextUrl.clone();
          url.pathname = "/members";
          return Response.redirect(url);
        }
        return false;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.kind = user.kind ?? "admin";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = typeof token.role === "string" ? token.role : "";
        session.user.kind = token.kind === "member" ? "member" : "admin";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
