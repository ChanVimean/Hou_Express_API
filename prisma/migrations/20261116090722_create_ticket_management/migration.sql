-- CreateTable
CREATE TABLE `ticket_attachments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_id` INTEGER NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `mime_type` VARCHAR(100) NULL,
    `file_size` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ticket_attachments_ticket_id_idx`(`ticket_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ticket_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_id` INTEGER NOT NULL,
    `status` ENUM('UNPAID', 'PAID') NOT NULL DEFAULT 'UNPAID',
    `paid_by` CHAR(36) NULL,
    `paid_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ticket_payments_ticket_id_key`(`ticket_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_status_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_id` INTEGER NOT NULL,
    `action` ENUM('SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED') NOT NULL,
    `action_by` CHAR(36) NOT NULL,
    `comment` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ticket_status_history_ticket_id_idx`(`ticket_id`),
    INDEX `ticket_status_history_action_idx`(`action`),
    INDEX `ticket_status_history_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tickets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_number` VARCHAR(50) NOT NULL,
    `category_id` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `estimate_amount` DECIMAL(12, 2) NOT NULL,
    `priority` ENUM('NORMAL', 'URGENT') NOT NULL DEFAULT 'NORMAL',
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `deadline` DATETIME(0) NOT NULL,
    `requested_by` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tickets_ticket_number_key`(`ticket_number`),
    INDEX `tickets_status_idx`(`status`),
    INDEX `tickets_priority_idx`(`priority`),
    INDEX `tickets_created_at_idx`(`created_at`),
    INDEX `tickets_deadline_idx`(`deadline`),
    INDEX `tickets_requested_by_idx`(`requested_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ticket_attachments` ADD CONSTRAINT `ticket_attachments_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_payments` ADD CONSTRAINT `ticket_payments_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_status_history` ADD CONSTRAINT `ticket_status_history_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `ticket_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
