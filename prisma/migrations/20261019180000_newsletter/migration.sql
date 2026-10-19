-- CreateEnum
CREATE TYPE "SubscriberStatus" AS ENUM ('pending', 'active', 'unsubscribed');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "announcedAt" TIMESTAMP(3),
ADD COLUMN     "announcedTo" INTEGER;

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "announcedAt" TIMESTAMP(3),
ADD COLUMN     "announcedTo" INTEGER;

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "status" "SubscriberStatus" NOT NULL DEFAULT 'pending',
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_token_key" ON "Subscriber"("token");

-- CreateIndex
CREATE INDEX "Subscriber_status_idx" ON "Subscriber"("status");
