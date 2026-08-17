CREATE TABLE `_pages_v_blocks_image` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`image_id` integer,
	`caption` text,
	`aspect_ratio` text DEFAULT 'natural',
	`width` text DEFAULT 'wide',
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_image_order_idx` ON `_pages_v_blocks_image` (`_order`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_image_parent_id_idx` ON `_pages_v_blocks_image` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_image_path_idx` ON `_pages_v_blocks_image` (`_path`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_image_image_idx` ON `_pages_v_blocks_image` (`image_id`);--> statement-breakpoint
CREATE TABLE `pages_blocks_image` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`image_id` integer,
	`caption` text,
	`aspect_ratio` text DEFAULT 'natural',
	`width` text DEFAULT 'wide',
	`block_name` text,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_image_order_idx` ON `pages_blocks_image` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_image_parent_id_idx` ON `pages_blocks_image` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_image_path_idx` ON `pages_blocks_image` (`_path`);--> statement-breakpoint
CREATE INDEX `pages_blocks_image_image_idx` ON `pages_blocks_image` (`image_id`);--> statement-breakpoint
ALTER TABLE `_pages_v_blocks_about` ADD `image_id` integer REFERENCES media(id);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_about_image_idx` ON `_pages_v_blocks_about` (`image_id`);--> statement-breakpoint
ALTER TABLE `_pages_v_blocks_call_to_action` ADD `image_id` integer REFERENCES media(id);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_call_to_action_image_idx` ON `_pages_v_blocks_call_to_action` (`image_id`);--> statement-breakpoint
ALTER TABLE `_pages_v_blocks_events` ADD `upcoming_image_id` integer REFERENCES media(id);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_events_upcoming_image_idx` ON `_pages_v_blocks_events` (`upcoming_image_id`);--> statement-breakpoint
ALTER TABLE `_pages_v_blocks_events_past_events` ADD `image_id` integer REFERENCES media(id);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_events_past_events_image_idx` ON `_pages_v_blocks_events_past_events` (`image_id`);--> statement-breakpoint
ALTER TABLE `_pages_v_blocks_hero_countdown` ADD `image_id` integer REFERENCES media(id);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_hero_countdown_image_idx` ON `_pages_v_blocks_hero_countdown` (`image_id`);--> statement-breakpoint
ALTER TABLE `pages_blocks_about` ADD `image_id` integer REFERENCES media(id);--> statement-breakpoint
CREATE INDEX `pages_blocks_about_image_idx` ON `pages_blocks_about` (`image_id`);--> statement-breakpoint
ALTER TABLE `pages_blocks_call_to_action` ADD `image_id` integer REFERENCES media(id);--> statement-breakpoint
CREATE INDEX `pages_blocks_call_to_action_image_idx` ON `pages_blocks_call_to_action` (`image_id`);--> statement-breakpoint
ALTER TABLE `pages_blocks_events` ADD `upcoming_image_id` integer REFERENCES media(id);--> statement-breakpoint
CREATE INDEX `pages_blocks_events_upcoming_image_idx` ON `pages_blocks_events` (`upcoming_image_id`);--> statement-breakpoint
ALTER TABLE `pages_blocks_events_past_events` ADD `image_id` integer REFERENCES media(id);--> statement-breakpoint
CREATE INDEX `pages_blocks_events_past_events_image_idx` ON `pages_blocks_events_past_events` (`image_id`);--> statement-breakpoint
ALTER TABLE `pages_blocks_hero_countdown` ADD `image_id` integer REFERENCES media(id);--> statement-breakpoint
CREATE INDEX `pages_blocks_hero_countdown_image_idx` ON `pages_blocks_hero_countdown` (`image_id`);