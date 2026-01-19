CREATE TABLE `businesses` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`initial_capital` real DEFAULT 0,
	`current_asset_value` real DEFAULT 0,
	`cash_on_hand` real DEFAULT 0,
	`theme_color` text,
	`avatar_url` text,
	`data` text,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cashflow` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`date` integer NOT NULL,
	`revenue` real DEFAULT 0,
	`expense` real DEFAULT 0,
	`category` text DEFAULT 'OTHER',
	`note` text,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `credit_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`amount` integer NOT NULL,
	`description` text NOT NULL,
	`date` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`amount` integer NOT NULL,
	`status` text DEFAULT 'PENDING',
	`snap_token` text,
	`items` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `liabilities` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`name` text NOT NULL,
	`amount` real NOT NULL,
	`due_date` integer NOT NULL,
	`total_tenure` integer,
	`remaining_tenure` integer,
	`is_paid_this_month` integer DEFAULT false,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `platforms` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`default_commission` real NOT NULL,
	`default_fixed_fee` integer DEFAULT 0,
	`withdrawal_fee` integer DEFAULT 0,
	`color` text,
	`official_terms_url` text,
	`category` text NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`name` text NOT NULL,
	`label` text,
	`data` text NOT NULL,
	`is_favorite` integer DEFAULT false,
	`last_modified` integer NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `system_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`order_id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`payment_type` text,
	`transaction_status` text,
	`fraud_status` text,
	`raw_response` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `translations` (
	`key` text PRIMARY KEY NOT NULL,
	`umkm_label` text NOT NULL,
	`pro_label` text NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text,
	`role` text DEFAULT 'user',
	`referral_code` text,
	`referred_by` text,
	`affiliate_earnings` integer DEFAULT 0,
	`permissions` text DEFAULT '[]',
	`credits` integer DEFAULT 250,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_referral_code_unique` ON `users` (`referral_code`);