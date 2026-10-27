"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createGalleryItem } from "../../../actions/admin-content";
import { GALLERY_ALBUMS } from "../../../../lib/gallery";
import ImagePreviewInput from "../../../../components/ImagePreviewInput";

const initial = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn primary" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
      {pending ? "Uploading…" : "Add photo"}
    </button>
  );
}

export default function GalleryForm() {
  const [state, action] = useFormState(createGalleryItem, initial);
  return (
    <form action={action} className="card admin-form">
      <h2 style={{ fontSize: "1rem" }}>Upload a photo</h2>
      <div className="field">
        <label htmlFor="category">Album</label>
        <select id="category" name="category" required defaultValue={GALLERY_ALBUMS[0].id}>
          {GALLERY_ALBUMS.map((album) => (
            <option key={album.id} value={album.id}>
              {album.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="title">Caption (optional)</label>
        <input id="title" name="title" maxLength={120} />
      </div>
      <ImagePreviewInput name="photo" label="Photo" hint="JPEG, PNG or WebP, under 4 MB." />
      <Submit />
      {state?.message && <div className={`msg ${state.ok ? "" : "err"}`}>{state.message}</div>}
    </form>
  );
}
