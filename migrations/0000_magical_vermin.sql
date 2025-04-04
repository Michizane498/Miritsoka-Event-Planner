CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"client" varchar(255) NOT NULL,
	"eventname" varchar(255) NOT NULL,
	"bon_de_commande" text,
	"bon_de_sortie" text,
	"place" varchar(255) NOT NULL,
	"date" text NOT NULL,
	"travel" integer DEFAULT 0,
	"materials" text NOT NULL,
	"focal" text NOT NULL,
	"confirmation" text NOT NULL
);
