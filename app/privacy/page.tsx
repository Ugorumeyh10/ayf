import PageHeader from "../../components/PageHeader";

export default function PrivacyPage() {
  return (
    <section className="block wrap" style={{ maxWidth: 720 }}>
      <PageHeader
        kicker="Legal"
        title="Privacy policy"
        lede="How the Lagos Chapter handles the information you share when you join or write to us."
      />
      <div className="card" style={{ marginTop: 14 }}>
        <h3>What we collect</h3>
        <p style={{ margin: 0 }}>
          Full name, phone number, birth day and month (not full date of birth), village/Onuku, and any
          optional details you choose to provide.
        </p>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3>Members under 18</h3>
        <p style={{ margin: 0 }}>
          We deliberately do not collect a full date of birth, and any additional safeguarding steps AYF
          requires for minor members will be applied to their records.
        </p>
      </div>
    </section>
  );
}
