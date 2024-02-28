/*
  Warnings:

  - You are about to drop the column `answerCount` on the `question` table. All the data in the column will be lost.
  - Added the required column `answer_count` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `question` DROP COLUMN `answerCount`,
    ADD COLUMN `answer_count` INTEGER NOT NULL;
