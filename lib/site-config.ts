import { prisma } from "./prisma";
import type { SiteConfig } from "@prisma/client";

export const SITE_CONFIG_DEFAULTS: Omit<SiteConfig, "updatedAt"> = {
  id: "ayf",
  officialName: "Awka Youth Forum, Lagos Chapter",
  rcNumber: "187901",
  motto: "Creating the Future Awka.",
  slogan: "AYF!! Greatly Connected! · AYF! Anyi Nwe Konne!!",
  email: "awkayouthforumlagos@gmail.com",
  phone: null,
  whatsapp: null,
  address: "Obu Awka (Apple Junction), Festac, Lagos",
  facebookUrl: null,
  instagramUrl: null,
  tiktokUrl: null,
  xUrl: null,
  linkedinUrl: null,
  youtubeUrl: null,
  meetingNote: "Second Sunday of every month, 3:00 PM – 6:00 PM",
  meetingVenue: "Obu Awka (Apple Junction), Festac, Lagos",
};

export async function getSiteConfig(): Promise<SiteConfig> {
  return prisma.siteConfig.upsert({
    where: { id: "ayf" },
    update: {},
    create: SITE_CONFIG_DEFAULTS,
  });
}
