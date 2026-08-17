CREATE TABLE `_pages_v_blocks_about` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`body` text,
	`advisory_heading` text,
	`advisory_body` text,
	`text_styles` text,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_about_order_idx` ON `_pages_v_blocks_about` (`_order`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_about_parent_id_idx` ON `_pages_v_blocks_about` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_about_path_idx` ON `_pages_v_blocks_about` (`_path`);--> statement-breakpoint
CREATE TABLE `_pages_v_blocks_call_to_action` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`body` text,
	`primary_label` text,
	`primary_url` text,
	`secondary_label` text,
	`secondary_url` text,
	`text_styles` text,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_call_to_action_order_idx` ON `_pages_v_blocks_call_to_action` (`_order`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_call_to_action_parent_id_idx` ON `_pages_v_blocks_call_to_action` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_call_to_action_path_idx` ON `_pages_v_blocks_call_to_action` (`_path`);--> statement-breakpoint
CREATE TABLE `_pages_v_blocks_events` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`upcoming_label` text,
	`upcoming_title` text,
	`upcoming_body` text,
	`upcoming_date` text,
	`upcoming_location` text,
	`text_styles` text,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_events_order_idx` ON `_pages_v_blocks_events` (`_order`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_events_parent_id_idx` ON `_pages_v_blocks_events` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_events_path_idx` ON `_pages_v_blocks_events` (`_path`);--> statement-breakpoint
CREATE TABLE `_pages_v_blocks_events_past_events` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`date` text,
	`_uuid` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v_blocks_events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_events_past_events_order_idx` ON `_pages_v_blocks_events_past_events` (`_order`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_events_past_events_parent_id_idx` ON `_pages_v_blocks_events_past_events` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `_pages_v_blocks_free_text` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`text` text,
	`font_size` text DEFAULT '1rem',
	`color` text DEFAULT '#171b20',
	`font_weight` text DEFAULT '400',
	`alignment` text DEFAULT 'left',
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_free_text_order_idx` ON `_pages_v_blocks_free_text` (`_order`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_free_text_parent_id_idx` ON `_pages_v_blocks_free_text` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_free_text_path_idx` ON `_pages_v_blocks_free_text` (`_path`);--> statement-breakpoint
CREATE TABLE `_pages_v_blocks_hero_countdown` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`body` text,
	`event_date` text,
	`event_location` text,
	`countdown_target` text,
	`register_label` text,
	`register_url` text,
	`hotel_label` text,
	`hotel_url` text,
	`text_styles` text,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_hero_countdown_order_idx` ON `_pages_v_blocks_hero_countdown` (`_order`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_hero_countdown_parent_id_idx` ON `_pages_v_blocks_hero_countdown` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_hero_countdown_path_idx` ON `_pages_v_blocks_hero_countdown` (`_path`);--> statement-breakpoint
CREATE TABLE `_pages_v_blocks_meeting_directory` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`body` text,
	`text_styles` text,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_meeting_directory_order_idx` ON `_pages_v_blocks_meeting_directory` (`_order`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_meeting_directory_parent_id_idx` ON `_pages_v_blocks_meeting_directory` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_meeting_directory_path_idx` ON `_pages_v_blocks_meeting_directory` (`_path`);--> statement-breakpoint
CREATE TABLE `_pages_v_blocks_meeting_directory_meetings` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`location` text,
	`_uuid` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v_blocks_meeting_directory`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_meeting_directory_meetings_order_idx` ON `_pages_v_blocks_meeting_directory_meetings` (`_order`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_meeting_directory_meetings_parent_id_idx` ON `_pages_v_blocks_meeting_directory_meetings` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `_pages_v_blocks_meeting_info` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`body` text,
	`date` text,
	`time` text,
	`location` text,
	`action_label` text,
	`action_url` text,
	`text_styles` text,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_meeting_info_order_idx` ON `_pages_v_blocks_meeting_info` (`_order`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_meeting_info_parent_id_idx` ON `_pages_v_blocks_meeting_info` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_meeting_info_path_idx` ON `_pages_v_blocks_meeting_info` (`_path`);--> statement-breakpoint
CREATE TABLE `_pages_v_blocks_meeting_info_important_dates` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`date` text,
	`label` text,
	`_uuid` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v_blocks_meeting_info`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_meeting_info_important_dates_order_idx` ON `_pages_v_blocks_meeting_info_important_dates` (`_order`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_meeting_info_important_dates_parent_id_idx` ON `_pages_v_blocks_meeting_info_important_dates` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `_pages_v_blocks_rich_text` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`content` text,
	`font_size` text DEFAULT '1rem',
	`color` text DEFAULT '#171b20',
	`font_weight` text DEFAULT '400',
	`alignment` text DEFAULT 'left',
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_rich_text_order_idx` ON `_pages_v_blocks_rich_text` (`_order`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_rich_text_parent_id_idx` ON `_pages_v_blocks_rich_text` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `_pages_v_blocks_rich_text_path_idx` ON `_pages_v_blocks_rich_text` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_about` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`body` text,
	`advisory_heading` text,
	`advisory_body` text,
	`text_styles` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_about_order_idx` ON `pages_blocks_about` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_about_parent_id_idx` ON `pages_blocks_about` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_about_path_idx` ON `pages_blocks_about` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_call_to_action` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`body` text,
	`primary_label` text,
	`primary_url` text,
	`secondary_label` text,
	`secondary_url` text,
	`text_styles` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_call_to_action_order_idx` ON `pages_blocks_call_to_action` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_call_to_action_parent_id_idx` ON `pages_blocks_call_to_action` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_call_to_action_path_idx` ON `pages_blocks_call_to_action` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_events` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`upcoming_label` text,
	`upcoming_title` text,
	`upcoming_body` text,
	`upcoming_date` text,
	`upcoming_location` text,
	`text_styles` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_events_order_idx` ON `pages_blocks_events` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_events_parent_id_idx` ON `pages_blocks_events` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_events_path_idx` ON `pages_blocks_events` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_events_past_events` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`date` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_events_past_events_order_idx` ON `pages_blocks_events_past_events` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_events_past_events_parent_id_idx` ON `pages_blocks_events_past_events` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `pages_blocks_free_text` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`text` text,
	`font_size` text DEFAULT '1rem',
	`color` text DEFAULT '#171b20',
	`font_weight` text DEFAULT '400',
	`alignment` text DEFAULT 'left',
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_free_text_order_idx` ON `pages_blocks_free_text` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_free_text_parent_id_idx` ON `pages_blocks_free_text` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_free_text_path_idx` ON `pages_blocks_free_text` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_hero_countdown` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`body` text,
	`event_date` text,
	`event_location` text,
	`countdown_target` text,
	`register_label` text,
	`register_url` text,
	`hotel_label` text,
	`hotel_url` text,
	`text_styles` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_hero_countdown_order_idx` ON `pages_blocks_hero_countdown` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_hero_countdown_parent_id_idx` ON `pages_blocks_hero_countdown` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_hero_countdown_path_idx` ON `pages_blocks_hero_countdown` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_meeting_directory` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`body` text,
	`text_styles` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_meeting_directory_order_idx` ON `pages_blocks_meeting_directory` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_meeting_directory_parent_id_idx` ON `pages_blocks_meeting_directory` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_meeting_directory_path_idx` ON `pages_blocks_meeting_directory` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_meeting_directory_meetings` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`location` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_meeting_directory`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_meeting_directory_meetings_order_idx` ON `pages_blocks_meeting_directory_meetings` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_meeting_directory_meetings_parent_id_idx` ON `pages_blocks_meeting_directory_meetings` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `pages_blocks_meeting_info` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`body` text,
	`date` text,
	`time` text,
	`location` text,
	`action_label` text,
	`action_url` text,
	`text_styles` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_meeting_info_order_idx` ON `pages_blocks_meeting_info` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_meeting_info_parent_id_idx` ON `pages_blocks_meeting_info` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_meeting_info_path_idx` ON `pages_blocks_meeting_info` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_meeting_info_important_dates` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`date` text,
	`label` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_meeting_info`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_meeting_info_important_dates_order_idx` ON `pages_blocks_meeting_info_important_dates` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_meeting_info_important_dates_parent_id_idx` ON `pages_blocks_meeting_info_important_dates` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `pages_blocks_rich_text` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`content` text,
	`font_size` text DEFAULT '1rem',
	`color` text DEFAULT '#171b20',
	`font_weight` text DEFAULT '400',
	`alignment` text DEFAULT 'left',
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_rich_text_order_idx` ON `pages_blocks_rich_text` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_rich_text_parent_id_idx` ON `pages_blocks_rich_text` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_rich_text_path_idx` ON `pages_blocks_rich_text` (`_path`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new__pages_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`version_title` text,
	`version_slug` text,
	`version_meta_title` text,
	`version_meta_description` text,
	`version_builder_data` text DEFAULT '{"root":{"props":{"title":"NECYPAA XXXVI"}},"content":[{"type":"HeroCountdown","props":{"id":"hero","eyebrow":"Escaping the Mad Realm","heading":"NECYPAA XXXVI","body":"Four days of recovery, fellowship, service, and celebration in Hartford, Connecticut.","eventDate":"December 31, 2026 – January 3, 2027","eventLocation":"Hartford Marriott Downtown","countdownTarget":"2026-12-31T17:00:00-05:00","registerLabel":"Register","registerUrl":"https://register.necypaact.com/en/register","hotelLabel":"Book a hotel room","hotelUrl":"https://www.necypaact.com/hotel"}},{"type":"About","props":{"id":"about","eyebrow":"About NECYPAA","heading":"Four days. One fellowship. A way out of the ordinary.","body":"NECYPAA brings young people in Alcoholics Anonymous together from across the Northeast for speakers, workshops, dancing, service, and the kind of connection that makes recovery feel possible. Young means young at heart—whether this is your first sober event or your fiftieth convention, you are welcome here.","advisoryHeading":"Anonymity matters","advisoryBody":"Please help protect personal anonymity when sharing photos or stories from convention spaces."}},{"type":"MeetingInfo","props":{"id":"business-meeting","eyebrow":"Host committee","heading":"Business meeting","body":"See how the convention is built through committee work, updates, votes, and fellowship. No title or commitment is required—just show up.","date":"Sunday, August 16, 2026","time":"2:00 PM Eastern","location":"Online via Zoom","actionLabel":"Join on Zoom","actionUrl":"https://www.necypaact.com/service","importantDates":[{"date":"Aug 16","label":"Host committee business meeting"},{"date":"Aug 22","label":"Three Frogs on a Log workshop"},{"date":"Dec 31","label":"Convention opens at 5:00 PM"},{"date":"Jan 3","label":"Convention closes"}]}},{"type":"Events","props":{"id":"events","eyebrow":"Gather with us","heading":"Upcoming and past events","upcomingLabel":"Next up","upcomingTitle":"Three Frogs on a Log","upcomingBody":"A Step Two and Three workshop with four mini-speakers and a live Q&A.","upcomingDate":"Saturday, August 22, 2026","upcomingLocation":"Online via Zoom","pastEvents":[{"title":"The Ultimate Cool Down","date":"April 25, 2026"},{"title":"Zombie Prom","date":"February 13, 2026"},{"title":"New Year’s Eve Bonfire","date":"December 31, 2025"},{"title":"Cardboard Masquerade","date":"May 30, 2025"}]}},{"type":"MeetingDirectory","props":{"id":"ypaa","eyebrow":"Across the Northeast","heading":"YPAA meetings near you","body":"Find young people’s meetings and committees throughout the region.","meetings":[{"name":"Connecticut YPAA","location":"Connecticut"},{"name":"Maine YPAA","location":"Maine"},{"name":"Massachusetts YPAA","location":"Massachusetts"},{"name":"New Hampshire YPAA","location":"New Hampshire"},{"name":"New Jersey YPAA","location":"New Jersey"},{"name":"New York YPAA","location":"New York"},{"name":"Pennsylvania YPAA","location":"Pennsylvania"},{"name":"Rhode Island YPAA","location":"Rhode Island"},{"name":"Vermont YPAA","location":"Vermont"}]}},{"type":"CallToAction","props":{"id":"register","eyebrow":"See you in Hartford","heading":"Ready for NECYPAA XXXVI?","body":"Register for the convention and reserve your room while space is available.","primaryLabel":"Register","primaryUrl":"https://register.necypaact.com/en/register","secondaryLabel":"Book a hotel room","secondaryUrl":"https://www.necypaact.com/hotel"}}],"zones":{}}',
	`version_updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`version_created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`version__status` text DEFAULT 'draft',
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`latest` integer,
	`autosave` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new__pages_v`("id", "parent_id", "version_title", "version_slug", "version_meta_title", "version_meta_description", "version_builder_data", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave") SELECT "id", "parent_id", "version_title", "version_slug", "version_meta_title", "version_meta_description", "version_builder_data", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave" FROM `_pages_v`;--> statement-breakpoint
DROP TABLE `_pages_v`;--> statement-breakpoint
ALTER TABLE `__new__pages_v` RENAME TO `_pages_v`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `_pages_v_parent_idx` ON `_pages_v` (`parent_id`);--> statement-breakpoint
CREATE INDEX `_pages_v_version_version_slug_idx` ON `_pages_v` (`version_slug`);--> statement-breakpoint
CREATE INDEX `_pages_v_version_version_updated_at_idx` ON `_pages_v` (`version_updated_at`);--> statement-breakpoint
CREATE INDEX `_pages_v_version_version_created_at_idx` ON `_pages_v` (`version_created_at`);--> statement-breakpoint
CREATE INDEX `_pages_v_version_version__status_idx` ON `_pages_v` (`version__status`);--> statement-breakpoint
CREATE INDEX `_pages_v_created_at_idx` ON `_pages_v` (`created_at`);--> statement-breakpoint
CREATE INDEX `_pages_v_updated_at_idx` ON `_pages_v` (`updated_at`);--> statement-breakpoint
CREATE INDEX `_pages_v_latest_idx` ON `_pages_v` (`latest`);--> statement-breakpoint
CREATE INDEX `_pages_v_autosave_idx` ON `_pages_v` (`autosave`);--> statement-breakpoint
CREATE TABLE `__new_pages` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`slug` text,
	`meta_title` text,
	`meta_description` text,
	`builder_data` text DEFAULT '{"root":{"props":{"title":"NECYPAA XXXVI"}},"content":[{"type":"HeroCountdown","props":{"id":"hero","eyebrow":"Escaping the Mad Realm","heading":"NECYPAA XXXVI","body":"Four days of recovery, fellowship, service, and celebration in Hartford, Connecticut.","eventDate":"December 31, 2026 – January 3, 2027","eventLocation":"Hartford Marriott Downtown","countdownTarget":"2026-12-31T17:00:00-05:00","registerLabel":"Register","registerUrl":"https://register.necypaact.com/en/register","hotelLabel":"Book a hotel room","hotelUrl":"https://www.necypaact.com/hotel"}},{"type":"About","props":{"id":"about","eyebrow":"About NECYPAA","heading":"Four days. One fellowship. A way out of the ordinary.","body":"NECYPAA brings young people in Alcoholics Anonymous together from across the Northeast for speakers, workshops, dancing, service, and the kind of connection that makes recovery feel possible. Young means young at heart—whether this is your first sober event or your fiftieth convention, you are welcome here.","advisoryHeading":"Anonymity matters","advisoryBody":"Please help protect personal anonymity when sharing photos or stories from convention spaces."}},{"type":"MeetingInfo","props":{"id":"business-meeting","eyebrow":"Host committee","heading":"Business meeting","body":"See how the convention is built through committee work, updates, votes, and fellowship. No title or commitment is required—just show up.","date":"Sunday, August 16, 2026","time":"2:00 PM Eastern","location":"Online via Zoom","actionLabel":"Join on Zoom","actionUrl":"https://www.necypaact.com/service","importantDates":[{"date":"Aug 16","label":"Host committee business meeting"},{"date":"Aug 22","label":"Three Frogs on a Log workshop"},{"date":"Dec 31","label":"Convention opens at 5:00 PM"},{"date":"Jan 3","label":"Convention closes"}]}},{"type":"Events","props":{"id":"events","eyebrow":"Gather with us","heading":"Upcoming and past events","upcomingLabel":"Next up","upcomingTitle":"Three Frogs on a Log","upcomingBody":"A Step Two and Three workshop with four mini-speakers and a live Q&A.","upcomingDate":"Saturday, August 22, 2026","upcomingLocation":"Online via Zoom","pastEvents":[{"title":"The Ultimate Cool Down","date":"April 25, 2026"},{"title":"Zombie Prom","date":"February 13, 2026"},{"title":"New Year’s Eve Bonfire","date":"December 31, 2025"},{"title":"Cardboard Masquerade","date":"May 30, 2025"}]}},{"type":"MeetingDirectory","props":{"id":"ypaa","eyebrow":"Across the Northeast","heading":"YPAA meetings near you","body":"Find young people’s meetings and committees throughout the region.","meetings":[{"name":"Connecticut YPAA","location":"Connecticut"},{"name":"Maine YPAA","location":"Maine"},{"name":"Massachusetts YPAA","location":"Massachusetts"},{"name":"New Hampshire YPAA","location":"New Hampshire"},{"name":"New Jersey YPAA","location":"New Jersey"},{"name":"New York YPAA","location":"New York"},{"name":"Pennsylvania YPAA","location":"Pennsylvania"},{"name":"Rhode Island YPAA","location":"Rhode Island"},{"name":"Vermont YPAA","location":"Vermont"}]}},{"type":"CallToAction","props":{"id":"register","eyebrow":"See you in Hartford","heading":"Ready for NECYPAA XXXVI?","body":"Register for the convention and reserve your room while space is available.","primaryLabel":"Register","primaryUrl":"https://register.necypaact.com/en/register","secondaryLabel":"Book a hotel room","secondaryUrl":"https://www.necypaact.com/hotel"}}],"zones":{}}',
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`_status` text DEFAULT 'draft'
);
--> statement-breakpoint
INSERT INTO `__new_pages`("id", "title", "slug", "meta_title", "meta_description", "builder_data", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "meta_title", "meta_description", "builder_data", "updated_at", "created_at", "_status" FROM `pages`;--> statement-breakpoint
DROP TABLE `pages`;--> statement-breakpoint
ALTER TABLE `__new_pages` RENAME TO `pages`;--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_idx` ON `pages` (`slug`);--> statement-breakpoint
CREATE INDEX `pages_updated_at_idx` ON `pages` (`updated_at`);--> statement-breakpoint
CREATE INDEX `pages_created_at_idx` ON `pages` (`created_at`);--> statement-breakpoint
CREATE INDEX `pages__status_idx` ON `pages` (`_status`);