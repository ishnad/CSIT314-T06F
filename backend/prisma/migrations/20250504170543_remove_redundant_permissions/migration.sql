-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('MANAGE_SERVICES', 'ADMIN_PRIVILEGES', 'SEARCH_CLEANERS', 'VIEW_REPORTS');

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "permissions" "Permission"[];
