/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Exam` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_subjectId_fkey";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "subjectId",
ADD COLUMN     "lessonId" INTEGER NOT NULL DEFAULT 2;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
