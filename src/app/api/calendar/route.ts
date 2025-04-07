"use server"
import { db } from "@/db/drizzle";
import { events } from '@/db/schema';
import { asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
  const data = await db
    .select()
    .from(events)
    .orderBy(asc(events.date));

    revalidatePath("/")
  return Response.json(data);
}