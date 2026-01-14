/*
  Warnings:

  - You are about to drop the column `arrival` on the `flightschedule` table. All the data in the column will be lost.
  - You are about to drop the column `departure` on the `flightschedule` table. All the data in the column will be lost.
  - You are about to drop the column `flightCode` on the `flightschedule` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `flightschedule` table. All the data in the column will be lost.
  - Added the required column `arrivalTime` to the `FlightSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureTime` to the `FlightSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flightNumber` to the `FlightSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FlightSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `flightschedule` DROP COLUMN `arrival`,
    DROP COLUMN `departure`,
    DROP COLUMN `flightCode`,
    DROP COLUMN `status`,
    ADD COLUMN `arrivalTime` DATETIME(3) NOT NULL,
    ADD COLUMN `departureTime` DATETIME(3) NOT NULL,
    ADD COLUMN `flightNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
