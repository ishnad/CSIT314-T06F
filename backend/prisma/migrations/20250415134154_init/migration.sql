-- CreateEnum
CREATE TYPE "UserProfile" AS ENUM ('HOMEOWNER', 'CLEANER', 'ADMIN', 'PLATFORM');

-- CreateTable
CREATE TABLE "UserAccount" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userProfile" "UserProfile" NOT NULL DEFAULT 'HOMEOWNER'
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_username_key" ON "UserAccount"("username");
