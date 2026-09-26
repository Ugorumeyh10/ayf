"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const desktopLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

const moreLinks = [
  { href: "/news", label: "News" },
  { href: "/gallery", label: "Gallery" },
  { href: "/team", label: "Our Team" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/members/login", label: "Members’ area" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/admin/login", label: "Admin sign in" },
];

const bottomPrimary = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    href: "/events",
    label: "Events",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <line x1="8" y1="3" x2="8" y2="7" />
        <line x1="16" y1="3" x2="16" y2="7" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/join",
    label: "Join",
    fab: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
  {
    href: "/get-involved",
    label: "Involved",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    ),
  },
];

const sheetGroups: { label: string; links: { href: string; label: string; hint?: string }[] }[] = [
  {
    label: "Community",
    links: [
      { href: "/about", label: "About Us", hint: "Vision & aims" },
      { href: "/team", label: "Our Team", hint: "Executives" },
      { href: "/news", label: "News", hint: "Announcements" },
      { href: "/gallery", label: "Gallery", hint: "Photos" },
      { href: "/contact", label: "Contact", hint: "Write to us" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
  {
    label: "Account",
    links: [
      { href: "/members/login", label: "Members’ area", hint: "Phone sign-in" },
      { href: "/admin/login", label: "Admin sign in", hint: "Office only" },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSheetOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!sheetOpen && !moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSheetOpen(false);
        setMoreOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    if (sheetOpen) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      document.body.style.overflow = "";
    };
  }, [sheetOpen, moreOpen]);

  const moreActive = moreLinks.some((l) => isActivePath(pathname, l.href));
  const hideChrome = pathname.startsWith("/admin") || pathname.startsWith("/members");
  if (hideChrome) return null;

  return (
    <>
      <header className={`site ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap inner">
          <Link href="/" className="brand">
            <span className="mark">
              <Image src="/logo.jpg" alt="AYF logo" width={34} height={34} style={{ objectFit: "cover" }} />
            </span>
            AWKA YOUTH FORUM
          </Link>

          <div className="nav-right">
            <nav className="desktop-tabs" aria-label="Primary">
              {desktopLinks.map((l) => (
                <Link key={l.href} href={l.href} className={isActivePath(pathname, l.href) ? "active" : ""}>
                  {l.label}
                </Link>
              ))}
              <div className={`nav-more ${moreOpen ? "open" : ""}`} ref={moreRef}>
                <button
                  type="button"
                  className={`tab-more ${moreActive ? "active" : ""}`}
                  aria-expanded={moreOpen}
                  aria-haspopup="menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMoreOpen((v) => !v);
                  }}
                >
                  More
                </button>
                <div className="nav-more-menu" role="menu">
                  {moreLinks.map((l) => (
                    <Link key={l.href} href={l.href} role="menuitem" onClick={() => setMoreOpen(false)}>
                      {l.label}
                      <span aria-hidden>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <Link href="/join" className="btn primary small nav-cta">
              Join AYF
              <span className="chev" aria-hidden>
                →
              </span>
            </Link>
          </div>

          <button
            className="more-btn"
            type="button"
            aria-expanded={sheetOpen}
            aria-controls="more-sheet"
            onClick={() => setSheetOpen(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
            Menu
          </button>
        </div>
      </header>

      <nav className="bottom-nav" aria-label="Mobile">
        {bottomPrimary.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`${isActivePath(pathname, l.href) ? "active" : ""} ${"fab" in l && l.fab ? "fab" : ""}`.trim()}
          >
            {l.icon}
            {l.label}
          </Link>
        ))}
        <button type="button" onClick={() => setSheetOpen(true)} className={sheetOpen ? "active" : ""}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
          More
        </button>
      </nav>

      <div
        className={`sheet-backdrop ${sheetOpen ? "open" : ""}`}
        onClick={() => setSheetOpen(false)}
        aria-hidden={!sheetOpen}
      />
      <div
        id="more-sheet"
        className={`sheet ${sheetOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="More pages"
        aria-hidden={!sheetOpen}
      >
        <div className="handle" />
        {sheetGroups.map((group) => (
          <div key={group.label}>
            <div className="group-label">{group.label}</div>
            {group.links.map((l) => (
              <Link key={l.href} href={l.href} className="sheet-item" onClick={() => setSheetOpen(false)}>
                <span>{l.label}</span>
                <span className="hint">{l.hint ?? "→"}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
