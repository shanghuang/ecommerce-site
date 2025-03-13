/*
  Warnings:

  - You are about to drop the column `address` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `order` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `shippingAddressId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `address`,
    DROP COLUMN `city`,
    DROP COLUMN `country`,
    DROP COLUMN `email`,
    DROP COLUMN `fullName`,
    DROP COLUMN `paymentId`,
    DROP COLUMN `state`,
    DROP COLUMN `totalAmount`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `zip`,
    ADD COLUMN `shippingAddressId` VARCHAR(191) NOT NULL,
    ADD COLUMN `total` DOUBLE NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingAddress` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `zip` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `imageUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_shippingAddressId_fkey` FOREIGN KEY (`shippingAddressId`) REFERENCES `ShippingAddress`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
