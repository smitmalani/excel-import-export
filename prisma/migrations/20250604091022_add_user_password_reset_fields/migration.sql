/*
  Warnings:

  - A unique constraint covering the columns `[PasswordResetToken]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Users` ADD COLUMN `PasswordResetToken` VARCHAR(255) NULL,
    ADD COLUMN `PasswordResetTokenExpiresAt` TIMESTAMP(0) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Users_PasswordResetToken_key` ON `Users`(`PasswordResetToken`);
