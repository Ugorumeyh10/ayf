"use client";

import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "../actions/contact";

const initialState: ContactState = { ok: false, message: "" };

const TOPIC_SUBJECTS: Record<string, string> = {
  volunteer: "I'd like to volunteer",
  dues: "Membership dues",
  attendance: "Meeting attendance",
  partner: "Partnership enquiry",
  sponsor: "I'd like to sponsor a project",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn primary" style={{ width: "100%", justifyContent: "center" }} disabled={pending}>
      {pending ? "Sending..." : "Send message"}
      {!pending && (
        <span className="chev" aria-hidden>
          →
        </span>
      )}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useFormState(submitContact, initialState);
  const params = useSearchParams();
  const topic = params.get("topic") ?? "";
  const defaultSubject = TOPIC_SUBJECTS[topic] ?? "";

  return (
    <form action={formAction} className="card">
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="subject">Subject</label>
        <input id="subject" name="subject" required defaultValue={defaultSubject} key={defaultSubject} />
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required rows={4} />
      </div>
      <SubmitButton />
      {state.message && (
        <div className={`msg ${state.ok ? "" : "err"}`}>
          {state.ok && <span className="check" />}
          {state.message}
        </div>
      )}
    </form>
  );
}
