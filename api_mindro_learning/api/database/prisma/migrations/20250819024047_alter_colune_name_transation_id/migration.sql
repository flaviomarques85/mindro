/*
  Warnings:

  - You are about to drop the column `trasactionId` on the `PaymentHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentHistory" DROP COLUMN "trasactionId",
ADD COLUMN     "transactionId" TEXT;
