import Link from "next/link";
import { prisma } from "../../lib/prisma";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";

export default async function EventsPage() {
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
  const now = new Date();
  const upcoming = events.filter((e) => e.date >= now);
  const past = events.filter((e) => e.date < now);

  return (
    <section className="block wrap">
      <PageHeader
        kicker="What's on"
        title="Events"
        lede="Meetings, celebrations and community programmes. Tap an event for venue and time."
        action={{ href: "/join", label: "Join AYF" }}
      />

      <div className="section-title" style={{ marginTop: 8 }}>
        <h2 style={{ fontSize: "1rem" }}>Upcoming</h2>
      </div>
      {upcoming.length === 0 && (
        <EmptyState
          title="Nothing on the calendar yet"
          body="The next programme will appear here as soon as it is published. In the meantime, come in as a member."
          action={{ href: "/join", label: "Register to be notified" }}
        />
      )}
      <div className="stagger">
        {upcoming.map((e) => (
          <Link key={e.id} href={`#${e.id}`} id={e.id} className="event-card">
            <div className="date-badge">
              <span className="d">{e.date.getDate()}</span>
              <span className="m">{e.date.toLocaleString("en-GB", { month: "short" })}</span>
            </div>
            <div>
              <h3 style={{ fontSize: "1rem" }}>{e.name}</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.85rem" }}>
                {e.date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} &middot; {e.venue}
                {e.address ? ` — ${e.address}` : ""}
              </p>
              {e.description && <p style={{ fontSize: "0.85rem", marginBottom: 0 }}>{e.description}</p>}
            </div>
          </Link>
        ))}
      </div>

      <div className="section-title">
        <h2 style={{ fontSize: "1rem" }}>Past events</h2>
      </div>
      {past.length === 0 && (
        <EmptyState title="No past events listed" body="Previous programmes will archive here after they run." />
      )}
      {past.map((e) => (
        <div key={e.id} className="event-card" style={{ opacity: 0.78 }}>
          <div className="date-badge" style={{ background: "var(--ink)" }}>
            <span className="d">{e.date.getDate()}</span>
            <span className="m">{e.date.toLocaleString("en-GB", { month: "short" })}</span>
          </div>
          <div>
            <h3 style={{ fontSize: "1rem" }}>{e.name}</h3>
            <p style={{ margin: "2px 0 0", fontSize: "0.85rem" }}>
              {e.date.toDateString()} &middot; {e.venue}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
