"use client";

import { useState } from "react";

export default function CopyAccount({
  accountNumber,
  bankName,
  accountName,
}: {
  accountNumber: string;
  bankName?: string | null;
  accountName?: string | null;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="dues-account">
      {accountName && (
        <p className="dues-line">
          <span>Account name</span>
          <strong>{accountName}</strong>
        </p>
      )}
      {bankName && (
        <p className="dues-line">
          <span>Bank</span>
          <strong>{bankName}</strong>
        </p>
      )}
      <p className="dues-line">
        <span>Account number</span>
        <strong className="dues-number">{accountNumber}</strong>
      </p>
      <button type="button" className="btn outline small" onClick={copy}>
        {copied ? "Copied" : "Copy account number"}
      </button>
    </div>
  );
}
