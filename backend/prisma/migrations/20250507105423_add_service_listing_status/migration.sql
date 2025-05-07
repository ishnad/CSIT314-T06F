-- CreateEnum
CREATE TYPE "ServiceListingStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "ServiceListing" ADD COLUMN     "status" "ServiceListingStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "ServiceListing_cleanerId_status_idx" ON "ServiceListing"("cleanerId", "status");
