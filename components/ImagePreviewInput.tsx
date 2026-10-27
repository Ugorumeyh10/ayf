"use client";

import { useState } from "react";

export default function ImagePreviewInput({
  name = "photo",
  label = "Photo",
  currentUrl,
  hint,
}: {
  name?: string;
  label?: string;
  currentUrl?: string | null;
  hint?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {(preview || currentUrl) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview || currentUrl || ""} alt="" className="upload-preview" />
      )}
      <input
        id={name}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setPreview(file ? URL.createObjectURL(file) : null);
        }}
      />
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}