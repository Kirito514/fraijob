-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "location" TEXT,
    "github_url" TEXT,
    "linkedin_url" TEXT,
    "twitter_url" TEXT,
    "telegram" TEXT,
    "technical_skills" TEXT,
    "soft_skills" TEXT,
    "experience_company" TEXT,
    "experience_position" TEXT,
    "experience_duration" TEXT,
    "experience_location" TEXT,
    "experience_description" TEXT,
    "education_institution" TEXT,
    "education_degree" TEXT,
    "education_duration" TEXT,
    "education_gpa" TEXT,
    "project_name" TEXT,
    "project_technologies" TEXT,
    "project_url" TEXT,
    "project_description" TEXT,
    "language_1" TEXT,
    "language_2" TEXT,
    "language_3" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_userId_key" ON "Portfolio"("userId");

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
