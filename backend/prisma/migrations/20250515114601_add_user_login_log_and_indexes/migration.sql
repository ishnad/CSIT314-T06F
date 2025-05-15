-- CreateTable
CREATE TABLE "UserLoginLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "UserLoginLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserLoginLog_userId_idx" ON "UserLoginLog"("userId");

-- CreateIndex
CREATE INDEX "UserLoginLog_loginTime_idx" ON "UserLoginLog"("loginTime");

-- CreateIndex
CREATE INDEX "ServiceBooking_status_createdAt_idx" ON "ServiceBooking"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "UserLoginLog" ADD CONSTRAINT "UserLoginLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
