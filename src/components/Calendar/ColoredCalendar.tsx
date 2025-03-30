"use client";

import { fr } from "date-fns/locale";
import { ChevronDown, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import * as React from "react";

import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { isSameDay } from "date-fns";
import { getSpecificEvents } from "@/actions/eventActions";

export function CustomCalendar() {
  const [selected, setSelected] = React.useState<Date>(new Date());

  const [allbrownCells, setBrownCells] = useState<Date[]>([]);
  const [allgreenCells, setGreenCells] = useState<Date[]>([]);
  const [allredCells, setRedCells] = useState<Date[]>([]);
  const [data, setData] = useState<Date[]>([]);

  const today = new Date();

  // 20 days from today
  const twentyDaysFromNow = new Date();
  twentyDaysFromNow.setDate(today.getDate() + 20);

  // Years Start
  const startYear = new Date();

  interface CalendarEvent {
    date: string;
    color: string;
  }

  const handledayclick = async (date: Date) => {
    setSelected(date);
    const found = data.find((d) => isSameDay(d, date!));
    if (found) {
      const details = await getSpecificEvents(found);
      // console.log("Selected date:", date, "Found:", found, "le izy", leizy);
    } else {
      return;
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/calendar");
        const data = (await response.json()) as CalendarEvent[];
        const select = data.map((item: any) => new Date(item.date));
        setData(select);

        const brown = data
          .filter((item: any) => item.color === "Miritsoka")
          .map((item: any) => new Date(item.date));
        setBrownCells(brown);

        const green = data
          .filter((item: any) => item.color === "Confirmé")
          .map((item: any) => new Date(item.date));
        setGreenCells(green);

        const red = data
          .filter((item: any) => item.color === "Non confirmé")
          .map((item: any) => new Date(item.date));
        setRedCells(red);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <DayPicker
        required={true}
        mode="single"
        locale={fr}
        onDayClick={handledayclick}
        // onSelect={setSelected}
        selected={selected}
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
          month: `capitalize font-semibold`,
          selected: `text-white`,
          root: `${
            getDefaultClassNames().root
          } shadow-none border rounded-sm p-5`,
          day: `group rounded-sm`,
          caption_label: `text-base`,
        }}
        components={{
          DayButton: (props) => {
            const { day, ...buttonProps } = props;
            return (
              <Button
                {...buttonProps}
                variant={"ghost"}
                className="lg:w-15 w-10 h-10 lg:h-15 px-3 py-3 sm:gap-0 text-accent-foreground group-aria-selected:bg-accent rounded-sm"
              />
            );
          },

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
