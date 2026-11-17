import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/prisma";
import { requireCapability } from "../../../../../lib/guards";
import { deleteMinutes, publishMinutes, unpublishMinutes } from "../../../../actions/admin-minutes";
import { EditMinutesForm } from "../MinutesForm";

export const dynamic = "force-dynamic";

export default async function AdminMinutesDetailPage({ params }: { params: { id: string } }) {
  await requireCapability("attendance.write");
  const meeting = await prisma.meeting.findUnique({ where: { id: params.id } });
  if (!meeting) notFound();

  return (
    <section className="block wrap">
      <p className="kicker">Admin</p>
      <div className="page-head-row" style={{ marginBottom: 8 }}>
        <h1 style={{ margin: 0 }}>{meeting.title}</h1>
        <Link href="/admin/minutes" className="btn outline small">
          All minutes
        </Link>
      </div>
      <p style={{ marginTop: 0 }}>
        {meeting.date.toLocaleString("en-GB")}
        {meeting.venue ? ` · ${meeting.venue}` : ""}
        {" · "}
        <span className={`badge ${meeting.status === "PUBLISHED" ? "badge-ok" : ""}`}>
          {meeting.status === "PUBLISHED" ? "Published" : "Draft"}
        </span>
      </p>

      <div className="form-nav" style={{ maxWidth: 560, marginBottom: 18 }}>
        {meeting.status === "DRAFT" ? (
          <form action={publishMinutes.bind(null, meeting.id)} style={{ flex: 1 }}>
            <button type="submit" className="btn primary" style={{ width: "100%", justifyContent: "center" }}>
              Publish to members
            </button>
          </form>
        ) : (
          <form action={unpublishMinutes.bind(null, meeting.id)} style={{ flex: 1 }}>
            <button type="submit" className="btn outline" style={{ width: "100%", justifyContent: "center" }}>
              Unpublish
            </button>
          </form>
        )}
        <form action={deleteMinutes.bind(null, meeting.id)} style={{ flex: 1 }}>
          <button type="submit" className="btn outline" style={{ width: "100%", justifyContent: "center" }}>
            Delete
          </button>
        </form>
      </div>

      <EditMinutesForm meeting={meeting} />
    </section>
  );
}
