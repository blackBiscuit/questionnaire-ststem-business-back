/*
  Warnings:

  - Added the required column `answer` to the `question_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_id` to the `question_answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `question_answer` ADD COLUMN `answer` VARCHAR(191) NOT NULL,
    ADD COLUMN `question_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `question_answer` ADD CONSTRAINT `question_answer_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
