/*
  Warnings:

  - Added the required column `component_list` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `question` ADD COLUMN `component_list` VARCHAR(191) NOT NULL;
