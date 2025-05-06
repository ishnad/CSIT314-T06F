-- CreateEnum
CREATE TYPE "UserProfileStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "status" "UserProfileStatus" NOT NULL DEFAULT 'ACTIVE';
