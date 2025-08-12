-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "lang" TEXT DEFAULT 'en',
ADD COLUMN     "telegram" TEXT;
