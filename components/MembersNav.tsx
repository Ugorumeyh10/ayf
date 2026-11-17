"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/members", label: "Profile", exact: true },
  { href: "/members/minutes", label: "Minutes" },
];

export default function MembersNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav" aria-label="Members">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link key={l.href} href={l.href} className={active ? "active" : ""}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
