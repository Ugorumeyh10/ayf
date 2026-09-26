import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { requireAdminSession } from "../../../../lib/guards";
import { hasCapability } from "../../../../lib/capabilities";

export default async function AdminDashboard() {
  const admin = await requireAdminSession();
  const canMembers = hasCapability(admin.role, "members.read");
  const canEnquiries = hasCapability(admin.role, "enquiries.handle");
  const canEvents = hasCapability(admin.role, "events.write");

  const [pendingCount, memberCount, unhandledContact, unhandledPartner, eventCount] = await Promise.all([
    prisma.member.count({ where: { status: "PENDING" } }),
    prisma.member.count({ where: { status: "ACTIVE" } }),
    prisma.contactEnquiry.count({ where: { handledAt: null } }),
    prisma.partnershipEnquiry.count({ where: { handledAt: null } }),
    prisma.event.count(),
  ]);

  return (
    <section className="block wrap">
      <p className="kicker">Admin</p>
      <h1>Dashboard</h1>
      <p style={{ marginTop: 0 }}>Signed in as {admin.role.replaceAll("_", " ")}. You only see tools your office can use.</p>
      <div className="card-grid stagger">
        {canMembers && <StatCard label="Pending applications" value={pendingCount} href="/admin/members" />}
        {canMembers && <StatCard label="Active members" value={memberCount} href="/admin/members" accent />}
        {canEnquiries && (
          <StatCard
            label="Unhandled enquiries"
            value={unhandledContact + unhandledPartner}
            href="/admin/enquiries"
          />
        )}
        {canEvents && <StatCard label="Published events" value={eventCount} href="/admin/events" />}
      </div>
    </section>
  );
}

function StatCard({ label, value, href, accent }: { label: string; value: number; href: string; accent?: boolean }) {
  return (
    <Link href={href} className="stat-card" style={{ display: "block", textDecoration: "none" }}>
      <div className={`num ${accent ? "accent-red" : ""}`}>{value}</div>
      <div className="lbl">{label}</div>
    </Link>
  );
}
