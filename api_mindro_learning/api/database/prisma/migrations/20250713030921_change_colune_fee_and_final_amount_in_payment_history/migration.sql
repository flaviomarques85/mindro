/*
  Warnings:

  - You are about to drop the column `amount` on the `PaymentHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentHistory" DROP COLUMN "amount",
ADD COLUMN     "fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "finalAmount" DECIMAL(10,2) NOT NULL DEFAULT 0;
