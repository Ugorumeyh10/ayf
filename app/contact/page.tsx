import { Suspense } from "react";
import PageHeader from "../../components/PageHeader";
import ContactForm from "./ContactForm";
import { getSiteConfig } from "../../lib/site-config";

export default async function ContactPage() {
  const site = await getSiteConfig();
  const mapQuery = encodeURIComponent(site.address);

  return (
    <section className="block wrap">
      <PageHeader
        kicker="Say hello"
        title="Contact AYF"
        lede="Questions, partnerships, volunteering — send a note and the secretariat will pick it up."
      />

      <div className="contact-tiles">
        <a className="card" href={`mailto:${site.email}`}>
          <h3>Email</h3>
          <p>{site.email}</p>
          <span className="btn outline small">
            Write an email
            <span className="chev" aria-hidden>
              →
            </span>
          </span>
        </a>
        <a
          className="card"
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noreferrer"
        >
          <h3>Meet us</h3>
          <p>
            {site.meetingVenue}
            <br />
            {site.meetingNote}
          </p>
          <span className="btn outline small">
            Open map
            <span className="chev" aria-hidden>
              →
            </span>
          </span>
        </a>
        {site.phone && (
          <a className="card" href={`tel:${site.phone}`}>
            <h3>Phone</h3>
            <p>{site.phone}</p>
            <span className="btn outline small">
              Call
              <span className="chev" aria-hidden>
                →
              </span>
            </span>
          </a>
        )}
      </div>

      <Suspense fallback={<div className="card">Loading form…</div>}>
        <ContactForm />
      </Suspense>
    </section>
  );
}
