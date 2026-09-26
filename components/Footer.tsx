import Link from "next/link";
import type { SiteConfig } from "@prisma/client";

function socialHref(url: string | null, fallback: string) {
  return url && url.length > 0 ? url : fallback;
}

export default function Footer({ site }: { site: SiteConfig }) {
  const mapQuery = encodeURIComponent(site.address);
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <h4>Awka Youth Forum</h4>
            <p>
              A non-religious, non-political, socio-cultural and community development association for Awka
              youths resident in Lagos State. RC {site.rcNumber}.
            </p>
            <div className="footer-social">
              <a href={socialHref(site.facebookUrl, "/contact")} title="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href={socialHref(site.instagramUrl, "/contact")} title="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </a>
              <a
                href={site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/\D/g, "")}` : "/contact"}
                title="WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20l1.1-5.5A8.5 8.5 0 1 1 21 11.5z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4>Quick links</h4>
            <div className="footer-links">
              <Link href="/about">About Us</Link>
              <Link href="/team">Our Team</Link>
              <Link href="/events">Events</Link>
              <Link href="/get-involved">Get Involved</Link>
              <Link href="/join">Join AYF</Link>
              <Link href="/members/login">Members’ area</Link>
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>
          <div>
            <h4>Contact</h4>
            <p>
              {site.address}
              <br />
              {site.meetingNote}
            </p>
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer">
                Open map
              </a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {site.officialName}</span>
          <span>
            RC {site.rcNumber} · <Link href="/admin/login">Admin</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
