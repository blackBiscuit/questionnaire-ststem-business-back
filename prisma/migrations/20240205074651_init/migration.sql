/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `question` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `question` table. All the data in the column will be lost.
  - You are about to drop the column `isStar` on the `question` table. All the data in the column will be lost.
  - Added the required column `is_deleted` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_published` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_star` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `question` DROP COLUMN `isDeleted`,
    DROP COLUMN `isPublished`,
    DROP COLUMN `isStar`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL,
    ADD COLUMN `is_published` BOOLEAN NOT NULL,
    ADD COLUMN `is_star` BOOLEAN NOT NULL;
