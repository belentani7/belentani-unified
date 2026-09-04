CREATE TABLE `followUpRules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nicheId` int NOT NULL,
	`fromStage` enum('New','Contacted','Qualified','Proposal Sent','Follow-up','Won','Lost') NOT NULL,
	`delayHours` int NOT NULL,
	`templateId` int,
	`enabled` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `followUpRules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `followUpTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`nicheId` int NOT NULL,
	`ruleId` int,
	`scheduledFor` timestamp NOT NULL,
	`executedAt` timestamp,
	`status` enum('scheduled','sent','cancelled','failed') NOT NULL DEFAULT 'scheduled',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `followUpTasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nicheId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320),
	`phone` varchar(40),
	`serviceType` varchar(160),
	`source` varchar(120),
	`notes` text,
	`stage` enum('New','Contacted','Qualified','Proposal Sent','Follow-up','Won','Lost') NOT NULL DEFAULT 'New',
	`consentStatus` enum('unknown','granted','denied') NOT NULL DEFAULT 'unknown',
	`optOut` boolean NOT NULL DEFAULT false,
	`needsHumanReview` boolean NOT NULL DEFAULT false,
	`isHot` boolean NOT NULL DEFAULT false,
	`arrivedAt` timestamp NOT NULL DEFAULT (now()),
	`firstOutreachAt` timestamp,
	`wonAt` timestamp,
	`lostAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messageTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nicheId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`stage` enum('New','Contacted','Qualified','Proposal Sent','Follow-up','Won','Lost') NOT NULL,
	`channel` enum('email','sms','whatsapp') NOT NULL DEFAULT 'email',
	`subject` varchar(220),
	`body` text NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `messageTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nicheTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`description` text,
	`configJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nicheTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `niches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(140) NOT NULL,
	`description` text,
	`accent` varchar(32) NOT NULL DEFAULT 'violet',
	`isActive` boolean NOT NULL DEFAULT true,
	`scheduleCronTaskUid` varchar(65),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `niches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`nicheId` int,
	`leadId` int,
	`type` enum('hot_lead','follow_up_due','human_review') NOT NULL,
	`title` varchar(180) NOT NULL,
	`body` text NOT NULL,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `follow_up_rules_niche_idx` ON `followUpRules` (`nicheId`);--> statement-breakpoint
CREATE INDEX `follow_up_tasks_due_idx` ON `followUpTasks` (`status`,`scheduledFor`);--> statement-breakpoint
CREATE INDEX `follow_up_tasks_lead_idx` ON `followUpTasks` (`leadId`);--> statement-breakpoint
CREATE INDEX `leads_niche_stage_idx` ON `leads` (`nicheId`,`stage`);--> statement-breakpoint
CREATE INDEX `leads_niche_created_idx` ON `leads` (`nicheId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `message_templates_niche_idx` ON `messageTemplates` (`nicheId`);--> statement-breakpoint
CREATE INDEX `niche_templates_owner_idx` ON `nicheTemplates` (`ownerId`);--> statement-breakpoint
CREATE INDEX `niches_owner_idx` ON `niches` (`ownerId`);--> statement-breakpoint
CREATE INDEX `notifications_owner_idx` ON `notifications` (`ownerId`,`readAt`);