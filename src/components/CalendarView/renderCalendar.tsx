"use client"

import { Calendar } from "./calendar";
import {today, getLocalTimeZone} from '@internationalized/date'
export function RenderCalendar() {
    return <Calendar minValue={today(getLocalTimeZone())}/>
}