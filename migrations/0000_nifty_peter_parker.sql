CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"client" varchar(255) NOT NULL,
	"numero_bon_de_commande" varchar(255),
	"place" varchar(255) NOT NULL,
	"date" text NOT NULL,
	"travel" integer DEFAULT 0,
	"materials" text NOT NULL,
	"observation" text,
	"focal" text NOT NULL,
	"confirmation" text NOT NULL
);
