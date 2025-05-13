-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "ServiceBooking" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "cleanerId" TEXT NOT NULL,
    "homeownerId" TEXT NOT NULL,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "serviceType" TEXT NOT NULL,
    "ratePerHr" DOUBLE PRECISION NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceBooking_bookingId_key" ON "ServiceBooking"("bookingId");

-- CreateIndex
CREATE INDEX "ServiceBooking_homeownerId_idx" ON "ServiceBooking"("homeownerId");

-- CreateIndex
CREATE INDEX "ServiceBooking_cleanerId_idx" ON "ServiceBooking"("cleanerId");

-- CreateIndex
CREATE INDEX "ServiceBooking_serviceDate_idx" ON "ServiceBooking"("serviceDate");

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_cleanerId_fkey" FOREIGN KEY ("cleanerId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
