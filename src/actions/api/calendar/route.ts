"use server"

import { db } from "@/db/drizzle";
import { events } from '@/db/schema';
import { asc } from "drizzle-orm";

export async function GET() {
  const data = await db
    .select({ date: events.date, color: events.confirmation })
    .from(events)
    .orderBy(asc(events.date));
    console.log(data);

  return Response.json(data);
}