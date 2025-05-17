/*
  Warnings:

  - Added the required column `name` to the `ServiceListing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceListing" ADD COLUMN     "name" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE INDEX "ServiceListing_name_idx" ON "ServiceListing"("name");
