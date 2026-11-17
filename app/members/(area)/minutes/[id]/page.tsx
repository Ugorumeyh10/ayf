import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/prisma";
import { requireMemberSession } from "../../../../../lib/guards";

export const dynamic = "force-dynamic";

function Block({ title, body }: { title: string; body: string | null }) {
  if (!body?.trim()) return null;
  return (
    <div className="minutes-block">
      <h2>{title}</h2>
      <div className="minutes-prose">{body}</div>
    </div>
  );
}

export default async function MembersMinutesDetailPage({ params }: { params: { id: string } }) {
  await requireMemberSession();
  const meeting = await prisma.meeting.findFirst({
    where: { id: params.id, status: "PUBLISHED" },
  });
  if (!meeting) notFound();

  return (
    <section className="block wrap">
      <p className="kicker">Members</p>
      <div className="page-head-row" style={{ marginBottom: 6 }}>
        <h1 style={{ margin: 0 }}>{meeting.title}</h1>
        <Link href="/members/minutes" className="btn outline small">
          All minutes
        </Link>
      </div>
      <p className="minutes-meta">
        {meeting.date.toLocaleString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
        {meeting.venue ? ` · ${meeting.venue}` : ""}
      </p>

      <article className="card minutes-article">
        <Block title="Agenda" body={meeting.agenda} />
        <Block title="Attendance" body={meeting.attendeesNote} />
        <Block title="Minutes" body={meeting.minutesBody} />
        <Block title="Key decisions" body={meeting.decisions} />
        {!meeting.agenda && !meeting.attendeesNote && !meeting.minutesBody && !meeting.decisions && (
          <p className="hint" style={{ margin: 0 }}>
            The office has not added body text for this meeting yet.
          </p>
        )}
      </article>
    </section>
  );
}
