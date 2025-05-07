-- CreateTable
CREATE TABLE "Shortlist" (
    "id" TEXT NOT NULL,
    "homeownerId" TEXT NOT NULL,
    "cleanerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shortlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Shortlist_homeownerId_idx" ON "Shortlist"("homeownerId");

-- CreateIndex
CREATE INDEX "Shortlist_cleanerId_idx" ON "Shortlist"("cleanerId");

-- CreateIndex
CREATE UNIQUE INDEX "Shortlist_homeownerId_cleanerId_key" ON "Shortlist"("homeownerId", "cleanerId");

-- AddForeignKey
ALTER TABLE "Shortlist" ADD CONSTRAINT "Shortlist_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shortlist" ADD CONSTRAINT "Shortlist_cleanerId_fkey" FOREIGN KEY ("cleanerId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
