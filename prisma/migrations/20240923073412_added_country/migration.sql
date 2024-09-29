-- CreateTable
CREATE TABLE `country` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `country_value_key`(`value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CountryToMovie` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CountryToMovie_AB_unique`(`A`, `B`),
    INDEX `_CountryToMovie_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CountryToMovie` ADD CONSTRAINT `_CountryToMovie_A_fkey` FOREIGN KEY (`A`) REFERENCES `country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CountryToMovie` ADD CONSTRAINT `_CountryToMovie_B_fkey` FOREIGN KEY (`B`) REFERENCES `movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
