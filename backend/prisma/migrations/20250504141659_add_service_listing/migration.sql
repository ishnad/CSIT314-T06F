-- CreateTable
CREATE TABLE "ServiceListing" (
    "id" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ratePerHr" DOUBLE PRECISION NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "availability" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cleanerId" TEXT NOT NULL,

    CONSTRAINT "ServiceListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceListing_cleanerId_idx" ON "ServiceListing"("cleanerId");

-- AddForeignKey
ALTER TABLE "ServiceListing" ADD CONSTRAINT "ServiceListing_cleanerId_fkey" FOREIGN KEY ("cleanerId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
