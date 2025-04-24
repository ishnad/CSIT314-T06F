-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED');

-- AlterTable
ALTER TABLE "UserAccount" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
