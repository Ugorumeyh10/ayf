import Link from "next/link";
import PageHeader from "../../components/PageHeader";

const options = [
  {
    title: "Join AYF",
    desc: "For prospective members who wish to become members.",
    href: "/join",
    label: "Start application",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Volunteer",
    desc: "Contribute your time, skills or expertise.",
    href: "/contact?topic=volunteer",
    label: "Offer your time",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    ),
  },
  {
    title: "Pay dues",
    desc: "For registered members to make approved membership payments.",
    href: "/members/login",
    label: "Open members’ area",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    title: "Attendance",
    desc: "Record or confirm attendance at meetings and activities.",
    href: "/members/login",
    label: "Open members’ area",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: "Partner with us",
    desc: "For organizations interested in collaborating with AYF.",
    href: "/contact?topic=partner",
    label: "Start a partnership",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4 8 4v14" />
        <path d="M9 9h1M9 13h1M14 9h1M14 13h1" />
      </svg>
    ),
  },
  {
    title: "Sponsor a project",
    desc: "Support specific AYF initiatives.",
    href: "/contact?topic=sponsor",
    label: "Sponsor an initiative",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
      </svg>
    ),
  },
];

export default function GetInvolvedPage() {
  return (
    <section className="block wrap">
      <PageHeader
        kicker="Get involved"
        title="Ways to plug in"
        lede="Every card is a door in — membership, volunteering, partnership or sponsorship. Pick the one that fits."
      />
      <div className="card-grid stagger">
        {options.map((o) => (
          <Link key={o.title} href={o.href} className="card">
            <div className="icon-badge">{o.icon}</div>
            <h3>{o.title}</h3>
            <p>{o.desc}</p>
            <span className="btn outline small">
              {o.label}
              <span className="chev" aria-hidden>
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
