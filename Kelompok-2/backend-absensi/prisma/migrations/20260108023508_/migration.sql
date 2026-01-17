/*
  Warnings:

  - A unique constraint covering the columns `[npm]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseId` to the `AbsenceSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `absencesession` ADD COLUMN `courseId` INT;


-- AlterTable
ALTER TABLE `user` ADD COLUMN `npm` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `dosenId` INTEGER NOT NULL,

    UNIQUE INDEX `Course_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_npm_key` ON `User`(`npm`);

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AbsenceSession` ADD CONSTRAINT `AbsenceSession_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
