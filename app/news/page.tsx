import { prisma } from "../../lib/prisma";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";

export default async function NewsPage() {
  const posts = await prisma.newsPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <section className="block wrap">
      <PageHeader
        kicker="Community"
        title="News & announcements"
        lede="Updates from the chapter — programmes, scholarships, projects and member news."
        action={{ href: "/join", label: "Join AYF" }}
      />
      {posts.length === 0 && (
        <EmptyState
          title="Nothing published yet"
          body="Announcements will land here. Join as a member so you hear about them first."
          action={{ href: "/contact", label: "Send us a note" }}
        />
      )}
      {posts.map((p) => (
        <article key={p.id} className="card" style={{ marginTop: 12 }}>
          <h2 style={{ fontSize: "1.1rem" }}>{p.title}</h2>
          <p style={{ fontSize: "0.8rem" }}>{p.publishedAt?.toDateString()}</p>
          <p style={{ margin: 0 }}>{p.body}</p>
        </article>
      ))}
    </section>
  );
}
