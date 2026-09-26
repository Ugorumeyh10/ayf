import { prisma } from "../../../../lib/prisma";
import { requireCapability } from "../../../../lib/guards";
import { deleteEvent } from "../../../actions/admin-content";
import EventForm from "./EventForm";

export default async function AdminEventsPage() {
  await requireCapability("events.write");
  const events = await prisma.event.findMany({ orderBy: { date: "desc" } });

  return (
    <section className="block wrap">
      <p className="kicker">Admin</p>
      <h1>Events</h1>
      <p>Published events appear on the public home and events pages immediately.</p>

      <EventForm />

      <div className="section-title">
        <h2 style={{ fontSize: "1rem" }}>
          All events <span className="badge">{events.length}</span>
        </h2>
      </div>
      {events.length === 0 && <div className="empty">No events yet.</div>}
      <div className="member-list">
        {events.map((e) => (
          <div key={e.id} className="member-row">
            <div className="who">
              <div className="name">{e.name}</div>
              <div className="meta">
                {e.date.toLocaleString("en-GB")} · {e.venue}
                {e.isFeatured ? " · featured" : ""}
              </div>
            </div>
            <form action={deleteEvent.bind(null, e.id)}>
              <button className="btn outline small" type="submit">
                Remove
              </button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
