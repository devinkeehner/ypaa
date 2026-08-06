CREATE TABLE `access_codes` (
	`id` integer PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`max_redemptions` numeric DEFAULT 1 NOT NULL,
	`redemption_count` numeric DEFAULT 0 NOT NULL,
	`grant_type` text DEFAULT 'cash_order' NOT NULL,
	`issuer_source` text DEFAULT 'necypaa_host_committee',
	`notes` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_codes_code_idx` ON `access_codes` (`code`);--> statement-breakpoint
CREATE INDEX `access_codes_updated_at_idx` ON `access_codes` (`updated_at`);--> statement-breakpoint
CREATE INDEX `access_codes_created_at_idx` ON `access_codes` (`created_at`);--> statement-breakpoint
CREATE TABLE `cash_transactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`purchaser_name` text NOT NULL,
	`purchaser_email` text NOT NULL,
	`recorded_value_cents` numeric NOT NULL,
	`status` text DEFAULT 'recorded' NOT NULL,
	`stripe_customer_id` text,
	`access_code_id` integer NOT NULL,
	`order` text NOT NULL,
	`metadata` text NOT NULL,
	`notification_status` text DEFAULT 'not_required',
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`access_code_id`) REFERENCES `access_codes`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `cash_transactions_access_code_idx` ON `cash_transactions` (`access_code_id`);--> statement-breakpoint
CREATE INDEX `cash_transactions_updated_at_idx` ON `cash_transactions` (`updated_at`);--> statement-breakpoint
CREATE INDEX `cash_transactions_created_at_idx` ON `cash_transactions` (`created_at`);--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'NECYPAA XXXVI' NOT NULL,
	`logo_id` integer,
	`logo_alt` text DEFAULT 'NECYPAA XXXVI',
	`theme_primary` text DEFAULT '#E85E27' NOT NULL,
	`theme_secondary` text DEFAULT '#31275A' NOT NULL,
	`theme_accent` text DEFAULT '#FFD76A' NOT NULL,
	`theme_background` text DEFAULT '#0C0D0E' NOT NULL,
	`theme_surface` text DEFAULT '#15181A' NOT NULL,
	`theme_light_background` text DEFAULT '#F5EEE1' NOT NULL,
	`theme_dark_text` text DEFAULT '#171614' NOT NULL,
	`theme_light_text` text DEFAULT '#F4E8D3' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`logo_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `tenants_logo_idx` ON `tenants` (`logo_id`);--> statement-breakpoint
CREATE INDEX `tenants_updated_at_idx` ON `tenants` (`updated_at`);--> statement-breakpoint
CREATE INDEX `tenants_created_at_idx` ON `tenants` (`created_at`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new__pages_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`version_title` text,
	`version_slug` text,
	`version_meta_title` text,
	`version_meta_description` text,
	`version_builder_data` text DEFAULT '{"root":{"props":{"title":"NECYPAA XXXVI"}},"content":[{"type":"HeroCountdown","props":{"id":"hero","eyebrow":"Escaping the Mad Realm","heading":"NECYPAA XXXVI","body":"Four days of recovery, fellowship, service, and celebration in Hartford, Connecticut.","eventDate":"December 31, 2026 – January 3, 2027","eventLocation":"Hartford Marriott Downtown","countdownTarget":"2026-12-31T17:00:00-05:00","registerLabel":"Register","registerUrl":"/register","hotelLabel":"Book a hotel room","hotelUrl":"https://www.necypaact.com/hotel"}},{"type":"About","props":{"id":"about","eyebrow":"About NECYPAA","heading":"Four days. One fellowship. A way out of the ordinary.","body":"NECYPAA brings young people in Alcoholics Anonymous together from across the Northeast for speakers, workshops, dancing, service, and the kind of connection that makes recovery feel possible. Young means young at heart—whether this is your first sober event or your fiftieth convention, you are welcome here.","advisoryHeading":"Anonymity matters","advisoryBody":"Please help protect personal anonymity when sharing photos or stories from convention spaces."}},{"type":"MeetingInfo","props":{"id":"business-meeting","eyebrow":"Host committee","heading":"Business meeting","body":"See how the convention is built through committee work, updates, votes, and fellowship. No title or commitment is required—just show up.","date":"Sunday, August 16, 2026","time":"2:00 PM Eastern","location":"Online via Zoom","actionLabel":"Join on Zoom","actionUrl":"https://www.necypaact.com/service","importantDates":[{"date":"Aug 16","label":"Host committee business meeting"},{"date":"Aug 22","label":"Three Frogs on a Log workshop"},{"date":"Dec 31","label":"Convention opens at 5:00 PM"},{"date":"Jan 3","label":"Convention closes"}]}},{"type":"Events","props":{"id":"events","eyebrow":"Gather with us","heading":"Upcoming and past events","upcomingLabel":"Next up","upcomingTitle":"Three Frogs on a Log","upcomingBody":"A Step Two and Three workshop with four mini-speakers and a live Q&A.","upcomingDate":"Saturday, August 22, 2026","upcomingLocation":"Online via Zoom","pastEvents":[{"title":"The Ultimate Cool Down","date":"April 25, 2026"},{"title":"Zombie Prom","date":"February 13, 2026"},{"title":"New Year’s Eve Bonfire","date":"December 31, 2025"},{"title":"Cardboard Masquerade","date":"May 30, 2025"}]}},{"type":"MeetingDirectory","props":{"id":"ypaa","eyebrow":"Across the Northeast","heading":"YPAA meetings near you","body":"Find young people’s meetings and committees throughout the region.","meetings":[{"name":"Connecticut YPAA","location":"Connecticut"},{"name":"Maine YPAA","location":"Maine"},{"name":"Massachusetts YPAA","location":"Massachusetts"},{"name":"New Hampshire YPAA","location":"New Hampshire"},{"name":"New Jersey YPAA","location":"New Jersey"},{"name":"New York YPAA","location":"New York"},{"name":"Pennsylvania YPAA","location":"Pennsylvania"},{"name":"Rhode Island YPAA","location":"Rhode Island"},{"name":"Vermont YPAA","location":"Vermont"}]}},{"type":"CallToAction","props":{"id":"register","eyebrow":"See you in Hartford","heading":"Ready for NECYPAA XXXVI?","body":"Register for the convention and reserve your room while space is available.","primaryLabel":"Register","primaryUrl":"/register","secondaryLabel":"Book a hotel room","secondaryUrl":"https://www.necypaact.com/hotel"}}],"zones":{}}',
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
	`builder_data` text DEFAULT '{"root":{"props":{"title":"NECYPAA XXXVI"}},"content":[{"type":"HeroCountdown","props":{"id":"hero","eyebrow":"Escaping the Mad Realm","heading":"NECYPAA XXXVI","body":"Four days of recovery, fellowship, service, and celebration in Hartford, Connecticut.","eventDate":"December 31, 2026 – January 3, 2027","eventLocation":"Hartford Marriott Downtown","countdownTarget":"2026-12-31T17:00:00-05:00","registerLabel":"Register","registerUrl":"/register","hotelLabel":"Book a hotel room","hotelUrl":"https://www.necypaact.com/hotel"}},{"type":"About","props":{"id":"about","eyebrow":"About NECYPAA","heading":"Four days. One fellowship. A way out of the ordinary.","body":"NECYPAA brings young people in Alcoholics Anonymous together from across the Northeast for speakers, workshops, dancing, service, and the kind of connection that makes recovery feel possible. Young means young at heart—whether this is your first sober event or your fiftieth convention, you are welcome here.","advisoryHeading":"Anonymity matters","advisoryBody":"Please help protect personal anonymity when sharing photos or stories from convention spaces."}},{"type":"MeetingInfo","props":{"id":"business-meeting","eyebrow":"Host committee","heading":"Business meeting","body":"See how the convention is built through committee work, updates, votes, and fellowship. No title or commitment is required—just show up.","date":"Sunday, August 16, 2026","time":"2:00 PM Eastern","location":"Online via Zoom","actionLabel":"Join on Zoom","actionUrl":"https://www.necypaact.com/service","importantDates":[{"date":"Aug 16","label":"Host committee business meeting"},{"date":"Aug 22","label":"Three Frogs on a Log workshop"},{"date":"Dec 31","label":"Convention opens at 5:00 PM"},{"date":"Jan 3","label":"Convention closes"}]}},{"type":"Events","props":{"id":"events","eyebrow":"Gather with us","heading":"Upcoming and past events","upcomingLabel":"Next up","upcomingTitle":"Three Frogs on a Log","upcomingBody":"A Step Two and Three workshop with four mini-speakers and a live Q&A.","upcomingDate":"Saturday, August 22, 2026","upcomingLocation":"Online via Zoom","pastEvents":[{"title":"The Ultimate Cool Down","date":"April 25, 2026"},{"title":"Zombie Prom","date":"February 13, 2026"},{"title":"New Year’s Eve Bonfire","date":"December 31, 2025"},{"title":"Cardboard Masquerade","date":"May 30, 2025"}]}},{"type":"MeetingDirectory","props":{"id":"ypaa","eyebrow":"Across the Northeast","heading":"YPAA meetings near you","body":"Find young people’s meetings and committees throughout the region.","meetings":[{"name":"Connecticut YPAA","location":"Connecticut"},{"name":"Maine YPAA","location":"Maine"},{"name":"Massachusetts YPAA","location":"Massachusetts"},{"name":"New Hampshire YPAA","location":"New Hampshire"},{"name":"New Jersey YPAA","location":"New Jersey"},{"name":"New York YPAA","location":"New York"},{"name":"Pennsylvania YPAA","location":"Pennsylvania"},{"name":"Rhode Island YPAA","location":"Rhode Island"},{"name":"Vermont YPAA","location":"Vermont"}]}},{"type":"CallToAction","props":{"id":"register","eyebrow":"See you in Hartford","heading":"Ready for NECYPAA XXXVI?","body":"Register for the convention and reserve your room while space is available.","primaryLabel":"Register","primaryUrl":"/register","secondaryLabel":"Book a hotel room","secondaryUrl":"https://www.necypaact.com/hotel"}}],"zones":{}}',
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
CREATE INDEX `pages__status_idx` ON `pages` (`_status`);--> statement-breakpoint
ALTER TABLE `payload_locked_documents_rels` ADD `tenants_id` integer REFERENCES tenants(id);--> statement-breakpoint
ALTER TABLE `payload_locked_documents_rels` ADD `access_codes_id` integer REFERENCES access_codes(id);--> statement-breakpoint
ALTER TABLE `payload_locked_documents_rels` ADD `cash_transactions_id` integer REFERENCES cash_transactions(id);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_tenants_id_idx` ON `payload_locked_documents_rels` (`tenants_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_access_codes_id_idx` ON `payload_locked_documents_rels` (`access_codes_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_cash_transactions_id_idx` ON `payload_locked_documents_rels` (`cash_transactions_id`);
--> statement-breakpoint
UPDATE `pages_blocks_hero_countdown` SET `register_url` = '/register' WHERE `register_url` = 'https://register.necypaact.com/en/register';
--> statement-breakpoint
UPDATE `_pages_v_blocks_hero_countdown` SET `register_url` = '/register' WHERE `register_url` = 'https://register.necypaact.com/en/register';
--> statement-breakpoint
UPDATE `pages_blocks_call_to_action` SET `primary_url` = '/register' WHERE `primary_url` = 'https://register.necypaact.com/en/register';
--> statement-breakpoint
UPDATE `_pages_v_blocks_call_to_action` SET `primary_url` = '/register' WHERE `primary_url` = 'https://register.necypaact.com/en/register';
