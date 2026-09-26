import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import MemberLoginForm from "./MemberLoginForm";

export default async function MemberLoginPage() {
  const session = await auth();
  if (session?.user?.kind === "member") redirect("/members");
  if (session?.user?.kind === "admin") redirect("/admin/dashboard");

  return (
    <section className="block wrap auth-plain" style={{ maxWidth: 420 }}>
      <p className="kicker">Members</p>
      <h1>Members’ area</h1>
      <p>
        Sign in with the phone number on your membership record. We send a one-time code by SMS. If an email is
        on your record, the same code is sent there too.
      </p>
      <MemberLoginForm />
      <p style={{ fontSize: "0.8rem", marginTop: 12 }}>
        Not a member yet? <Link href="/join">Join AYF</Link>
        {" · "}
        <Link href="/">Back to the site</Link>
      </p>
    </section>
  );
}
