import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "../../../lib/auth";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user?.kind === "admin") redirect("/admin/dashboard");
  if (session?.user?.kind === "member") redirect("/members");

  return (
    <section className="block wrap auth-plain" style={{ maxWidth: 380 }}>
      <p className="kicker">Admin</p>
      <h1>Office sign in</h1>
      <p>Executive-office accounts only. Members use the members’ area.</p>
      <form
        className="card"
        action={async (formData) => {
          "use server";
          await signIn("credentials", formData, { redirectTo: "/admin/dashboard" });
        }}
      >
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <button type="submit" className="btn primary" style={{ width: "100%", justifyContent: "center" }}>
          Sign in
          <span className="chev" aria-hidden>
            →
          </span>
        </button>
      </form>
      <p style={{ fontSize: "0.8rem", marginTop: 12 }}>
        <Link href="/members/login">Members’ area</Link>
        {" · "}
        <Link href="/">Back to the site</Link>
      </p>
    </section>
  );
}
