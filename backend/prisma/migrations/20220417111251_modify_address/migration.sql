/*
  Warnings:

  - You are about to drop the column `address` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "address",
ADD COLUMN     "district" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "state" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "street" TEXT NOT NULL DEFAULT E'';
