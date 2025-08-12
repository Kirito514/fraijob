/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `github` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lang` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile_completed` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `telegram` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "bio",
DROP COLUMN "education",
DROP COLUMN "github",
DROP COLUMN "lang",
DROP COLUMN "location",
DROP COLUMN "phone",
DROP COLUMN "profile_completed",
DROP COLUMN "skills",
DROP COLUMN "telegram",
ADD COLUMN     "softSkills" TEXT,
ADD COLUMN     "technicalSkills" TEXT,
ADD COLUMN     "workType" TEXT;
