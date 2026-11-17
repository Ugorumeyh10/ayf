-- CreateEnum
CREATE TYPE "MeetingMinutesStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "agenda" TEXT,
ADD COLUMN     "minutesBody" TEXT,
ADD COLUMN     "decisions" TEXT,
ADD COLUMN     "attendeesNote" TEXT,
ADD COLUMN     "status" "MeetingMinutesStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "createdByAdminId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Meeting_status_date_idx" ON "Meeting"("status", "date");
