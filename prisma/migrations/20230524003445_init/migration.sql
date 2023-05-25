/*
  Warnings:

  - You are about to drop the column `Source` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Customer` DROP COLUMN `Source`,
    ADD COLUMN `source` VARCHAR(191) NULL;
