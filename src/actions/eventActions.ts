"use server";

import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { events, InsertEvent } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const getEvents = async () => {
  return await db.select().from(events);
};

export const addEvents = async (data: InsertEvent) => {
  await db.insert(events).values({
    client: data.client,
    place: data.place,
    date: data.date,
    travel: data.travel,
    materials: data.materials,
    observation: data.observation,
    focal: data.focal,
    confirmation: data.confirmation,
  });
  revalidatePath("/");
};

export const getSpecificEvents = async (date: Date) => {
  return await db
    .select()
    .from(events)
    .where(eq(events.date, date.toISOString().split("T")[0]));
};

export const deleteSpecificEvents = async (event:number) => {
  await db.delete(events).where(eq(events.id, event));
}