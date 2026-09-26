/**
 * Loads the cleaned legacy membership spreadsheet (Bio_data_AYF.xlsx) into
 * the database. Run once against a fresh database:
 *
 *   npm run prisma:seed
 *
 * Members flagged `needsReview: true` (shared a phone number with another
 * row in the original spreadsheet) are still imported — as ACTIVE, since
 * they are real existing members — but carry `needsReview: true` so the
 * admin dashboard can surface them for a treasurer/secretary to look at
 * and confirm they aren't duplicate entries before dues/attendance start
 * accumulating against the wrong record.
 */
import { PrismaClient, MembershipStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import villages from "./villages-seed.json";
import members from "./members-seed.json";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${villages.length} villages...`);
  const villageIdByName = new Map<string, string>();
  for (const v of villages as { id: string; name: string }[]) {
    const created = await prisma.village.upsert({
      where: { name: v.name },
      update: {},
      create: { name: v.name },
    });
    villageIdByName.set(v.name, created.id);
  }

  console.log(`Seeding ${members.length} members...`);
  let created = 0;
  let skipped = 0;
  for (const m of members as any[]) {
    const villageId = villageIdByName.get(m.village);
    if (!villageId) {
      console.warn(`Skipping ${m.fullName} — unknown village "${m.village}"`);
      skipped++;
      continue;
    }
    const existing = await prisma.member.findUnique({ where: { phone: m.phone } });
    if (existing) {
      // Phone is the unique key; the second half of a duplicate pair from
      // the spreadsheet will land here. Left for manual reconciliation.
      console.warn(
        `Skipping ${m.fullName} (${m.phone}) — a member with this phone already exists: ${existing.fullName}. Reconcile manually.`
      );
      skipped++;
      continue;
    }
    await prisma.member.create({
      data: {
        fullName: m.fullName,
        birthDay: m.birthDay,
        birthMonth: m.birthMonth,
        village: { connect: { id: villageId } },
        phone: m.phone,
        email: m.email ?? null,
        status: MembershipStatus.ACTIVE, // pre-existing members, not new applicants
        source: m.source,
        needsReview: m.needsReview,
      },
    });
    created++;
  }

  console.log(`Done. Created ${created} members, skipped ${skipped} (duplicates / bad data).`);

  const awkaDayName = "AYF Awka Day Celebration 2026";
  const existingEvent = await prisma.event.findFirst({ where: { name: awkaDayName } });
  if (!existingEvent) {
    await prisma.event.create({
      data: {
        name: awkaDayName,
        date: new Date("2026-11-21T13:00:00+01:00"),
        venue: "FHA Field, Festac Town",
        address: "23 Road, Festac Town, Lagos 102102",
        description:
          "The Lagos Chapter's annual Awka Day celebration — culture, community, and connection.",
        isFeatured: true,
        registrationOpen: true,
      },
    });
    console.log("Seeded featured event: AYF Awka Day Celebration 2026");
  }

  await prisma.siteConfig.upsert({
    where: { id: "ayf" },
    update: {},
    create: {
      id: "ayf",
      officialName: "Awka Youth Forum, Lagos Chapter",
      rcNumber: "187901",
      motto: "Creating the Future Awka.",
      slogan: "AYF!! Greatly Connected! · AYF! Anyi Nwe Konne!!",
      email: "awkayouthforumlagos@gmail.com",
      address: "Obu Awka (Apple Junction), Festac, Lagos",
      meetingNote: "Second Sunday of every month, 3:00 PM – 6:00 PM",
      meetingVenue: "Obu Awka (Apple Junction), Festac, Lagos",
    },
  });
  console.log("Ensured SiteConfig singleton.");

  const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (adminEmail && adminPassword) {
    const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await prisma.adminUser.create({
        data: {
          name: process.env.ADMIN_BOOTSTRAP_NAME ?? "IT Lead",
          email: adminEmail,
          passwordHash,
          role: "SUPER_ADMIN",
        },
      });
      console.log(`Created SUPER_ADMIN ${adminEmail}`);
    } else {
      console.log(`SUPER_ADMIN ${adminEmail} already exists — password left unchanged.`);
    }
  } else {
    console.log("Skipping admin bootstrap (set ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD).");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
