-- CreateTable
CREATE TABLE `NotificationProvider` (
    `uid` VARCHAR(191) NOT NULL,
    `type` ENUM('email', 'discord') NOT NULL,
    `config` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NotificationProvider` ADD CONSTRAINT `NotificationProvider_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;
