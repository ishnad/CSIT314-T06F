-- CreateEnum
CREATE TYPE "ServiceCategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "ServiceCategory" ADD COLUMN     "status" "ServiceCategoryStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "ServiceCategory_status_idx" ON "ServiceCategory"("status");

-- CreateIndex
CREATE INDEX "ServiceCategory_serviceCatName_idx" ON "ServiceCategory"("serviceCatName");
