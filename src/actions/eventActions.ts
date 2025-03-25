"use server";

import { db } from "@/db/drizzle";
import { events, InsertEvent } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const getEvents = async () => {
  const data = await db.select().from(events);
  return data
  console.log(data);
};
export const addEvents = async (data:InsertEvent
) => {
  await db.insert(events).values({
    client: data.client,
    place: data.place,
    date: data.date,
    travel: data.travel,
    materials: data.materials,
    observation: data.observation,
    focal: data.focal,
  });
  revalidatePath('/')
};

// export const addEvents = async (
//     id: Number,
//     client: String,
//     place: String,
//     date: Date,
//     travel: Number,
//     materials: String,
//     observation: String,
//     focal: String,
// ) =>{
//     const data = await db.insert(events).values({
//         id: id,
//         client: client,
//         place: place,
//         date: date,
//         travel: travel,
//         materials: materials,
//         observation: observation,
//         focal: focal,
//     })
//     return data
// }
