import { prisma } from "../../lib/prisma";
import PageHeader from "../../components/PageHeader";
import { GALLERY_ALBUMS } from "../../lib/gallery";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
  const albums = GALLERY_ALBUMS.map((album) => ({
    ...album,
    items: items.filter((item) => item.category === album.id),
  }));
  const other = items.filter((item) => !GALLERY_ALBUMS.some((album) => album.id === item.category));

  return (
    <section className="block wrap">
      <PageHeader
        kicker="Community"
        title="Gallery"
        lede="Moments from programmes, meetings and community work — including Dinner & Award Night and the 2024 Hangout."
        action={{ href: "/events", label: "See events" }}
      />

      {items.length === 0 && (
        <div className="empty">
          <span className="empty-title">Photos are being prepared</span>
          Event albums will appear here as soon as the office publishes them.
        </div>
      )}

      {albums.map((album) =>
        album.items.length === 0 ? null : (
          <div key={album.id} className="gallery-album">
            <div className="section-title">
              <h2 style={{ fontSize: "1.05rem" }}>{album.label}</h2>
            </div>
            <div className="gallery-grid">
              {album.items.map((item) =>
                item.mediaType === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={item.id} src={item.mediaUrl} alt={item.title ?? album.label} />
                ) : (
                  <video key={item.id} src={item.mediaUrl} controls />
                )
              )}
            </div>
          </div>
        )
      )}

      {other.length > 0 && (
        <div className="gallery-album">
          <div className="section-title">
            <h2 style={{ fontSize: "1.05rem" }}>More from the chapter</h2>
          </div>
          <div className="gallery-grid">
            {other.map((item) =>
              item.mediaType === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={item.id} src={item.mediaUrl} alt={item.title ?? ""} />
              ) : (
                <video key={item.id} src={item.mediaUrl} controls />
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
}
