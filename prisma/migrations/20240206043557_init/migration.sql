/*
  Warnings:

  - You are about to drop the `question_answer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `question_answer`;

-- CreateTable
CREATE TABLE `QuestionAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
