/*
  Warnings:

  - You are about to drop the column `isi` on the `diary` table. All the data in the column will be lost.
  - You are about to drop the column `judul` on the `diary` table. All the data in the column will be lost.
  - You are about to drop the column `mataKuliah` on the `diary` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal` on the `diary` table. All the data in the column will be lost.
  - Added the required column `content` to the `Diary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Diary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `diary` DROP COLUMN `isi`,
    DROP COLUMN `judul`,
    DROP COLUMN `mataKuliah`,
    DROP COLUMN `tanggal`,
    ADD COLUMN `content` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;
