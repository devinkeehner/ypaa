CREATE TABLE `attendees` (
	`id` integer PRIMARY KEY NOT NULL,
	`source_key` text NOT NULL,
	`attendee_name` text NOT NULL,
	`attendee_email` text NOT NULL,
	`state` text NOT NULL,
	`homegroup_committee` text,
	`accommodations` text,
	`interpretation_needed` integer DEFAULT false,
	`mobility_accessibility` integer DEFAULT false,
	`willing_to_serve` integer DEFAULT false,
	`purchaser_name` text NOT NULL,
	`purchaser_email` text NOT NULL,
	`registration_price_cents` numeric DEFAULT 4000 NOT NULL,
	`payment_source` text NOT NULL,
	`payment_status` text NOT NULL,
	`data_origin` text NOT NULL,
	`purchased_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`stripe_checkout_session_id` text,
	`stripe_payment_intent_id` text,
	`stripe_charge_id` text,
	`stripe_customer_id` text,
	`cash_transaction_id` integer,
	`policy_acknowledgments_read_policy` integer DEFAULT false,
	`policy_acknowledgments_understand_questions` integer DEFAULT false,
	`policy_acknowledgments_acknowledge_behavior` integer DEFAULT false,
	`policy_acknowledgments_understand_admission` integer DEFAULT false,
	`policy_acknowledgments_understand_reporting` integer DEFAULT false,
	`policy_acknowledgments_understand_investigation` integer DEFAULT false,
	`policy_acknowledgments_signature_agreement` integer DEFAULT false,
	`raw_metadata` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`cash_transaction_id`) REFERENCES `cash_transactions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `attendees_source_key_idx` ON `attendees` (`source_key`);--> statement-breakpoint
CREATE INDEX `attendees_attendee_name_idx` ON `attendees` (`attendee_name`);--> statement-breakpoint
CREATE INDEX `attendees_attendee_email_idx` ON `attendees` (`attendee_email`);--> statement-breakpoint
CREATE INDEX `attendees_purchaser_email_idx` ON `attendees` (`purchaser_email`);--> statement-breakpoint
CREATE INDEX `attendees_purchased_at_idx` ON `attendees` (`purchased_at`);--> statement-breakpoint
CREATE INDEX `attendees_stripe_checkout_session_id_idx` ON `attendees` (`stripe_checkout_session_id`);--> statement-breakpoint
CREATE INDEX `attendees_stripe_payment_intent_id_idx` ON `attendees` (`stripe_payment_intent_id`);--> statement-breakpoint
CREATE INDEX `attendees_stripe_charge_id_idx` ON `attendees` (`stripe_charge_id`);--> statement-breakpoint
CREATE INDEX `attendees_stripe_customer_id_idx` ON `attendees` (`stripe_customer_id`);--> statement-breakpoint
CREATE INDEX `attendees_cash_transaction_idx` ON `attendees` (`cash_transaction_id`);--> statement-breakpoint
CREATE INDEX `attendees_updated_at_idx` ON `attendees` (`updated_at`);--> statement-breakpoint
CREATE INDEX `attendees_created_at_idx` ON `attendees` (`created_at`);--> statement-breakpoint
CREATE TABLE `breakfast_tickets` (
	`id` integer PRIMARY KEY NOT NULL,
	`source_key` text NOT NULL,
	`ticket_code` text NOT NULL,
	`breakfast_day` text NOT NULL,
	`status` text DEFAULT 'valid' NOT NULL,
	`unit_price_cents` numeric DEFAULT 2500 NOT NULL,
	`purchaser_name` text NOT NULL,
	`purchaser_email` text NOT NULL,
	`attendee_id` integer,
	`payment_source` text NOT NULL,
	`payment_status` text NOT NULL,
	`data_origin` text NOT NULL,
	`purchased_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`stripe_checkout_session_id` text,
	`stripe_payment_intent_id` text,
	`stripe_charge_id` text,
	`stripe_customer_id` text,
	`cash_transaction_id` integer,
	`raw_metadata` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`attendee_id`) REFERENCES `attendees`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`cash_transaction_id`) REFERENCES `cash_transactions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `breakfast_tickets_source_key_idx` ON `breakfast_tickets` (`source_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `breakfast_tickets_ticket_code_idx` ON `breakfast_tickets` (`ticket_code`);--> statement-breakpoint
CREATE INDEX `breakfast_tickets_breakfast_day_idx` ON `breakfast_tickets` (`breakfast_day`);--> statement-breakpoint
CREATE INDEX `breakfast_tickets_purchaser_email_idx` ON `breakfast_tickets` (`purchaser_email`);--> statement-breakpoint
CREATE INDEX `breakfast_tickets_attendee_idx` ON `breakfast_tickets` (`attendee_id`);--> statement-breakpoint
CREATE INDEX `breakfast_tickets_purchased_at_idx` ON `breakfast_tickets` (`purchased_at`);--> statement-breakpoint
CREATE INDEX `breakfast_tickets_stripe_checkout_session_id_idx` ON `breakfast_tickets` (`stripe_checkout_session_id`);--> statement-breakpoint
CREATE INDEX `breakfast_tickets_stripe_payment_intent_id_idx` ON `breakfast_tickets` (`stripe_payment_intent_id`);--> statement-breakpoint
CREATE INDEX `breakfast_tickets_stripe_charge_id_idx` ON `breakfast_tickets` (`stripe_charge_id`);--> statement-breakpoint
CREATE INDEX `breakfast_tickets_stripe_customer_id_idx` ON `breakfast_tickets` (`stripe_customer_id`);--> statement-breakpoint
CREATE INDEX `breakfast_tickets_cash_transaction_idx` ON `breakfast_tickets` (`cash_transaction_id`);--> statement-breakpoint
CREATE INDEX `breakfast_tickets_updated_at_idx` ON `breakfast_tickets` (`updated_at`);--> statement-breakpoint
CREATE INDEX `breakfast_tickets_created_at_idx` ON `breakfast_tickets` (`created_at`);--> statement-breakpoint
ALTER TABLE `payload_locked_documents_rels` ADD `attendees_id` integer REFERENCES attendees(id);--> statement-breakpoint
ALTER TABLE `payload_locked_documents_rels` ADD `breakfast_tickets_id` integer REFERENCES breakfast_tickets(id);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_attendees_id_idx` ON `payload_locked_documents_rels` (`attendees_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_breakfast_tickets_id_idx` ON `payload_locked_documents_rels` (`breakfast_tickets_id`);