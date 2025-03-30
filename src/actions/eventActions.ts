"use server";

import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { events, InsertEvent } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const getEvents = async () => {
  return await db.select().from(events).orderBy(events.date);
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
  revalidatePath("/", "page");
};

export const getSpecificEvents = async (date: Date) => {
  revalidatePath("/");
  return await db
    .select()
    .from(events)
    .where(eq(events.date, date.toISOString().split("T")[0]));
};

export const deleteSpecificEvents = async (event: number) => {
  await db.delete(events).where(eq(events.id, event));
  revalidatePath("/");
};


export const updateEvents = async (data: {
  id: number;
  client: string;
  place: string;
  date: string;
  travel?: number | null;
  materials: string;
  observation?: string | null;
  focal: string;
  confirmation: string;
}) => {
  revalidatePath("/");
  
  await db
    .update(events)
    .set({
      client: data.client,
      place: data.place,
      date: data.date,
      travel: data.travel,
      materials: data.materials,
      observation: data.observation,
      focal: data.focal,
      confirmation: data.confirmation,
    })
    .where(eq(events.id, data.id));
};
