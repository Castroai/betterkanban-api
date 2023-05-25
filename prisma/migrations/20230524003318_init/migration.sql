/*
  Warnings:

  - You are about to drop the column `AccountStatus` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Customer` DROP COLUMN `AccountStatus`,
    ADD COLUMN `accountStatus` VARCHAR(191) NULL;
