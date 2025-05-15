/*
  Warnings:

  - You are about to drop the column `serviceCatName` on the `ServiceListing` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Permission" ADD VALUE 'MANAGE_CATEGORIES';

-- AlterTable
ALTER TABLE "ServiceListing" DROP COLUMN "serviceCatName",
ADD COLUMN     "serviceCategoryId" TEXT;

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "serviceCatName" TEXT NOT NULL,
    "serviceCatDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_serviceCatName_key" ON "ServiceCategory"("serviceCatName");

-- CreateIndex
CREATE INDEX "ServiceListing_serviceCategoryId_idx" ON "ServiceListing"("serviceCategoryId");

-- AddForeignKey
ALTER TABLE "ServiceListing" ADD CONSTRAINT "ServiceListing_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "ServiceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
