/*
  Warnings:

  - You are about to drop the column `unseen_messages` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "unseen_messages";
