/*
  Warnings:

  - You are about to drop the `ServiceBooking` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ServiceBooking" DROP CONSTRAINT "ServiceBooking_cleanerId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceBooking" DROP CONSTRAINT "ServiceBooking_homeownerId_fkey";

-- DropTable
DROP TABLE "ServiceBooking";

-- DropEnum
DROP TYPE "BookingStatus";
