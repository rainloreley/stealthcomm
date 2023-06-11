-- CreateTable
CREATE TABLE `Object` (
    `uid` VARCHAR(191) NOT NULL,
    `type` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `uid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Object` ADD CONSTRAINT `Object_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;
