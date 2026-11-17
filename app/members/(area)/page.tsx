import Link from "next/link";
import { requireMemberSession } from "../../../lib/guards";
import { getSiteConfig } from "../../../lib/site-config";
import { prisma } from "../../../lib/prisma";
import DuesAccountCard from "../../../components/DuesAccountCard";

export default async function MembersHomePage() {
  const [member, site, minutesCount] = await Promise.all([
    requireMemberSession(),
    getSiteConfig(),
    prisma.meeting.count({ where: { status: "PUBLISHED" } }),
  ]);

  return (
    <section className="block wrap">
      <p className="kicker">Members</p>
      <h1>Hello, {member.fullName.split(" ")[0]}</h1>
      <p>This is your chapter record. Transfer dues using the official account below.</p>

      <div className="card-grid member-home-grid">
        <div className="card">
          <h2 style={{ fontSize: "1rem" }}>Your profile</h2>
          <p style={{ margin: "0 0 8px" }}>
            <strong>Phone</strong>
            <br />
            {member.phone}
          </p>
          {member.email && (
            <p style={{ margin: "0 0 8px" }}>
              <strong>Email</strong>
              <br />
              {member.email}
            </p>
          )}
          <p style={{ margin: "0 0 8px" }}>
            <strong>Village / Onuku</strong>
            <br />
            {member.village.name}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Status</strong>
            <br />
            {member.status}
          </p>
        </div>

        <Link href="/members/minutes" className="card">
          <div className="icon-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M8 13h8M8 17h8M8 9h2" />
            </svg>
          </div>
          <h3>Meeting minutes</h3>
          <p>
            {minutesCount === 0
              ? "Published chapter minutes will appear here."
              : `${minutesCount} published meeting${minutesCount === 1 ? "" : "s"} available.`}
          </p>
          <span className="btn outline small">
            Open minutes
            <span className="chev" aria-hidden>
              →
            </span>
          </span>
        </Link>
      </div>

      <div className="card" style={{ maxWidth: 560, marginTop: 18 }}>
        <h2 style={{ fontSize: "1rem" }}>Dues payment</h2>
        <p style={{ marginTop: 0 }}>
          Transfer to the official AYF Lagos Chapter account, then keep your bank reference for the treasurer.
        </p>
        <DuesAccountCard
          bankName={site.bankName}
          accountName={site.accountName}
          accountNumber={site.accountNumber}
        />
        {!site.accountNumber && (
          <p className="hint" style={{ marginBottom: 0 }}>
            The office has not published the dues account yet. Check back after the next meeting, or ask an officer.
          </p>
        )}
      </div>
    </section>
  );
}
