import { prisma } from "../../lib/prisma";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";

export const dynamic = "force-dynamic";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function TeamPage() {
  const executives = await prisma.executive.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <section className="block wrap">
      <PageHeader
        kicker="Leadership"
        title="Meet the AYF executives"
        lede="The dedicated leaders serving Awka Youth Forum and contributing to the growth, unity and development of our community."
        action={{ href: "/contact", label: "Contact the forum" }}
      />

      {executives.length === 0 ? (
        <EmptyState
          title="Profiles are being prepared"
          body="Executive names, photos and bios will appear here once they are published. Meet the chapter at the next event in the meantime."
          action={{ href: "/events", label: "See upcoming events" }}
        />
      ) : (
        <div className="card-grid stagger">
          {executives.map((e) => (
            <div key={e.id} className="card exec-card">
              {e.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.photoUrl} alt={e.fullName} className="exec-photo" />
              ) : (
                <div className="exec-fallback" aria-hidden>
                  {initials(e.fullName)}
                </div>
              )}
              <h3>{e.fullName}</h3>
              <p style={{ color: "var(--red-deep)", fontWeight: 700 }}>{e.position}</p>
              {e.bio && <p>{e.bio}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
