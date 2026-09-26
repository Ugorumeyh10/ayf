import Link from "next/link";
import { requireAdminSession } from "../../../lib/guards";
import { hasCapability, ADMIN_NAV } from "../../../lib/capabilities";
import { signOutAdmin } from "../../actions/session";
import AdminNav from "../../../components/AdminNav";

export default async function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminSession();
  const links = ADMIN_NAV.filter((l) => !l.cap || hasCapability(admin.role, l.cap));

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div className="wrap admin-top-inner">
          <div>
            <Link href="/admin/dashboard" className="admin-brand">
              AYF office
            </Link>
            <p className="admin-who">
              {admin.name} · {admin.role.replaceAll("_", " ")}
            </p>
          </div>
          <div className="admin-top-actions">
            <Link href="/" className="btn outline small">
              View site
            </Link>
            <form action={signOutAdmin}>
              <button type="submit" className="btn outline small">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div className="wrap">
          <AdminNav links={links} />
        </div>
      </header>
      {children}
    </div>
  );
}
