"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createEvent } from "../../../actions/admin-content";

const initial = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn primary" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
      {pending ? "Publishing…" : "Publish event"}
    </button>
  );
}

export default function EventForm() {
  const [state, action] = useFormState(createEvent, initial);
  return (
    <form action={action} className="card admin-form">
      <h2 style={{ fontSize: "1rem" }}>New event</h2>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required minLength={3} />
      </div>
      <div className="field">
        <label htmlFor="date">Date and time</label>
        <input id="date" name="date" type="datetime-local" required />
      </div>
      <div className="field">
        <label htmlFor="venue">Venue</label>
        <input id="venue" name="venue" required minLength={2} />
      </div>
      <div className="field">
        <label htmlFor="address">Address (optional)</label>
        <input id="address" name="address" />
      </div>
      <div className="field">
        <label htmlFor="description">Description (optional)</label>
        <textarea id="description" name="description" rows={3} />
      </div>
      <label className="checkbox-row">
        <input type="checkbox" name="isFeatured" />
        Feature this on the home page (replaces the current featured event)
      </label>
      <label className="checkbox-row">
        <input type="checkbox" name="registrationOpen" defaultChecked />
        Registration open
      </label>
      <Submit />
      {state?.message && <div className={`msg ${state.ok ? "" : "err"}`}>{state.message}</div>}
    </form>
  );
}
