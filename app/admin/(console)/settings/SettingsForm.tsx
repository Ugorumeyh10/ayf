"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { SiteConfig } from "@prisma/client";
import { updateSiteConfig } from "../../../actions/admin-content";

const initial = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn primary" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
      {pending ? "Saving…" : "Save public settings"}
    </button>
  );
}

export default function SettingsForm({ site }: { site: SiteConfig }) {
  const [state, action] = useFormState(updateSiteConfig, initial);
  return (
    <form action={action} className="card admin-form">
      <div className="field">
        <label htmlFor="officialName">Official name</label>
        <input id="officialName" name="officialName" required defaultValue={site.officialName} />
      </div>
      <div className="field">
        <label htmlFor="rcNumber">RC number</label>
        <input id="rcNumber" name="rcNumber" required defaultValue={site.rcNumber} />
      </div>
      <div className="field">
        <label htmlFor="motto">Motto</label>
        <input id="motto" name="motto" required defaultValue={site.motto} />
      </div>
      <div className="field">
        <label htmlFor="slogan">Slogan</label>
        <input id="slogan" name="slogan" required defaultValue={site.slogan} />
      </div>
      <div className="field">
        <label htmlFor="email">Public email</label>
        <input id="email" name="email" type="email" required defaultValue={site.email} />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" defaultValue={site.phone ?? ""} />
      </div>
      <div className="field">
        <label htmlFor="whatsapp">WhatsApp (optional)</label>
        <input id="whatsapp" name="whatsapp" defaultValue={site.whatsapp ?? ""} />
      </div>
      <div className="field">
        <label htmlFor="address">Address</label>
        <input id="address" name="address" required defaultValue={site.address} />
      </div>
      <div className="field">
        <label htmlFor="meetingNote">Meeting note</label>
        <input id="meetingNote" name="meetingNote" required defaultValue={site.meetingNote} />
      </div>
      <div className="field">
        <label htmlFor="meetingVenue">Meeting venue</label>
        <input id="meetingVenue" name="meetingVenue" required defaultValue={site.meetingVenue} />
      </div>
      <div className="field">
        <label htmlFor="facebookUrl">Facebook URL (optional)</label>
        <input id="facebookUrl" name="facebookUrl" type="url" defaultValue={site.facebookUrl ?? ""} />
      </div>
      <div className="field">
        <label htmlFor="instagramUrl">Instagram URL (optional)</label>
        <input id="instagramUrl" name="instagramUrl" type="url" defaultValue={site.instagramUrl ?? ""} />
      </div>
      <Submit />
      {state?.message && <div className={`msg ${state.ok ? "" : "err"}`}>{state.message}</div>}
    </form>
  );
}
