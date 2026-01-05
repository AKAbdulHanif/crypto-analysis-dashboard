CREATE TABLE `daily_price_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL DEFAULT (now()),
	`symbol` varchar(20) NOT NULL,
	`price` double NOT NULL,
	`price_change_24h` double,
	`volume_24h` double,
	`market_cap` double,
	`btc_dominance` double,
	`total3_market_cap` double,
	`altcoin_season_index` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_price_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_recommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL DEFAULT (now()),
	`symbol` varchar(20) NOT NULL,
	`action` varchar(20) NOT NULL,
	`conviction` varchar(20) NOT NULL,
	`allocation` double,
	`entry_zone_min` double,
	`entry_zone_max` double,
	`stop_loss` double,
	`take_profit_1` double,
	`take_profit_2` double,
	`take_profit_3` double,
	`predicted_price_change` double,
	`prediction_timeframe` varchar(10),
	`reasoning` text,
	`technical_signals` text,
	`actual_price_change` double,
	`prediction_accurate` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_recommendations_id` PRIMARY KEY(`id`)
);
