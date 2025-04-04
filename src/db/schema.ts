import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  client: varchar("client", { length: 255 }).notNull(),
  eventname: varchar("eventname", { length: 255 }).notNull(),
  boncommande: text("bon_de_commande"),
  bonsortie: text("bon_de_sortie"),
  place: varchar("place", { length: 255 }).notNull(),
  date: text("date").notNull(),
  travel: integer("travel").default(0),
  materials: text("materials").notNull(),
  focal: text("focal").notNull(),
  confirmation: text("confirmation").notNull(),
});


export type InsertEvent = typeof events.$inferInsert;