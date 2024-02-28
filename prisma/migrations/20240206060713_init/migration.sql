-- DropForeignKey
ALTER TABLE `question` DROP FOREIGN KEY `Question_author_id_fkey`;

-- AlterTable
ALTER TABLE `question` MODIFY `desc` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `css` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `js` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `author_id` INTEGER NULL,
    MODIFY `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `is_published` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `is_star` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `component_list` VARCHAR(191) NOT NULL DEFAULT '[]';

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
