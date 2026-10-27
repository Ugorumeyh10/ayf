"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createExecutive } from "../../../actions/admin-content";
import ImagePreviewInput from "../../../../components/ImagePreviewInput";

const initial = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn primary" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
      {pending ? "Saving…" : "Publish executive"}
    </button>
  );
}

export default function ExecutiveForm() {
  const [state, action] = useFormState(createExecutive, initial);
  return (
    <form action={action} className="card admin-form">
      <h2 style={{ fontSize: "1rem" }}>Add an executive</h2>
      <div className="field">
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" required minLength={2} />
      </div>
      <div className="field">
        <label htmlFor="position">Office / position</label>
        <input id="position" name="position" required minLength={2} placeholder="President" />
      </div>
      <div className="field">
        <label htmlFor="displayOrder">Display order</label>
        <input id="displayOrder" name="displayOrder" type="number" min={0} max={99} defaultValue={0} />
      </div>
      <div className="field">
        <label htmlFor="bio">Bio (optional)</label>
        <textarea id="bio" name="bio" rows={3} />
      </div>
      <ImagePreviewInput name="photo" label="Photo (optional)" hint="Shown on Meet the Executives. JPEG, PNG or WebP, under 4 MB." />
      <Submit />
      {state?.message && <div className={`msg ${state.ok ? "" : "err"}`}>{state.message}</div>}
    </form>
  );
}
