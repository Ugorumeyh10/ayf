-- CreateTable
CREATE TABLE "MemberOtp" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberOtp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL DEFAULT 'ayf',
    "officialName" TEXT NOT NULL,
    "rcNumber" TEXT NOT NULL,
    "motto" TEXT NOT NULL,
    "slogan" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT NOT NULL,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "tiktokUrl" TEXT,
    "xUrl" TEXT,
    "linkedinUrl" TEXT,
    "youtubeUrl" TEXT,
    "meetingNote" TEXT NOT NULL,
    "meetingVenue" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MemberOtp_phone_idx" ON "MemberOtp"("phone");
