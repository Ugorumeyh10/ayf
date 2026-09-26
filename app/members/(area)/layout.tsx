import Link from "next/link";
import { requireMemberSession } from "../../../lib/guards";
import { signOutMember } from "../../actions/session";

export default async function MembersAreaLayout({ children }: { children: React.ReactNode }) {
  const member = await requireMemberSession();

  return (
    <div className="member-shell">
      <header className="admin-top">
        <div className="wrap admin-top-inner">
          <div>
            <Link href="/members" className="admin-brand">
              Members’ area
            </Link>
            <p className="admin-who">{member.fullName}</p>
          </div>
          <div className="admin-top-actions">
            <Link href="/" className="btn outline small">
              View site
            </Link>
            <form action={signOutMember}>
              <button type="submit" className="btn outline small">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
