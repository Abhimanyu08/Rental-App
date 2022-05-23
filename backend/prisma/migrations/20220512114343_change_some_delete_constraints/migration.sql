-- DropForeignKey
ALTER TABLE "Convo" DROP CONSTRAINT "Convo_firstParticipantId_fkey";

-- DropForeignKey
ALTER TABLE "Convo" DROP CONSTRAINT "Convo_secondParticiapantId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_toId_fkey";

-- AlterTable
ALTER TABLE "Convo" ALTER COLUMN "firstParticipantId" SET DEFAULT 0,
ALTER COLUMN "secondParticiapantId" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "fromId" SET DEFAULT 0,
ALTER COLUMN "toId" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Convo" ADD CONSTRAINT "Convo_firstParticipantId_fkey" FOREIGN KEY ("firstParticipantId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Convo" ADD CONSTRAINT "Convo_secondParticiapantId_fkey" FOREIGN KEY ("secondParticiapantId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
