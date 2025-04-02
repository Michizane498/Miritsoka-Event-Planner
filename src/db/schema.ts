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
  bon: text("bon"),
  place: varchar("place", { length: 255 }).notNull(),
  date: text("date").notNull(),
  travel: integer("travel").default(0),
  materials: text("materials").notNull(),
  observation: text("observation"),
  focal: text("focal").notNull(),
  confirmation: text("confirmation").notNull(),
});

export type InsertEvent = typeof events.$inferInsert;