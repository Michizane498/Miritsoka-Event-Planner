"use client";

import { fr } from "date-fns/locale";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
} from "lucide-react";
import * as React from "react";

import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";


export function CustomCalendar() {


  const [selected, setSelected] = React.useState<Date | undefined>(undefined);

  /* Today's date */
  const today = new Date();

  /* Calculate the date 20 days from today */
  const twentyDaysFromNow = new Date();
  twentyDaysFromNow.setDate(today.getDate() + 20);

  /* Years Start from */
  const startYear = new Date();

  interface CalendarEvent {
    date: string;    // ISO date string (e.g., "2025-03-28")
    color: string;   // e.g., "brown"
  }

  const brownCells = [new Date(2025, 2, 28),new Date(2025, 2, 31)];
  const greenCells = [new Date(2025, 2, 29)];
  const redCells = [new Date(2025, 2, 30)];

  const [allbrownCells, setBrownCells] = useState<Date[]>([]);
  const [allgreenCells, setGreenCells] = useState<Date[]>([]);
  const [allredCells, setRedCells] = useState<Date[]>([]);

  const handleDayClick = (day: Date | undefined) => {
    setSelected(day);
};

    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch('/api/calendar');
          const data = await response.json() as CalendarEvent[];
          
          const brown = data
            .filter((item: any) => item.color === 'Miritsoka')
            .map((item: any) => new Date(item.date));
          setBrownCells(Object.assign(brown));

          const green = data
            .filter((item: any) => item.color === 'Confirmé')
            .map((item: any) => new Date(item.date));
          setGreenCells(Object.assign(green));

          const red = data
            .filter((item: any) => item.color === 'Non confirmé')
            .map((item: any) => new Date(item.date));
          setRedCells(Object.assign(red));          
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
  
      fetchData();
      
    }, []);


  return (
    <div className="flex flex-col">
      <DayPicker
        mode="single"
        locale={fr}
        selected={selected}
        onDayClick={handleDayClick}
        modifiers={{
          brownCells: allbrownCells,
          greenCells: allgreenCells,
          redCells: allredCells,
        }}
        modifiersClassNames={{
          brownCells: "brown-marker",
          greenCells: "green-marker",
          redCells: "red-marker",
        }}
        disabled={[{ before: today }]}
        startMonth={startYear}
        classNames={{
          month:`capitalize font-semibold`,
          selected: `text-white`,
          root: `${
            getDefaultClassNames().root
          } shadow-none border rounded-sm p-5`,
          day: `group rounded-sm`,
          caption_label: `text-base`,
        }}
        components={{
          /* Custom Button */
          DayButton: (props) => {
            const { day, ...buttonProps } = props;
            return (
              <Button
              variant={"ghost"}
                {...buttonProps}
                className="lg:w-15 w-10 h-10 lg:h-15 px-3 py-3 sm:gap-0 text-accent-foreground group-aria-selected:bg-orange-700 rounded-sm"
                onClick={() => setSelected(day.date)}
              />
            );
          },
          /* Custom Chevron Icon */
          Chevron: ({ className, orientation, ...chevronProps }) => {
            switch (orientation) {
              case "left":
                return (
                  <ChevronLeft
                    className={`${className} w-4 h-4`}
                    {...chevronProps}
                  />
                );
              case "right":
                return (
                  <ChevronRight
                    className={`${className} w-4 h-4`}
                    {...chevronProps}
                  />
                );
              case "down":
                return (
                  <ChevronDown
                    className={`${className} w-4 h-4`}
                    {...chevronProps}
                  />
                );
              case "up":
                return (
                  <ChevronDown
                    className={`${className} w-4 h-4`}
                    {...chevronProps}
                  />
                );
              default:
                return <Circle className={`${className} w-4 h-4`} />;
            }
          },
        }}
      />
    </div>
  );
}
