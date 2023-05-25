-- DropForeignKey
ALTER TABLE `Customer` DROP FOREIGN KEY `Customer_businessId_fkey`;

-- AlterTable
ALTER TABLE `Customer` MODIFY `businessId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `Business`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
