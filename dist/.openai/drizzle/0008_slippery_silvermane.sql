DROP TABLE `_merchandise_v_version_options`;--> statement-breakpoint
DROP TABLE `merchandise_options`;--> statement-breakpoint
ALTER TABLE `_merchandise_v` ADD `version_type` text;--> statement-breakpoint
ALTER TABLE `_merchandise_v` ADD `version_price` numeric;--> statement-breakpoint
ALTER TABLE `_merchandise_v` ADD `version_sizes` text;--> statement-breakpoint
ALTER TABLE `_merchandise_v` ADD `version_available` integer DEFAULT true;--> statement-breakpoint
CREATE INDEX `_merchandise_v_version_version_type_idx` ON `_merchandise_v` (`version_type`);--> statement-breakpoint
ALTER TABLE `merchandise` ADD `type` text;--> statement-breakpoint
ALTER TABLE `merchandise` ADD `price` numeric;--> statement-breakpoint
ALTER TABLE `merchandise` ADD `sizes` text;--> statement-breakpoint
ALTER TABLE `merchandise` ADD `available` integer DEFAULT true;--> statement-breakpoint
CREATE INDEX `merchandise_type_idx` ON `merchandise` (`type`);