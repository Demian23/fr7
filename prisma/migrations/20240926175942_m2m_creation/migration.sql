/*
  Warnings:

  - You are about to drop the `_CountryToMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GenreToMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_CountryToMovie` DROP FOREIGN KEY `_CountryToMovie_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CountryToMovie` DROP FOREIGN KEY `_CountryToMovie_B_fkey`;

-- DropForeignKey
ALTER TABLE `_GenreToMovie` DROP FOREIGN KEY `_GenreToMovie_A_fkey`;

-- DropForeignKey
ALTER TABLE `_GenreToMovie` DROP FOREIGN KEY `_GenreToMovie_B_fkey`;

-- DropTable
DROP TABLE `_CountryToMovie`;

-- DropTable
DROP TABLE `_GenreToMovie`;

-- CreateTable
CREATE TABLE `m2m_movie_genre` (
    `movie_id` INTEGER NOT NULL,
    `genre_id` INTEGER NOT NULL,

    PRIMARY KEY (`movie_id`, `genre_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m2m_movie_country` (
    `movie_id` INTEGER NOT NULL,
    `country_id` INTEGER NOT NULL,

    PRIMARY KEY (`movie_id`, `country_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `m2m_movie_genre` ADD CONSTRAINT `m2m_movie_genre_movie_id_fkey` FOREIGN KEY (`movie_id`) REFERENCES `movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m2m_movie_genre` ADD CONSTRAINT `m2m_movie_genre_genre_id_fkey` FOREIGN KEY (`genre_id`) REFERENCES `genre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m2m_movie_country` ADD CONSTRAINT `m2m_movie_country_movie_id_fkey` FOREIGN KEY (`movie_id`) REFERENCES `movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m2m_movie_country` ADD CONSTRAINT `m2m_movie_country_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
