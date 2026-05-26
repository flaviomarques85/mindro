-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('REQUIRED', 'ACTIVE', 'PROGRESS', 'FINISHED');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "status" "CourseStatus" NOT NULL DEFAULT 'REQUIRED';

-- AlterTable
ALTER TABLE "Lesson" ALTER COLUMN "time" SET DATA TYPE TIME(0);
