"use server";

import { db } from "@/db/drizzle";
import { events, InsertEvent } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const getEvents = async () => {
  const data = await db.select().from(events);
  return data;
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
