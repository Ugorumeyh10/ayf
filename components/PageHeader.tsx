import type { ReactNode } from "react";
import Link from "next/link";

export default function PageHeader({
  kicker,
  title,
  lede,
  action,
}: {
  kicker: string;
  title: string;
  lede?: ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <header className="page-head">
      <p className="kicker">{kicker}</p>
      <div className="page-head-row">
        <h1>{title}</h1>
        {action && (
          <Link href={action.href} className="btn primary small">
            {action.label}
            <span className="chev" aria-hidden>
              →
            </span>
          </Link>
        )}
      </div>
      {lede ? <p className="page-lede">{lede}</p> : null}
    </header>
  );
}
