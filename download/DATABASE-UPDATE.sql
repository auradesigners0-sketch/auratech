-- ============================================================
-- AURATECH DATABASE UPDATE — Run this in Neon SQL Editor
-- ============================================================
-- This adds the new fields for 2FA, rate limiting, and project
-- inquiry workflow.
--
-- HOW TO RUN:
-- 1. Go to https://console.neon.tech
-- 2. Click your project
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Copy this ENTIRE file and paste it into the editor
-- 5. Click "Run"
-- ============================================================

-- 1. Add 2FA fields to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totpSecret" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totpEnabled" BOOLEAN NOT NULL DEFAULT false;

-- 2. Add project workflow fields to ContactSubmission table
ALTER TABLE "ContactSubmission" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'new';
ALTER TABLE "ContactSubmission" ADD COLUMN IF NOT EXISTS "quoteAmount" TEXT;
ALTER TABLE "ContactSubmission" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "ContactSubmission" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create index on ContactSubmission status
CREATE INDEX IF NOT EXISTS "ContactSubmission_status_createdAt_idx" ON "ContactSubmission"("status", "createdAt");

-- 3. Create LoginAttempt table (for rate limiting)
CREATE TABLE IF NOT EXISTS "LoginAttempt" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "email" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "LoginAttempt_ip_createdAt_idx" ON "LoginAttempt"("ip", "createdAt");
CREATE INDEX IF NOT EXISTS "LoginAttempt_email_createdAt_idx" ON "LoginAttempt"("email", "createdAt");

-- Done! You can now use 2FA, rate limiting, and the project workflow.
