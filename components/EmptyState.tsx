import Link from "next/link";

export default function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="empty">
      <strong className="empty-title">{title}</strong>
      <p>{body}</p>
      {action && (
        <Link href={action.href} className="btn primary small">
          {action.label}
          <span className="chev" aria-hidden>
            →
          </span>
        </Link>
      )}
    </div>
  );
}
