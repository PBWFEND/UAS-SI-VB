/*
  Warnings:

  - Made the column `courseId` on table `absencesession` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `absencesession` DROP FOREIGN KEY `AbsenceSession_courseId_fkey`;

-- AlterTable
ALTER TABLE `absencesession` MODIFY `courseId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN', 'DOSEN', 'USER') NOT NULL;

-- AddForeignKey
ALTER TABLE `AbsenceSession` ADD CONSTRAINT `AbsenceSession_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
