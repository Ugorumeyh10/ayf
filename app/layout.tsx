import type { Metadata } from "next";
import { Sora, IBM_Plex_Sans } from "next/font/google";
import Marquee from "../components/Marquee";
import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import PublicOnly from "../components/PublicOnly";
import { getSiteConfig } from "../lib/site-config";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Awka Youth Forum — Lagos Chapter",
  description:
    "Awka Youth Forum (AYF), Lagos Chapter — a non-religious, non-political, socio-cultural and community development association for Awka youths resident in Lagos State.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteConfig();

  return (
    <html lang="en" className={`${sora.variable} ${plex.variable}`}>
      <body>
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <PublicOnly>
          <Marquee motto={site.motto} slogan={site.slogan} />
        </PublicOnly>
        <AppNav />
        <main id="content">
          <PageTransition>{children}</PageTransition>
        </main>
        <PublicOnly>
          <Footer site={site} />
        </PublicOnly>
      </body>
    </html>
  );
}
