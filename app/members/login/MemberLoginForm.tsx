"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { requestMemberCode, verifyMemberCode, type OtpState } from "../../actions/member-auth";

const initial: OtpState = { ok: false, message: "" };

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn primary" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
      {pending ? "Sending…" : "Send sign-in code"}
    </button>
  );
}

function VerifyButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn primary" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
      {pending ? "Checking…" : "Sign in"}
    </button>
  );
}

export default function MemberLoginForm() {
  const [phone, setPhone] = useState("");
  const [sentState, sendAction] = useFormState(requestMemberCode, initial);
  const [verifyState, verifyAction] = useFormState(verifyMemberCode, initial);
  const sent = Boolean(sentState.sent);

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      {!sent ? (
        <form action={sendAction}>
          <div className="field">
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="08012345678"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <span className="hint">
              11-digit Nigerian number starting with 0. The code goes to this number — this is not an email login.
            </span>
          </div>
          <SendButton />
        </form>
      ) : (
        <form action={verifyAction}>
          <input type="hidden" name="phone" value={phone} />
          <p style={{ fontSize: "0.88rem", marginTop: 0 }}>Code sent for {phone}.</p>
          <div className="field">
            <label htmlFor="code">6-digit code</label>
            <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" required pattern="\d{6}" />
          </div>
          <VerifyButton />
        </form>
      )}
      {(verifyState.message || sentState.message) && (
        <div className={`msg ${(verifyState.message ? verifyState.ok : sentState.ok) ? "" : "err"}`}>
          {verifyState.message || sentState.message}
        </div>
      )}
    </div>
  );
}
