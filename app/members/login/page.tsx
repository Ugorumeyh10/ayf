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
        Sign in with the phone number on your membership record. We send a one-time code by SMS (and email if one
        is on file). Until SMS is connected, an officer can read the code in the office Members list and pass it
        to you.
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
