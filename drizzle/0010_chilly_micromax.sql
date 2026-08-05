CREATE TABLE `_merchandise_v_version_inventory` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`size` text,
	`color` text,
	`sku` text,
	`quantity` numeric DEFAULT 0,
	`_uuid` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_merchandise_v`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_merchandise_v_version_inventory_order_idx` ON `_merchandise_v_version_inventory` (`_order`);--> statement-breakpoint
CREATE INDEX `_merchandise_v_version_inventory_parent_id_idx` ON `_merchandise_v_version_inventory` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `merchandise_inventory` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`size` text,
	`color` text,
	`sku` text,
	`quantity` numeric DEFAULT 0,
	FOREIGN KEY (`_parent_id`) REFERENCES `merchandise`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `merchandise_inventory_order_idx` ON `merchandise_inventory` (`_order`);--> statement-breakpoint
CREATE INDEX `merchandise_inventory_parent_id_idx` ON `merchandise_inventory` (`_parent_id`);--> statement-breakpoint
ALTER TABLE `_merchandise_v` DROP COLUMN `version_sizes`;--> statement-breakpoint
ALTER TABLE `_merchandise_v` DROP COLUMN `version_colors`;--> statement-breakpoint
ALTER TABLE `merchandise` DROP COLUMN `sizes`;--> statement-breakpoint
ALTER TABLE `merchandise` DROP COLUMN `colors`;