import Link from "next/link";
import PageHeader from "../../components/PageHeader";

export default function AboutPage() {
  return (
    <section className="block wrap" style={{ maxWidth: 760 }}>
      <PageHeader
        kicker="About"
        title="About AYF"
        lede="Awka Youth Forum (AYF), Lagos Chapter is a non-religious, non-political, socio-cultural and community development association established to promote the development, peace, unity and well-being of Awka youths and the wider Awka community."
        action={{ href: "/join", label: "Join AYF" }}
      />

      <div className="vision-grid">
        <div className="card">
          <h3>Vision</h3>
          <p style={{ margin: 0 }}>
            To build a united, progressive and empowered generation of Awka youths who contribute meaningfully to
            the development of Awka, Lagos and society at large.
          </p>
        </div>
        <div className="card">
          <h3>Mission</h3>
          <p style={{ margin: 0 }}>
            To unite and empower Awka youths through meaningful social interaction, professional development,
            mentorship, networking, community service and cultural values.
          </p>
        </div>
      </div>

      <div className="section-title">
        <h2 style={{ fontSize: "1.1rem" }}>Aims &amp; objectives</h2>
      </div>
      <div className="numbered-list stagger">
        <div className="numbered-item">
          <span className="num-mark">01</span>
          <p>Examine and address the needs and issues of concern to Awka youths.</p>
        </div>
        <div className="numbered-item">
          <span className="num-mark">02</span>
          <p>Promote the development, peace and well-being of Awka youths and the wider community.</p>
        </div>
        <div className="numbered-item">
          <span className="num-mark">03</span>
          <p>Encourage social interaction, fellowship and cooperation among members.</p>
        </div>
        <div className="numbered-item">
          <span className="num-mark">04</span>
          <p>Identify opportunities that promote youth development and empowerment.</p>
        </div>
      </div>

      <div className="cta-band" style={{ marginTop: 36 }}>
        <div>
          <h2>The Forum is built by its members.</h2>
          <p>Meet the executives, or start your application today.</p>
        </div>
        <div className="cta-row" style={{ marginTop: 0 }}>
          <Link href="/team" className="btn ghost-light">
            Our team
          </Link>
          <Link href="/join" className="btn primary">
            Become a member
            <span className="chev" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
