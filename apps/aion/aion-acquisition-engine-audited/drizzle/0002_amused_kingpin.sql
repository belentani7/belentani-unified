ALTER TABLE `leads` ADD `consentAt` timestamp;--> statement-breakpoint
ALTER TABLE `leads` ADD `consentSource` varchar(120);--> statement-breakpoint
ALTER TABLE `niches` ADD `publicKey` varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE `niches` ADD CONSTRAINT `niches_publicKey_unique` UNIQUE(`publicKey`);