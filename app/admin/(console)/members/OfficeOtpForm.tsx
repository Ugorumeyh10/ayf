"use client";

import { useFormState, useFormStatus } from "react-dom";
import { issueOfficeMemberCode, type OfficeOtpState } from "../../../actions/admin-members";

const initial: OfficeOtpState = { ok: false, message: "" };

function IssueButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn primary small" disabled={pending}>
      {pending ? "Issuing…" : "Issue sign-in code"}
    </button>
  );
}

export default function OfficeOtpForm() {
  const [state, action] = useFormState(issueOfficeMemberCode, initial);

  return (
    <form action={action} className="card" style={{ maxWidth: 520, margin: "12px 0 24px" }}>
      <p style={{ fontSize: "0.85rem", marginTop: 0 }}>
        Until Termii SMS is connected, issue a 6-digit code here and pass it to the member (WhatsApp is fine).
      </p>
      <div className="field">
        <label htmlFor="office-otp-phone">Member phone</label>
        <input id="office-otp-phone" name="phone" type="tel" inputMode="numeric" placeholder="08012345678" required />
      </div>
      <IssueButton />
      {state.message && <div className={`msg ${state.ok ? "" : "err"}`}>{state.message}</div>}
    </form>
  );
}
