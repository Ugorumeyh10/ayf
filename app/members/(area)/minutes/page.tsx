import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { requireMemberSession } from "../../../../lib/guards";

export const dynamic = "force-dynamic";

export default async function MembersMinutesPage() {
  await requireMemberSession();
  const meetings = await prisma.meeting.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { date: "desc" },
  });

  return (
    <section className="block wrap">
      <p className="kicker">Members</p>
      <h1>Meeting minutes</h1>
      <p>Official records of chapter meetings published by the office.</p>

      {meetings.length === 0 && (
        <div className="empty">
          <span className="empty-title">No minutes published yet</span>
          When the secretariat publishes a meeting record, it will appear here.
        </div>
      )}

      <div className="member-list">
        {meetings.map((m) => (
          <Link key={m.id} href={`/members/minutes/${m.id}`} className="member-row minutes-row">
            <div className="av" aria-hidden>
              {m.date.getDate()}
            </div>
            <div className="who">
              <div className="name">{m.title}</div>
              <div className="meta">
                {m.date.toLocaleString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {m.venue ? ` · ${m.venue}` : ""}
              </div>
            </div>
            <span className="chev" aria-hidden>
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
