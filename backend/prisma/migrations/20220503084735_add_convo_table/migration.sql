-- CreateTable
CREATE TABLE "Convo" (
    "id" SERIAL NOT NULL,
    "firstParticipant" INTEGER NOT NULL,
    "secondParticiapant" INTEGER NOT NULL,
    "has_unseen_messages" BOOLEAN NOT NULL,
    "latest_message_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Convo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Convo_firstParticipant_secondParticiapant_key" ON "Convo"("firstParticipant", "secondParticiapant");
