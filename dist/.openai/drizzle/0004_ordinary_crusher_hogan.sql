ALTER TABLE `_pages_v_blocks_hero_countdown` ADD `foreground_image_id` integer REFERENCES media(id);--> statement-breakpoint
ALTER TABLE `_pages_v_blocks_hero_countdown` ADD `background_image_id` integer REFERENCES media(id);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_hero_countdown_foreground_image_idx` ON `_pages_v_blocks_hero_countdown` (`foreground_image_id`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_hero_countdown_background_image_idx` ON `_pages_v_blocks_hero_countdown` (`background_image_id`);--> statement-breakpoint
ALTER TABLE `pages_blocks_hero_countdown` ADD `foreground_image_id` integer REFERENCES media(id);--> statement-breakpoint
ALTER TABLE `pages_blocks_hero_countdown` ADD `background_image_id` integer REFERENCES media(id);--> statement-breakpoint
CREATE INDEX `pages_blocks_hero_countdown_foreground_image_idx` ON `pages_blocks_hero_countdown` (`foreground_image_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_hero_countdown_background_image_idx` ON `pages_blocks_hero_countdown` (`background_image_id`);