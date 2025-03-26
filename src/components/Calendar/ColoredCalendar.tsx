"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "../ui/button"
import { DayPicker } from "react-day-picker"

export function CustomCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
<DayPicker
  captionLayout="dropdown"
  defaultMonth={new Date(2024, 6)}
  
/>
  )
}
