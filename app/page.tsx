import Link from "next/link";
import { prisma } from "../lib/prisma";
import { getSiteConfig } from "../lib/site-config";
import Reveal from "../components/Reveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredEvent, upcomingEvent, memberCount, villageCount, site] = await Promise.all([
    prisma.event.findFirst({
      where: { isFeatured: true },
      orderBy: { date: "asc" },
    }),
    prisma.event.findFirst({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
    }),
    prisma.member.count({ where: { status: "ACTIVE" } }),
    prisma.village.count(),
    getSiteConfig(),
  ]);

  const event = featuredEvent ?? upcomingEvent;

  return (
    <>
      <div
        className="hero"
        style={{
          backgroundImage:
            "linear-gradient(100deg, rgba(20,17,15,.52) 0%, rgba(20,17,15,.20) 40%, rgba(20,17,15,0) 65%), " +
            "linear-gradient(to top, rgba(20,17,15,.55) 0%, rgba(20,17,15,0) 35%), " +
            "url(/hero-photo.jpg)",
        }}
      >
        <div className="hero-inner wrap">
          <p className="eyebrow">Awka Youth Forum &middot; Lagos Chapter</p>
          <h1>Building the future of Awka, together.</h1>
          <p className="lede">
            A non-religious, non-political, socio-cultural and community development association for Awka
            youths resident in Lagos State.
          </p>
          <div className="cta-row">
            <Link href="/join" className="btn primary">
              Join AYF
              <span className="chev" aria-hidden>
                →
              </span>
            </Link>
            <Link href="/get-involved" className="btn ghost-light">
              Get Involved
            </Link>
          </div>
        </div>
      </div>

      <div className="motto-strip">
        &ldquo;{site.motto}&rdquo;
        <span>{site.slogan}</span>
      </div>

      <section className="block wrap">
        <div className="why-grid stagger">
          <Link href="/about" className="why-item">
            <div className="icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Community</h3>
            <p>A home for Awka youths in Lagos to connect, interact and cooperate.</p>
            <span className="why-link">
              About AYF <span className="chev">→</span>
            </span>
          </Link>
          <Link href="/get-involved" className="why-item">
            <div className="icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h3>Growth</h3>
            <p>Mentorship, networking and opportunities that support personal and economic advancement.</p>
            <span className="why-link">
              Ways to plug in <span className="chev">→</span>
            </span>
          </Link>
          <Link href="/join" className="why-item">
            <div className="icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
              </svg>
            </div>
            <h3>Culture</h3>
            <p>Cultural values and community development carried forward by the next generation.</p>
            <span className="why-link">
              Become a member <span className="chev">→</span>
            </span>
          </Link>
        </div>

        <Reveal>
          <div className="proof">
            <div className="proof-item">
              <strong>{memberCount.toLocaleString("en-GB")}</strong>
              <span>Active members</span>
            </div>
            <div className="proof-item">
              <strong>{villageCount}</strong>
              <span>Villages / Onuku</span>
            </div>
            <div className="proof-item">
              <strong>Lagos</strong>
              <span>Chapter home</span>
            </div>
          </div>
        </Reveal>

        {event && (
          <Reveal>
            <Link href={`/events#${event.id}`} className="featured-event">
              <div className="fe-tag">Upcoming event</div>
              <div className="fe-body">
                <div className="fe-date">
                  <span className="d">{event.date.getDate()}</span>
                  <span className="m">{event.date.toLocaleString("en-GB", { month: "long" })}</span>
                </div>
                <div className="fe-info">
                  <h3>{event.name}</h3>
                  <p>
                    {event.date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} &middot;{" "}
                    {event.venue}
                    {event.address ? ` — ${event.address}` : ""}
                  </p>
                  <span className="btn primary small">
                    View event details
                    <span className="chev" aria-hidden>
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        <Reveal>
          <div className="section-title">
            <h2 style={{ fontSize: "1.1rem" }}>Start here</h2>
            <Link href="/get-involved">See all ways in</Link>
          </div>
          <div className="card-grid stagger">
            <Link href="/join" className="card">
              <div className="icon-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
              <h3>Join as a member</h3>
              <p>Apply in a few minutes. An administrator reviews every application.</p>
              <span className="btn outline small">
                Register
                <span className="chev" aria-hidden>
                  →
                </span>
              </span>
            </Link>
            <Link href="/events" className="card">
              <div className="icon-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <line x1="8" y1="3" x2="8" y2="7" />
                  <line x1="16" y1="3" x2="16" y2="7" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3>Come to an event</h3>
              <p>Meetings, celebrations and community programmes across Lagos.</p>
              <span className="btn outline small">
                See events
                <span className="chev" aria-hidden>
                  →
                </span>
              </span>
            </Link>
            <Link href="/contact" className="card">
              <div className="icon-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16v16H4z" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </div>
              <h3>Partner or volunteer</h3>
              <p>Bring skills, sponsorship or an idea — we will get back to you.</p>
              <span className="btn outline small">
                Contact us
                <span className="chev" aria-hidden>
                  →
                </span>
              </span>
            </Link>
          </div>
        </Reveal>

        <Reveal>
          <div className="cta-band">
            <div>
              <h2>Ready to plug in?</h2>
              <p>Membership is open to eligible Awka youths resident in Lagos State.</p>
            </div>
            <div className="cta-row" style={{ marginTop: 0 }}>
              <Link href="/join" className="btn primary">
                Join AYF
                <span className="chev" aria-hidden>
                  →
                </span>
              </Link>
              <Link href="/about" className="btn ghost-light">
                Learn more
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
