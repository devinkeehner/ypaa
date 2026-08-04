CREATE TABLE `_pages_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`version_title` text,
	`version_slug` text,
	`version_builder_data` text DEFAULT '{"root":{"props":{"title":"NECYPAA XXXVI"}},"content":[{"type":"HeroCountdown","props":{"id":"hero","eyebrow":"Escaping the Mad Realm","heading":"NECYPAA XXXVI","body":"Four days of recovery, fellowship, service, and celebration in Hartford, Connecticut.","eventDate":"December 31, 2026 – January 3, 2027","eventLocation":"Hartford Marriott Downtown","countdownTarget":"2026-12-31T17:00:00-05:00","registerLabel":"Register","registerUrl":"https://register.necypaact.com/en/register","hotelLabel":"Book a hotel room","hotelUrl":"https://www.necypaact.com/hotel"}},{"type":"About","props":{"id":"about","eyebrow":"About NECYPAA","heading":"Four days. One fellowship. A way out of the ordinary.","body":"NECYPAA brings young people in Alcoholics Anonymous together from across the Northeast for speakers, workshops, dancing, service, and the kind of connection that makes recovery feel possible. Young means young at heart—whether this is your first sober event or your fiftieth convention, you are welcome here.","advisoryHeading":"Anonymity matters","advisoryBody":"Please help protect personal anonymity when sharing photos or stories from convention spaces."}},{"type":"MeetingInfo","props":{"id":"business-meeting","eyebrow":"Host committee","heading":"Business meeting","body":"See how the convention is built through committee work, updates, votes, and fellowship. No title or commitment is required—just show up.","date":"Sunday, August 16, 2026","time":"2:00 PM Eastern","location":"Online via Zoom","actionLabel":"Join on Zoom","actionUrl":"https://www.necypaact.com/service","importantDates":"Aug 16 — Host committee business meeting
Aug 22 — Three Frogs on a Log workshop
Dec 31 — Convention opens at 5:00 PM
Jan 3 — Convention closes"}},{"type":"Events","props":{"id":"events","eyebrow":"Gather with us","heading":"Upcoming and past events","upcomingLabel":"Next up","upcomingTitle":"Three Frogs on a Log","upcomingBody":"A Step Two and Three workshop with four mini-speakers and a live Q&A.","upcomingDate":"Saturday, August 22, 2026","upcomingLocation":"Online via Zoom","pastEvents":"The Ultimate Cool Down — April 25, 2026
Zombie Prom — February 13, 2026
New Year’s Eve Bonfire — December 31, 2025
Cardboard Masquerade — May 30, 2025"}},{"type":"MeetingDirectory","props":{"id":"ypaa","eyebrow":"Across the Northeast","heading":"YPAA meetings near you","body":"Find young people’s meetings and committees throughout the region.","meetings":"Connecticut YPAA — Connecticut
Maine YPAA — Maine
Massachusetts YPAA — Massachusetts
New Hampshire YPAA — New Hampshire
New Jersey YPAA — New Jersey
New York YPAA — New York
Pennsylvania YPAA — Pennsylvania
Rhode Island YPAA — Rhode Island
Vermont YPAA — Vermont"}},{"type":"CallToAction","props":{"id":"register","eyebrow":"See you in Hartford","heading":"Ready for NECYPAA XXXVI?","body":"Register for the convention and reserve your room while space is available.","primaryLabel":"Register","primaryUrl":"https://register.necypaact.com/en/register","secondaryLabel":"Book a hotel room","secondaryUrl":"https://www.necypaact.com/hotel"}}],"zones":{}}',
	`version_meta_title` text,
	`version_meta_description` text,
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
CREATE INDEX `_pages_v_parent_idx` ON `_pages_v` (`parent_id`);--> statement-breakpoint
CREATE INDEX `_pages_v_version_version_slug_idx` ON `_pages_v` (`version_slug`);--> statement-breakpoint
CREATE INDEX `_pages_v_version_version_updated_at_idx` ON `_pages_v` (`version_updated_at`);--> statement-breakpoint
CREATE INDEX `_pages_v_version_version_created_at_idx` ON `_pages_v` (`version_created_at`);--> statement-breakpoint
CREATE INDEX `_pages_v_version_version__status_idx` ON `_pages_v` (`version__status`);--> statement-breakpoint
CREATE INDEX `_pages_v_created_at_idx` ON `_pages_v` (`created_at`);--> statement-breakpoint
CREATE INDEX `_pages_v_updated_at_idx` ON `_pages_v` (`updated_at`);--> statement-breakpoint
CREATE INDEX `_pages_v_latest_idx` ON `_pages_v` (`latest`);--> statement-breakpoint
CREATE INDEX `_pages_v_autosave_idx` ON `_pages_v` (`autosave`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY NOT NULL,
	`alt` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`url` text,
	`thumbnail_u_r_l` text,
	`filename` text,
	`mime_type` text,
	`filesize` numeric,
	`width` numeric,
	`height` numeric,
	`focal_x` numeric,
	`focal_y` numeric
);
--> statement-breakpoint
CREATE INDEX `media_updated_at_idx` ON `media` (`updated_at`);--> statement-breakpoint
CREATE INDEX `media_created_at_idx` ON `media` (`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `media_filename_idx` ON `media` (`filename`);--> statement-breakpoint
CREATE TABLE `pages` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`slug` text,
	`builder_data` text DEFAULT '{"root":{"props":{"title":"NECYPAA XXXVI"}},"content":[{"type":"HeroCountdown","props":{"id":"hero","eyebrow":"Escaping the Mad Realm","heading":"NECYPAA XXXVI","body":"Four days of recovery, fellowship, service, and celebration in Hartford, Connecticut.","eventDate":"December 31, 2026 – January 3, 2027","eventLocation":"Hartford Marriott Downtown","countdownTarget":"2026-12-31T17:00:00-05:00","registerLabel":"Register","registerUrl":"https://register.necypaact.com/en/register","hotelLabel":"Book a hotel room","hotelUrl":"https://www.necypaact.com/hotel"}},{"type":"About","props":{"id":"about","eyebrow":"About NECYPAA","heading":"Four days. One fellowship. A way out of the ordinary.","body":"NECYPAA brings young people in Alcoholics Anonymous together from across the Northeast for speakers, workshops, dancing, service, and the kind of connection that makes recovery feel possible. Young means young at heart—whether this is your first sober event or your fiftieth convention, you are welcome here.","advisoryHeading":"Anonymity matters","advisoryBody":"Please help protect personal anonymity when sharing photos or stories from convention spaces."}},{"type":"MeetingInfo","props":{"id":"business-meeting","eyebrow":"Host committee","heading":"Business meeting","body":"See how the convention is built through committee work, updates, votes, and fellowship. No title or commitment is required—just show up.","date":"Sunday, August 16, 2026","time":"2:00 PM Eastern","location":"Online via Zoom","actionLabel":"Join on Zoom","actionUrl":"https://www.necypaact.com/service","importantDates":"Aug 16 — Host committee business meeting
Aug 22 — Three Frogs on a Log workshop
Dec 31 — Convention opens at 5:00 PM
Jan 3 — Convention closes"}},{"type":"Events","props":{"id":"events","eyebrow":"Gather with us","heading":"Upcoming and past events","upcomingLabel":"Next up","upcomingTitle":"Three Frogs on a Log","upcomingBody":"A Step Two and Three workshop with four mini-speakers and a live Q&A.","upcomingDate":"Saturday, August 22, 2026","upcomingLocation":"Online via Zoom","pastEvents":"The Ultimate Cool Down — April 25, 2026
Zombie Prom — February 13, 2026
New Year’s Eve Bonfire — December 31, 2025
Cardboard Masquerade — May 30, 2025"}},{"type":"MeetingDirectory","props":{"id":"ypaa","eyebrow":"Across the Northeast","heading":"YPAA meetings near you","body":"Find young people’s meetings and committees throughout the region.","meetings":"Connecticut YPAA — Connecticut
Maine YPAA — Maine
Massachusetts YPAA — Massachusetts
New Hampshire YPAA — New Hampshire
New Jersey YPAA — New Jersey
New York YPAA — New York
Pennsylvania YPAA — Pennsylvania
Rhode Island YPAA — Rhode Island
Vermont YPAA — Vermont"}},{"type":"CallToAction","props":{"id":"register","eyebrow":"See you in Hartford","heading":"Ready for NECYPAA XXXVI?","body":"Register for the convention and reserve your room while space is available.","primaryLabel":"Register","primaryUrl":"https://register.necypaact.com/en/register","secondaryLabel":"Book a hotel room","secondaryUrl":"https://www.necypaact.com/hotel"}}],"zones":{}}',
	`meta_title` text,
	`meta_description` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`_status` text DEFAULT 'draft'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_idx` ON `pages` (`slug`);--> statement-breakpoint
CREATE INDEX `pages_updated_at_idx` ON `pages` (`updated_at`);--> statement-breakpoint
CREATE INDEX `pages_created_at_idx` ON `pages` (`created_at`);--> statement-breakpoint
CREATE INDEX `pages__status_idx` ON `pages` (`_status`);--> statement-breakpoint
CREATE TABLE `payload_kv` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payload_kv_key_idx` ON `payload_kv` (`key`);--> statement-breakpoint
CREATE TABLE `payload_locked_documents` (
	`id` integer PRIMARY KEY NOT NULL,
	`global_slug` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `payload_locked_documents_global_slug_idx` ON `payload_locked_documents` (`global_slug`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_updated_at_idx` ON `payload_locked_documents` (`updated_at`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_created_at_idx` ON `payload_locked_documents` (`created_at`);--> statement-breakpoint
CREATE TABLE `payload_locked_documents_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	`media_id` integer,
	`pages_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_locked_documents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_order_idx` ON `payload_locked_documents_rels` (`order`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_parent_idx` ON `payload_locked_documents_rels` (`parent_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_path_idx` ON `payload_locked_documents_rels` (`path`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_users_id_idx` ON `payload_locked_documents_rels` (`users_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_media_id_idx` ON `payload_locked_documents_rels` (`media_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_pages_id_idx` ON `payload_locked_documents_rels` (`pages_id`);--> statement-breakpoint
CREATE TABLE `payload_migrations` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`batch` numeric,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `payload_migrations_updated_at_idx` ON `payload_migrations` (`updated_at`);--> statement-breakpoint
CREATE INDEX `payload_migrations_created_at_idx` ON `payload_migrations` (`created_at`);--> statement-breakpoint
CREATE TABLE `payload_preferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text,
	`value` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `payload_preferences_key_idx` ON `payload_preferences` (`key`);--> statement-breakpoint
CREATE INDEX `payload_preferences_updated_at_idx` ON `payload_preferences` (`updated_at`);--> statement-breakpoint
CREATE INDEX `payload_preferences_created_at_idx` ON `payload_preferences` (`created_at`);--> statement-breakpoint
CREATE TABLE `payload_preferences_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_preferences`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_order_idx` ON `payload_preferences_rels` (`order`);--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_parent_idx` ON `payload_preferences_rels` (`parent_id`);--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_path_idx` ON `payload_preferences_rels` (`path`);--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_users_id_idx` ON `payload_preferences_rels` (`users_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`email` text NOT NULL,
	`reset_password_token` text,
	`reset_password_expiration` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`salt` text,
	`hash` text,
	`login_attempts` numeric DEFAULT 0,
	`lock_until` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
--> statement-breakpoint
CREATE INDEX `users_updated_at_idx` ON `users` (`updated_at`);--> statement-breakpoint
CREATE INDEX `users_created_at_idx` ON `users` (`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `users_sessions` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`expires_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `users_sessions_order_idx` ON `users_sessions` (`_order`);--> statement-breakpoint
CREATE INDEX `users_sessions_parent_id_idx` ON `users_sessions` (`_parent_id`);