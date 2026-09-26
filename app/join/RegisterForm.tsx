"use client";

import { useState, type MouseEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { registerMember, type RegisterState } from "../actions/register";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const initialState: RegisterState = { ok: false, message: "" };

const steps = ["Who you are", "Village & birthday", "A little more"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn primary" disabled={pending}>
      {pending ? "Submitting..." : "Submit application"}
      {!pending && (
        <span className="chev" aria-hidden>
          →
        </span>
      )}
    </button>
  );
}

export default function RegisterForm({ villages }: { villages: { id: string; name: string }[] }) {
  const [state, formAction] = useFormState(registerMember, initialState);
  const [step, setStep] = useState(0);

  function goNext(e: MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.form;
    if (!form) return;
    const panel = form.querySelector(`[data-step-panel="${step}"]`);
    if (!panel) return;
    const fields = panel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea"
    );
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return;
      }
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  return (
    <form action={formAction} className="card">
      <div className="stepper" aria-hidden>
        {steps.map((_, i) => (
          <div key={i} className={`pip ${i < step ? "done" : ""} ${i === step ? "current" : ""}`}>
            <span />
          </div>
        ))}
      </div>
      <p className="step-kicker">
        Step {step + 1} of {steps.length} · {steps[step]}
      </p>

      <div data-step-panel="0" hidden={step !== 0}>
        <Field label="Full name" name="fullName" required autoComplete="name" />
        <Field
          label="Phone number (WhatsApp)"
          name="phone"
          required
          placeholder="0803 000 0000"
          autoComplete="tel"
          hint="We'll use this to reach you about your application."
        />
        <Field label="Email (optional)" name="email" type="email" autoComplete="email" />
      </div>

      <div data-step-panel="1" hidden={step !== 1}>
        <div style={{ display: "flex", gap: 10 }}>
          <Field label="Birth day" name="birthDay" type="number" min={1} max={31} required />
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="birthMonth">Birth month</label>
            <select id="birthMonth" name="birthMonth" required defaultValue="">
              <option value="" disabled>
                Select month
              </option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <span className="hint">Day and month only — we don't store a full date of birth.</span>
          </div>
        </div>
        <div className="field">
          <label htmlFor="villageId">Village / Onuku</label>
          <select id="villageId" name="villageId" required defaultValue="">
            <option value="" disabled>
              Select your village
            </option>
            {villages.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div data-step-panel="2" hidden={step !== 2}>
        <Field label="Residential location (optional)" name="residentialLocation" autoComplete="address-level2" />
        <Field label="Occupation (optional)" name="occupation" />
        <Field label="Area of interest (optional)" name="areaOfInterest" />
        <Field label="Skills / professional expertise (optional)" name="skills" />
        <label className="checkbox-row">
          <input type="checkbox" name="isMinor" value="true" />
          I am registering someone under 18 / this applies to a minor
        </label>
      </div>

      {state.message && (
        <div className={`msg ${state.ok ? "" : "err"}`}>
          {state.ok && <span className="check" />}
          {state.message}
        </div>
      )}

      <div className="form-nav">
        {step > 0 && (
          <button type="button" className="btn outline" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button type="button" className="btn primary" onClick={goNext}>
            Continue
            <span className="chev" aria-hidden>
              →
            </span>
          </button>
        ) : (
          <SubmitButton />
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  min,
  max,
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <div className="field" style={{ flex: 1 }}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        autoComplete={autoComplete}
      />
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}
