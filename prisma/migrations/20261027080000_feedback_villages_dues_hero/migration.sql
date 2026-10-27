-- Village listing order for the official 33 Awka communities.
ALTER TABLE "Village" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Village" ADD COLUMN "listed" BOOLEAN NOT NULL DEFAULT true;

-- Dues account + admin-controlled homepage hero.
ALTER TABLE "SiteConfig" ADD COLUMN "bankName" TEXT;
ALTER TABLE "SiteConfig" ADD COLUMN "accountName" TEXT;
ALTER TABLE "SiteConfig" ADD COLUMN "accountNumber" TEXT;
ALTER TABLE "SiteConfig" ADD COLUMN "heroImageUrl" TEXT;
