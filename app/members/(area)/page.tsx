import { requireMemberSession } from "../../../lib/guards";

export default async function MembersHomePage() {
  const member = await requireMemberSession();

  return (
    <section className="block wrap">
      <p className="kicker">Members</p>
      <h1>Hello, {member.fullName.split(" ")[0]}</h1>
      <p>This is your chapter record. Dues confirmation and meeting attendance will appear here next.</p>

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
    </section>
  );
}
