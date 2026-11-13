/*
  Warnings:

  - The primary key for the `role_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `role_permissions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `role_permissions` DROP FOREIGN KEY `role_permissions_role_id_fkey`;

-- DropIndex
DROP INDEX `role_permissions_role_id_permission_id_key` ON `role_permissions`;

-- AlterTable
ALTER TABLE `role_permissions` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`role_id`, `permission_id`);

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
