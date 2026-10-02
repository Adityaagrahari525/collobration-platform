-- CreateEnum
CREATE TYPE "CollaborationMode" AS ENUM ('REMOTE', 'HYBRID', 'ON_CAMPUS');

-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "city" TEXT,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preferredCollaborationMode" "CollaborationMode" DEFAULT 'HYBRID',
ADD COLUMN     "state" TEXT;

-- CreateIndex
CREATE INDEX "skills_name_idx" ON "skills"("name");

-- CreateIndex
CREATE INDEX "skills_category_idx" ON "skills"("category");

-- CreateIndex
CREATE INDEX "user_profiles_department_idx" ON "user_profiles"("department");

-- CreateIndex
CREATE INDEX "user_profiles_academicYear_idx" ON "user_profiles"("academicYear");

-- CreateIndex
CREATE INDEX "user_skills_userId_idx" ON "user_skills"("userId");

-- CreateIndex
CREATE INDEX "user_skills_skillId_idx" ON "user_skills"("skillId");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_lastName_firstName_idx" ON "users"("lastName", "firstName");
