/*
  Warnings:

  - A unique constraint covering the columns `[userAId,userBId]` on the table `Thread` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Thread_userAId_userBId_key" ON "public"."Thread"("userAId", "userBId");
