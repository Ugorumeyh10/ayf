import { prisma } from "../../lib/prisma";
import PageHeader from "../../components/PageHeader";

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <section className="block wrap">
      <PageHeader
        kicker="Community"
        title="Gallery"
        lede="Moments from programmes, meetings and community work. Hover a photo to lean in."
        action={{ href: "/events", label: "See events" }}
      />
      {items.length === 0 && (
        <div className="gallery-tease">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero-photo.jpg" alt="AYF members together at a chapter gathering" />
            <figcaption>From the community — more photos after each approved event.</figcaption>
          </figure>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Awka Youth Forum emblem" />
            <figcaption>The AYF mark. Event albums will fill this page.</figcaption>
          </figure>
        </div>
      )}
      <div className="card-grid stagger" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
        {items.map((item) =>
          item.mediaType === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.id}
              src={item.mediaUrl}
              alt={item.title ?? ""}
              style={{ width: "100%", display: "block", borderRadius: "var(--radius)" }}
            />
          ) : (
            <video key={item.id} src={item.mediaUrl} controls style={{ width: "100%", borderRadius: "var(--radius)" }} />
          )
        )}
      </div>
    </section>
  );
}
