-- Migration: Add PersonalBotMemory, PersonalBotMessage models
-- And new fields to User table

-- Add new columns to User table (if they don't exist)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "plainPassword" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "area" TEXT;

-- Create PersonalBotMemory table
CREATE TABLE IF NOT EXISTS "PersonalBotMemory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "botName" TEXT,
    "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonalBotMemory_pkey" PRIMARY KEY ("id")
);

-- Create PersonalBotMessage table
CREATE TABLE IF NOT EXISTS "PersonalBotMessage" (
    "id" TEXT NOT NULL,
    "memoryId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonalBotMessage_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint on userId
CREATE UNIQUE INDEX IF NOT EXISTS "PersonalBotMemory_userId_key" ON "PersonalBotMemory"("userId");

-- Add index on memoryId
CREATE INDEX IF NOT EXISTS "PersonalBotMessage_memoryId_idx" ON "PersonalBotMessage"("memoryId");

-- Add foreign key constraints
ALTER TABLE "PersonalBotMemory" DROP CONSTRAINT IF EXISTS "PersonalBotMemory_userId_fkey";
ALTER TABLE "PersonalBotMemory" ADD CONSTRAINT "PersonalBotMemory_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PersonalBotMessage" DROP CONSTRAINT IF EXISTS "PersonalBotMessage_memoryId_fkey";
ALTER TABLE "PersonalBotMessage" ADD CONSTRAINT "PersonalBotMessage_memoryId_fkey" 
    FOREIGN KEY ("memoryId") REFERENCES "PersonalBotMemory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
