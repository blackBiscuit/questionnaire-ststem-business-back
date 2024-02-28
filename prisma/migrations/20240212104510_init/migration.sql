/*
  Warnings:

  - You are about to alter the column `component_list` on the `question` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `question` MODIFY `component_list` JSON NOT NULL DEFAULT [];
