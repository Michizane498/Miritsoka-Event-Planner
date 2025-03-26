"use server"

import { getEvents } from "./eventActions";

export default async function dateMark() {
  const data = await getEvents();
  const markedDate = data.map((event) => event.date);
  
  return markedDate;
}