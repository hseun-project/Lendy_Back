/*
  Warnings:

  - A unique constraint covering the columns `[userCode]` on the table `UserDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserDetail_userCode_key" ON "UserDetail"("userCode");
