import { Prisma, type SiteConfig } from "@prisma/client";
import { prisma } from "./prisma";

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
  const existing = await prisma.siteConfig.findUnique({ where: { id: "ayf" } });
  if (existing) return existing;

  try {
    return await prisma.siteConfig.create({ data: SITE_CONFIG_DEFAULTS });
  } catch (error) {
    // Parallel prerenders (home + /_not-found) can both miss the row and create.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const raced = await prisma.siteConfig.findUnique({ where: { id: "ayf" } });
      if (raced) return raced;
    }
    throw error;
  }
}
