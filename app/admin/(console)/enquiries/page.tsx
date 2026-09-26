import { prisma } from "../../../../lib/prisma";
import { requireCapability } from "../../../../lib/guards";
import { handleEnquiry } from "../../../actions/admin-content";

export default async function AdminEnquiriesPage() {
  await requireCapability("enquiries.handle");

  const [contacts, partners] = await Promise.all([
    prisma.contactEnquiry.findMany({ orderBy: { createdAt: "desc" }, take: 80 }),
    prisma.partnershipEnquiry.findMany({ orderBy: { createdAt: "desc" }, take: 80 }),
  ]);

  return (
    <section className="block wrap">
      <p className="kicker">Admin</p>
      <h1>Enquiries</h1>

      <div className="section-title" style={{ marginTop: 8 }}>
        <h2 style={{ fontSize: "1rem" }}>Contact form</h2>
      </div>
      {contacts.length === 0 && <div className="empty">No contact messages yet.</div>}
      <div className="member-list">
        {contacts.map((c) => (
          <div key={c.id} className="member-row" style={{ alignItems: "flex-start" }}>
            <div className="who">
              <div className="name">{c.subject}</div>
              <div className="meta">
                {c.name} · {c.email}
                {c.phone ? ` · ${c.phone}` : ""} · {c.createdAt.toLocaleString("en-GB")}
              </div>
              <p style={{ margin: "8px 0 0", fontSize: "0.85rem" }}>{c.message}</p>
            </div>
            {c.handledAt ? (
              <span className="badge">handled</span>
            ) : (
              <form action={handleEnquiry.bind(null, "contact", c.id)}>
                <button className="btn primary small" type="submit">
                  Mark handled
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      <div className="section-title">
        <h2 style={{ fontSize: "1rem" }}>Partnership / sponsorship</h2>
      </div>
      {partners.length === 0 && <div className="empty">No partnership enquiries yet.</div>}
      <div className="member-list">
        {partners.map((p) => (
          <div key={p.id} className="member-row" style={{ alignItems: "flex-start" }}>
            <div className="who">
              <div className="name">{p.organization}</div>
              <div className="meta">
                {p.contactName} · {p.email}
                {p.interestArea ? ` · ${p.interestArea}` : ""} · {p.createdAt.toLocaleString("en-GB")}
              </div>
              <p style={{ margin: "8px 0 0", fontSize: "0.85rem" }}>{p.message}</p>
            </div>
            {p.handledAt ? (
              <span className="badge">handled</span>
            ) : (
              <form action={handleEnquiry.bind(null, "partnership", p.id)}>
                <button className="btn primary small" type="submit">
                  Mark handled
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
