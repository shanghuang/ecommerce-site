/*
  Warnings:

  - Added the required column `unregistered` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unregisteredAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `unregistered` BOOLEAN NOT NULL,
    ADD COLUMN `unregisteredAt` DATETIME(3) NOT NULL;
