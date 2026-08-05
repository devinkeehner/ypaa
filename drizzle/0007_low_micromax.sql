CREATE TABLE `_merchandise_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`version_name` text,
	`version_slug` text,
	`version_image_id` integer,
	`version_description` text,
	`version_search_terms` text,
	`version_featured` integer DEFAULT false,
	`version_updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`version_created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`version__status` text DEFAULT 'draft',
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`latest` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `merchandise`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`version_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `_merchandise_v_parent_idx` ON `_merchandise_v` (`parent_id`);--> statement-breakpoint
CREATE INDEX `_merchandise_v_version_version_name_idx` ON `_merchandise_v` (`version_name`);--> statement-breakpoint
CREATE INDEX `_merchandise_v_version_version_slug_idx` ON `_merchandise_v` (`version_slug`);--> statement-breakpoint
CREATE INDEX `_merchandise_v_version_version_image_idx` ON `_merchandise_v` (`version_image_id`);--> statement-breakpoint
CREATE INDEX `_merchandise_v_version_version_updated_at_idx` ON `_merchandise_v` (`version_updated_at`);--> statement-breakpoint
CREATE INDEX `_merchandise_v_version_version_created_at_idx` ON `_merchandise_v` (`version_created_at`);--> statement-breakpoint
CREATE INDEX `_merchandise_v_version_version__status_idx` ON `_merchandise_v` (`version__status`);--> statement-breakpoint
CREATE INDEX `_merchandise_v_created_at_idx` ON `_merchandise_v` (`created_at`);--> statement-breakpoint
CREATE INDEX `_merchandise_v_updated_at_idx` ON `_merchandise_v` (`updated_at`);--> statement-breakpoint
CREATE INDEX `_merchandise_v_latest_idx` ON `_merchandise_v` (`latest`);--> statement-breakpoint
CREATE TABLE `_merchandise_v_version_options` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`type` text,
	`label` text,
	`price` numeric,
	`sizes` text,
	`available` integer DEFAULT true,
	`_uuid` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_merchandise_v`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_merchandise_v_version_options_order_idx` ON `_merchandise_v_version_options` (`_order`);--> statement-breakpoint
CREATE INDEX `_merchandise_v_version_options_parent_id_idx` ON `_merchandise_v_version_options` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `merchandise` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`slug` text,
	`image_id` integer,
	`description` text,
	`search_terms` text,
	`featured` integer DEFAULT false,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`_status` text DEFAULT 'draft',
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `merchandise_name_idx` ON `merchandise` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `merchandise_slug_idx` ON `merchandise` (`slug`);--> statement-breakpoint
CREATE INDEX `merchandise_image_idx` ON `merchandise` (`image_id`);--> statement-breakpoint
CREATE INDEX `merchandise_updated_at_idx` ON `merchandise` (`updated_at`);--> statement-breakpoint
CREATE INDEX `merchandise_created_at_idx` ON `merchandise` (`created_at`);--> statement-breakpoint
CREATE INDEX `merchandise__status_idx` ON `merchandise` (`_status`);--> statement-breakpoint
CREATE TABLE `merchandise_options` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`type` text,
	`label` text,
	`price` numeric,
	`sizes` text,
	`available` integer DEFAULT true,
	FOREIGN KEY (`_parent_id`) REFERENCES `merchandise`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `merchandise_options_order_idx` ON `merchandise_options` (`_order`);--> statement-breakpoint
CREATE INDEX `merchandise_options_parent_id_idx` ON `merchandise_options` (`_parent_id`);--> statement-breakpoint
ALTER TABLE `payload_locked_documents_rels` ADD `merchandise_id` integer REFERENCES merchandise(id);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_merchandise_id_idx` ON `payload_locked_documents_rels` (`merchandise_id`);