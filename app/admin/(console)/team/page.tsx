import { prisma } from "../../../../lib/prisma";
import { requireCapability } from "../../../../lib/guards";
import { deleteExecutive, updateExecutivePhoto } from "../../../actions/admin-content";
import ExecutiveForm from "./ExecutiveForm";

export default async function AdminTeamPage() {
  await requireCapability("content.publish");
  const executives = await prisma.executive.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <section className="block wrap">
      <p className="kicker">Admin</p>
      <h1>Executives</h1>
      <p>Names, offices and photos here appear on the public Meet the Executives page.</p>
      <ExecutiveForm />

      <div className="section-title">
        <h2 style={{ fontSize: "1rem" }}>
          Published profiles <span className="badge">{executives.length}</span>
        </h2>
      </div>
      {executives.length === 0 && <div className="empty">No executives published yet.</div>}
      <div className="member-list">
        {executives.map((e) => (
          <div key={e.id} className="member-row exec-admin-row">
            {e.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.photoUrl} alt="" className="exec-av" />
            ) : (
              <div className="av">{e.fullName.slice(0, 2).toUpperCase()}</div>
            )}
            <div className="who">
              <div className="name">{e.fullName}</div>
              <div className="meta">{e.position}</div>
            </div>
            <form action={updateExecutivePhoto.bind(null, e.id)} className="exec-photo-form">
              <input name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
              <button className="btn outline small" type="submit">
                {e.photoUrl ? "Replace photo" : "Upload photo"}
              </button>
            </form>
            {e.photoUrl && (
              <form action={updateExecutivePhoto.bind(null, e.id)}>
                <input type="hidden" name="removePhoto" value="on" />
                <button className="btn outline small" type="submit">
                  Remove photo
                </button>
              </form>
            )}
            <form action={deleteExecutive.bind(null, e.id)}>
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
