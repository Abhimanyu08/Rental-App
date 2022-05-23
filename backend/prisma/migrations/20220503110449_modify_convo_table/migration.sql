-- AlterTable
ALTER TABLE "Convo" ALTER COLUMN "has_unseen_messages" SET DEFAULT false,
ALTER COLUMN "latest_message_time" SET DEFAULT CURRENT_TIMESTAMP;
