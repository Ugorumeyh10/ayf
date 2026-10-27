import { requireMemberSession } from "../../../lib/guards";
import { getSiteConfig } from "../../../lib/site-config";
import DuesAccountCard from "../../../components/DuesAccountCard";

export default async function MembersHomePage() {
  const [member, site] = await Promise.all([requireMemberSession(), getSiteConfig()]);

  return (
    <section className="block wrap">
      <p className="kicker">Members</p>
      <h1>Hello, {member.fullName.split(" ")[0]}</h1>
      <p>This is your chapter record. Transfer dues using the official account below.</p>

      <div className="card" style={{ maxWidth: 520, marginTop: 18 }}>
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

      <div className="card" style={{ maxWidth: 520, marginTop: 18 }}>
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
