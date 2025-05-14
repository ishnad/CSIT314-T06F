/*
  Warnings:

  - You are about to drop the column `serviceType` on the `ServiceListing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ServiceListing" DROP COLUMN "serviceType",
ADD COLUMN     "serviceCatName" TEXT;
