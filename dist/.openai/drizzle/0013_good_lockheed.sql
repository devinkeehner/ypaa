PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_attendees` (
	`id` integer PRIMARY KEY NOT NULL,
	`source_key` text NOT NULL,
	`attendee_name` text NOT NULL,
	`attendee_email` text NOT NULL,
	`state` text NOT NULL,
	`homegroup_committee` text,
	`attendance_status` text DEFAULT 'expected' NOT NULL,
	`attendance_basis` text DEFAULT 'manual_expected' NOT NULL,
	`accommodations` text,
	`interpretation_needed` integer DEFAULT false,
	`mobility_accessibility` integer DEFAULT false,
	`willing_to_serve` integer DEFAULT false,
	`purchaser_name` text NOT NULL,
	`purchaser_email` text NOT NULL,
	`registration_price_cents` numeric DEFAULT 0 NOT NULL,
	`payment_source` text DEFAULT 'manual' NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`data_origin` text DEFAULT 'manual' NOT NULL,
	`purchased_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`stripe_checkout_session_id` text,
	`stripe_payment_intent_id` text,
	`stripe_charge_id` text,
	`stripe_customer_id` text,
	`cash_transaction_id` integer,
	`policy_acknowledgments_status` text DEFAULT 'pending' NOT NULL,
	`policy_acknowledgments_signature_name` text,
	`policy_acknowledgments_signed_at` text,
	`policy_acknowledgments_read_policy` integer DEFAULT false,
	`policy_acknowledgments_understand_questions` integer DEFAULT false,
	`policy_acknowledgments_acknowledge_behavior` integer DEFAULT false,
	`policy_acknowledgments_understand_admission` integer DEFAULT false,
	`policy_acknowledgments_understand_reporting` integer DEFAULT false,
	`policy_acknowledgments_understand_investigation` integer DEFAULT false,
	`policy_acknowledgments_signature_agreement` integer DEFAULT false,
	`notes` text,
	`raw_metadata` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`cash_transaction_id`) REFERENCES `cash_transactions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_attendees`("id", "source_key", "attendee_name", "attendee_email", "state", "homegroup_committee", "attendance_status", "attendance_basis", "accommodations", "interpretation_needed", "mobility_accessibility", "willing_to_serve", "purchaser_name", "purchaser_email", "registration_price_cents", "payment_source", "payment_status", "data_origin", "purchased_at", "stripe_checkout_session_id", "stripe_payment_intent_id", "stripe_charge_id", "stripe_customer_id", "cash_transaction_id", "policy_acknowledgments_status", "policy_acknowledgments_signature_name", "policy_acknowledgments_signed_at", "policy_acknowledgments_read_policy", "policy_acknowledgments_understand_questions", "policy_acknowledgments_acknowledge_behavior", "policy_acknowledgments_understand_admission", "policy_acknowledgments_understand_reporting", "policy_acknowledgments_understand_investigation", "policy_acknowledgments_signature_agreement", "notes", "raw_metadata", "updated_at", "created_at") SELECT "id", "source_key", "attendee_name", "attendee_email", "state", "homegroup_committee", 'expected', 'self_registration', "accommodations", "interpretation_needed", "mobility_accessibility", "willing_to_serve", "purchaser_name", "purchaser_email", "registration_price_cents", "payment_source", "payment_status", "data_origin", "purchased_at", "stripe_checkout_session_id", "stripe_payment_intent_id", "stripe_charge_id", "stripe_customer_id", "cash_transaction_id", CASE WHEN "policy_acknowledgments_signature_agreement" = 1 THEN 'signed' ELSE 'pending' END, CASE WHEN "policy_acknowledgments_signature_agreement" = 1 THEN "attendee_name" ELSE NULL END, CASE WHEN "policy_acknowledgments_signature_agreement" = 1 THEN "purchased_at" ELSE NULL END, "policy_acknowledgments_read_policy", "policy_acknowledgments_understand_questions", "policy_acknowledgments_acknowledge_behavior", "policy_acknowledgments_understand_admission", "policy_acknowledgments_understand_reporting", "policy_acknowledgments_understand_investigation", "policy_acknowledgments_signature_agreement", NULL, "raw_metadata", "updated_at", "created_at" FROM `attendees`;--> statement-breakpoint
DROP TABLE `attendees`;--> statement-breakpoint
ALTER TABLE `__new_attendees` RENAME TO `attendees`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `attendees_source_key_idx` ON `attendees` (`source_key`);--> statement-breakpoint
CREATE INDEX `attendees_attendee_name_idx` ON `attendees` (`attendee_name`);--> statement-breakpoint
CREATE INDEX `attendees_attendee_email_idx` ON `attendees` (`attendee_email`);--> statement-breakpoint
CREATE INDEX `attendees_attendance_status_idx` ON `attendees` (`attendance_status`);--> statement-breakpoint
CREATE INDEX `attendees_purchaser_email_idx` ON `attendees` (`purchaser_email`);--> statement-breakpoint
CREATE INDEX `attendees_purchased_at_idx` ON `attendees` (`purchased_at`);--> statement-breakpoint
CREATE INDEX `attendees_stripe_checkout_session_id_idx` ON `attendees` (`stripe_checkout_session_id`);--> statement-breakpoint
CREATE INDEX `attendees_stripe_payment_intent_id_idx` ON `attendees` (`stripe_payment_intent_id`);--> statement-breakpoint
CREATE INDEX `attendees_stripe_charge_id_idx` ON `attendees` (`stripe_charge_id`);--> statement-breakpoint
CREATE INDEX `attendees_stripe_customer_id_idx` ON `attendees` (`stripe_customer_id`);--> statement-breakpoint
CREATE INDEX `attendees_cash_transaction_idx` ON `attendees` (`cash_transaction_id`);--> statement-breakpoint
CREATE INDEX `attendees_updated_at_idx` ON `attendees` (`updated_at`);--> statement-breakpoint
CREATE INDEX `attendees_created_at_idx` ON `attendees` (`created_at`);
