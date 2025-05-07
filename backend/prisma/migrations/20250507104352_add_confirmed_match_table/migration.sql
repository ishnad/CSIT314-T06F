-- CreateTable
CREATE TABLE "ConfirmedMatch" (
    "id" TEXT NOT NULL,
    "serviceListingId" TEXT NOT NULL,
    "homeownerId" TEXT NOT NULL,
    "confirmationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfirmedMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConfirmedMatch_serviceListingId_idx" ON "ConfirmedMatch"("serviceListingId");

-- CreateIndex
CREATE INDEX "ConfirmedMatch_homeownerId_idx" ON "ConfirmedMatch"("homeownerId");

-- CreateIndex
CREATE INDEX "ConfirmedMatch_confirmationDate_idx" ON "ConfirmedMatch"("confirmationDate");

-- CreateIndex
CREATE INDEX "ConfirmedMatch_serviceListingId_confirmationDate_idx" ON "ConfirmedMatch"("serviceListingId", "confirmationDate");

-- AddForeignKey
ALTER TABLE "ConfirmedMatch" ADD CONSTRAINT "ConfirmedMatch_serviceListingId_fkey" FOREIGN KEY ("serviceListingId") REFERENCES "ServiceListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmedMatch" ADD CONSTRAINT "ConfirmedMatch_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
