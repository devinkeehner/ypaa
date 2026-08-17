CREATE TABLE `_pages_v_blocks_program_schedule` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`heading` text DEFAULT 'Your weekend, mapped out',
	`introduction` text DEFAULT 'Search the live convention schedule by day, room, or session type.',
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_program_schedule_order_idx` ON `_pages_v_blocks_program_schedule` (`_order`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_program_schedule_parent_id_idx` ON `_pages_v_blocks_program_schedule` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_program_schedule_path_idx` ON `_pages_v_blocks_program_schedule` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_program_schedule` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`heading` text DEFAULT 'Your weekend, mapped out',
	`introduction` text DEFAULT 'Search the live convention schedule by day, room, or session type.',
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_program_schedule_order_idx` ON `pages_blocks_program_schedule` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_program_schedule_parent_id_idx` ON `pages_blocks_program_schedule` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_program_schedule_path_idx` ON `pages_blocks_program_schedule` (`_path`);--> statement-breakpoint
CREATE TABLE `program_sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`session_type` text DEFAULT 'panel' NOT NULL,
	`start_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`end_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`room_id` integer NOT NULL,
	`short_description` text,
	`language` text DEFAULT 'English' NOT NULL,
	`audience` text,
	`accessibility` text,
	`image_id` integer,
	`featured` integer DEFAULT false,
	`status` text DEFAULT 'published' NOT NULL,
	`internal_notes` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `program_sessions_title_idx` ON `program_sessions` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `program_sessions_slug_idx` ON `program_sessions` (`slug`);--> statement-breakpoint
CREATE INDEX `program_sessions_session_type_idx` ON `program_sessions` (`session_type`);--> statement-breakpoint
CREATE INDEX `program_sessions_start_at_idx` ON `program_sessions` (`start_at`);--> statement-breakpoint
CREATE INDEX `program_sessions_end_at_idx` ON `program_sessions` (`end_at`);--> statement-breakpoint
CREATE INDEX `program_sessions_room_idx` ON `program_sessions` (`room_id`);--> statement-breakpoint
CREATE INDEX `program_sessions_image_idx` ON `program_sessions` (`image_id`);--> statement-breakpoint
CREATE INDEX `program_sessions_status_idx` ON `program_sessions` (`status`);--> statement-breakpoint
CREATE INDEX `program_sessions_updated_at_idx` ON `program_sessions` (`updated_at`);--> statement-breakpoint
CREATE INDEX `program_sessions_created_at_idx` ON `program_sessions` (`created_at`);--> statement-breakpoint
CREATE TABLE `program_sessions_presenters` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `program_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `program_sessions_presenters_order_idx` ON `program_sessions_presenters` (`_order`);--> statement-breakpoint
CREATE INDEX `program_sessions_presenters_parent_id_idx` ON `program_sessions_presenters` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `program_sessions_tracks` (
	`order` integer NOT NULL,
	`parent_id` integer NOT NULL,
	`value` text,
	`id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `program_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `program_sessions_tracks_order_idx` ON `program_sessions_tracks` (`order`);--> statement-breakpoint
CREATE INDEX `program_sessions_tracks_parent_idx` ON `program_sessions_tracks` (`parent_id`);--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`short_label` text NOT NULL,
	`floor` text DEFAULT 'Convention level',
	`capacity` numeric,
	`accessible` integer DEFAULT true,
	`directions` text,
	`display_order` numeric DEFAULT 0 NOT NULL,
	`map_x` numeric,
	`map_y` numeric,
	`color` text DEFAULT '#E85E27',
	`notes` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_name_idx` ON `rooms` (`name`);--> statement-breakpoint
CREATE INDEX `rooms_display_order_idx` ON `rooms` (`display_order`);--> statement-breakpoint
CREATE INDEX `rooms_updated_at_idx` ON `rooms` (`updated_at`);--> statement-breakpoint
CREATE INDEX `rooms_created_at_idx` ON `rooms` (`created_at`);--> statement-breakpoint
CREATE TABLE `venue_maps` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`floor` text DEFAULT 'Convention level' NOT NULL,
	`image_id` integer,
	`alt_text` text DEFAULT 'Schematic convention-level hotel map.' NOT NULL,
	`description` text,
	`status` text DEFAULT 'published' NOT NULL,
	`display_order` numeric DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `venue_maps_image_idx` ON `venue_maps` (`image_id`);--> statement-breakpoint
CREATE INDEX `venue_maps_status_idx` ON `venue_maps` (`status`);--> statement-breakpoint
CREATE INDEX `venue_maps_updated_at_idx` ON `venue_maps` (`updated_at`);--> statement-breakpoint
CREATE INDEX `venue_maps_created_at_idx` ON `venue_maps` (`created_at`);--> statement-breakpoint
ALTER TABLE `payload_locked_documents_rels` ADD `rooms_id` integer REFERENCES rooms(id);--> statement-breakpoint
ALTER TABLE `payload_locked_documents_rels` ADD `program_sessions_id` integer REFERENCES program_sessions(id);--> statement-breakpoint
ALTER TABLE `payload_locked_documents_rels` ADD `venue_maps_id` integer REFERENCES venue_maps(id);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_rooms_id_idx` ON `payload_locked_documents_rels` (`rooms_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_program_sessions_id_idx` ON `payload_locked_documents_rels` (`program_sessions_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_venue_maps_id_idx` ON `payload_locked_documents_rels` (`venue_maps_id`);