import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { requireCapability } from "../../../../lib/guards";
import { CreateMinutesForm } from "./MinutesForm";

export const dynamic = "force-dynamic";

export default async function AdminMinutesPage() {
  await requireCapability("attendance.write");
  const meetings = await prisma.meeting.findMany({ orderBy: { date: "desc" } });

  return (
    <section className="block wrap">
      <p className="kicker">Admin</p>
      <h1>Meeting minutes</h1>
      <p>
        Draft minutes stay in the office. When you publish, active members can read them in the members’ area.
      </p>

      <CreateMinutesForm />

      <div className="section-title">
        <h2 style={{ fontSize: "1rem" }}>
          All meetings <span className="badge">{meetings.length}</span>
        </h2>
      </div>
      {meetings.length === 0 && (
        <div className="empty">
          <span className="empty-title">No minutes yet</span>
          Record the first monthly meeting above.
        </div>
      )}
      <div className="member-list">
        {meetings.map((m) => (
          <Link key={m.id} href={`/admin/minutes/${m.id}`} className="member-row minutes-row">
            <div className="av" aria-hidden>
              {m.date.getDate()}
            </div>
            <div className="who">
              <div className="name">{m.title}</div>
              <div className="meta">
                {m.date.toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {m.venue ? ` · ${m.venue}` : ""}
              </div>
            </div>
            <span className={`badge ${m.status === "PUBLISHED" ? "badge-ok" : ""}`}>
              {m.status === "PUBLISHED" ? "Published" : "Draft"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
