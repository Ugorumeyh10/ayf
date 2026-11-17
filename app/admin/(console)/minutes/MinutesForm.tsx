"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { Meeting } from "@prisma/client";
import { createMinutes, updateMinutes, type MinutesState } from "../../../actions/admin-minutes";

const initial: MinutesState = { ok: false, message: "" };

function Submit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn primary" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
      {pending ? pendingLabel : label}
    </button>
  );
}

function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function Fields({ meeting }: { meeting?: Meeting }) {
  return (
    <>
      <div className="field">
        <label htmlFor="title">Meeting title</label>
        <input
          id="title"
          name="title"
          required
          minLength={3}
          defaultValue={meeting?.title ?? ""}
          placeholder="Monthly general meeting"
        />
      </div>
      <div className="field">
        <label htmlFor="date">Date and time</label>
        <input
          id="date"
          name="date"
          type="datetime-local"
          required
          defaultValue={meeting ? toLocalInput(meeting.date) : ""}
        />
      </div>
      <div className="field">
        <label htmlFor="venue">Venue (optional)</label>
        <input id="venue" name="venue" defaultValue={meeting?.venue ?? ""} placeholder="Obu Awka, Festac" />
      </div>
      <div className="field">
        <label htmlFor="agenda">Agenda</label>
        <textarea
          id="agenda"
          name="agenda"
          rows={4}
          defaultValue={meeting?.agenda ?? ""}
          placeholder="Opening prayer, apologies, matters arising…"
        />
      </div>
      <div className="field">
        <label htmlFor="attendeesNote">Attendance note</label>
        <textarea
          id="attendeesNote"
          name="attendeesNote"
          rows={3}
          defaultValue={meeting?.attendeesNote ?? ""}
          placeholder="42 members present. Executives: …"
        />
      </div>
      <div className="field">
        <label htmlFor="minutesBody">Minutes</label>
        <textarea
          id="minutesBody"
          name="minutesBody"
          rows={12}
          defaultValue={meeting?.minutesBody ?? ""}
          placeholder="Record of discussion and proceedings…"
        />
      </div>
      <div className="field">
        <label htmlFor="decisions">Key decisions / resolutions</label>
        <textarea
          id="decisions"
          name="decisions"
          rows={4}
          defaultValue={meeting?.decisions ?? ""}
          placeholder="Resolved that…"
        />
      </div>
    </>
  );
}

export function CreateMinutesForm() {
  const [state, action] = useFormState(createMinutes, initial);
  return (
    <form action={action} className="card admin-form minutes-form">
      <h2 style={{ fontSize: "1rem" }}>New meeting minutes</h2>
      <p className="hint" style={{ marginTop: 0 }}>
        Saved as a draft. Publish when ready so active members can read it.
      </p>
      <Fields />
      <Submit label="Save draft" pendingLabel="Saving…" />
      {state?.message && <div className={`msg ${state.ok ? "" : "err"}`}>{state.message}</div>}
    </form>
  );
}

export function EditMinutesForm({ meeting }: { meeting: Meeting }) {
  const bound = updateMinutes.bind(null, meeting.id);
  const [state, action] = useFormState(bound, initial);
  return (
    <form action={action} className="card admin-form minutes-form">
      <h2 style={{ fontSize: "1rem" }}>Edit minutes</h2>
      <Fields meeting={meeting} />
      <Submit label="Save changes" pendingLabel="Saving…" />
      {state?.message && <div className={`msg ${state.ok ? "" : "err"}`}>{state.message}</div>}
    </form>
  );
}
