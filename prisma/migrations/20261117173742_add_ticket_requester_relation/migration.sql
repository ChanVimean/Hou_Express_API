-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_requested_by_fkey` FOREIGN KEY (`requested_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
