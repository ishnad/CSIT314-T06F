/*
  Warnings:

  - You are about to drop the column `availability` on the `ServiceListing` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `ServiceListing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ServiceListing" DROP COLUMN "availability",
DROP COLUMN "duration";
