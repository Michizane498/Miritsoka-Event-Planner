CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"client" varchar(255) NOT NULL,
	"place" varchar(255) NOT NULL,
	"date" timestamp NOT NULL,
	"travel" integer DEFAULT 0,
	"materials" text NOT NULL,
	"observation" text,
	"focal" text NOT NULL
);
