import { prisma } from "../../../../lib/prisma";
import { requireCapability } from "../../../../lib/guards";
import { hasCapability } from "../../../../lib/capabilities";
import { approveMember, rejectMember } from "../../../actions/admin-members";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default async function AdminMembersPage() {
  const admin = await requireCapability("members.read");
  const canApprove = hasCapability(admin.role, "members.approve");

  const pending = await prisma.member.findMany({
    where: { status: "PENDING" },
    include: { village: true },
    orderBy: { createdAt: "asc" },
  });

  const flagged = await prisma.member.findMany({
    where: { needsReview: true },
    include: { village: true },
  });

  return (
    <section className="block wrap">
      <p className="kicker">Admin</p>
      <h1>Members</h1>

      <div className="section-title" style={{ marginTop: 8 }}>
        <h2 style={{ fontSize: "1rem" }}>
          Pending applications <span className="badge">{pending.length}</span>
        </h2>
      </div>
      {pending.length === 0 && <div className="empty">Nothing waiting on review.</div>}
      <div className="member-list">
        {pending.map((m) => (
          <div key={m.id} className="member-row">
            <span className="av">{initials(m.fullName)}</span>
            <div className="who">
              <div className="name">{m.fullName}</div>
              <div className="meta">
                {m.phone} &middot; {m.village.name}
              </div>
            </div>
            {canApprove ? (
              <>
                <form action={approveMember.bind(null, m.id)}>
                  <button className="btn primary small" type="submit">
                    Approve
                  </button>
                </form>
                <form action={rejectMember.bind(null, m.id)}>
                  <button className="btn outline small" type="submit">
                    Reject
                  </button>
                </form>
              </>
            ) : (
              <span className="badge">awaiting secretary</span>
            )}
          </div>
        ))}
      </div>

      <div className="section-title">
        <h2 style={{ fontSize: "1rem" }}>
          Flagged from spreadsheet migration <span className="badge">{flagged.length}</span>
        </h2>
      </div>
      <p style={{ fontSize: "0.85rem" }}>
        These shared a phone number with another row in the original spreadsheet — confirm they are genuinely
        separate people before dues/attendance are tracked against them.
      </p>
      <div className="member-list">
        {flagged.map((m) => (
          <div key={m.id} className="member-row">
            <span className="av">{initials(m.fullName)}</span>
            <div className="who">
              <div className="name">{m.fullName}</div>
              <div className="meta">
                {m.phone} &middot; {m.village.name}
              </div>
            </div>
            <span className="badge">review</span>
          </div>
        ))}
      </div>
    </section>
  );
}
