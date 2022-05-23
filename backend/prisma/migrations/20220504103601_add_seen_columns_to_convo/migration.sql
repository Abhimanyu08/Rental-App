/*
  Warnings:

  - You are about to drop the column `has_unseen_messages` on the `Convo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Convo" DROP COLUMN "has_unseen_messages",
ADD COLUMN     "all_seen_by_first" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "all_seen_by_second" BOOLEAN NOT NULL DEFAULT false;
