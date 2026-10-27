import { prisma } from "../../../../lib/prisma";
import { requireCapability } from "../../../../lib/guards";
import { deleteGalleryItem } from "../../../actions/admin-content";
import { GALLERY_ALBUMS, galleryAlbumLabel } from "../../../../lib/gallery";
import GalleryForm from "./GalleryForm";

export default async function AdminGalleryPage() {
  await requireCapability("content.publish");
  const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <section className="block wrap">
      <p className="kicker">Admin</p>
      <h1>Gallery</h1>
      <p>
        Photos here appear on the public gallery, grouped as {GALLERY_ALBUMS.map((a) => a.label).join(" and ")}.
      </p>
      <GalleryForm />

      <div className="section-title">
        <h2 style={{ fontSize: "1rem" }}>
          Published photos <span className="badge">{items.length}</span>
        </h2>
      </div>
      {items.length === 0 && <div className="empty">No gallery photos yet.</div>}
      <div className="admin-photo-grid">
        {items.map((item) => (
          <figure key={item.id} className="admin-photo-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.mediaUrl} alt={item.title ?? ""} />
            <figcaption>
              <span>{item.title || "Untitled"}</span>
              <span className="meta">{galleryAlbumLabel(item.category)}</span>
            </figcaption>
            <form action={deleteGalleryItem.bind(null, item.id)}>
              <button className="btn outline small" type="submit">
                Remove
              </button>
            </form>
          </figure>
        ))}
      </div>
    </section>
  );
}
