/*
  Warnings:

  - The primary key for the `role_permissions` table will be changed.
  - You are about to drop the column `id` on the `role_permissions` table.
*/

-- DropForeignKey
ALTER TABLE `role_permissions`
DROP FOREIGN KEY `role_permissions_role_id_fkey`;

-- DropIndex
DROP INDEX `role_permissions_role_id_permission_id_key`
ON `role_permissions`;

-- AlterTable
ALTER TABLE `role_permissions`
DROP PRIMARY KEY,
DROP COLUMN `id`,
ADD PRIMARY KEY (`role_id`, `permission_id`);