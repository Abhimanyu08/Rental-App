/*
  Warnings:

  - You are about to drop the column `firstParticipant` on the `Convo` table. All the data in the column will be lost.
  - You are about to drop the column `secondParticiapant` on the `Convo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[firstParticipantId,secondParticiapantId]` on the table `Convo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstParticipantId` to the `Convo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondParticiapantId` to the `Convo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Convo_firstParticipant_secondParticiapant_key";

-- AlterTable
ALTER TABLE "Convo" DROP COLUMN "firstParticipant",
DROP COLUMN "secondParticiapant",
ADD COLUMN     "firstParticipantId" INTEGER NOT NULL,
ADD COLUMN     "secondParticiapantId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Convo_firstParticipantId_secondParticiapantId_key" ON "Convo"("firstParticipantId", "secondParticiapantId");

-- AddForeignKey
ALTER TABLE "Convo" ADD CONSTRAINT "Convo_firstParticipantId_fkey" FOREIGN KEY ("firstParticipantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Convo" ADD CONSTRAINT "Convo_secondParticiapantId_fkey" FOREIGN KEY ("secondParticiapantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
