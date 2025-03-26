"use client";

import { fr } from "date-fns/locale";
import { ChevronDown, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import * as React from "react";

import { DayPicker, getDefaultClassNames } from "react-day-picker";

export function CustomCalendar() {

  const [selected, setSelected] = React.useState<Date | undefined>(undefined);

  /* Today's date */
  const today = new Date();

  /* Calculate the date 20 days from today */
  const twentyDaysFromNow = new Date();
  twentyDaysFromNow.setDate(today.getDate() + 20);

  /* Years Start from */
  const startYear = new Date();


  const handleDayClick = (day: Date | undefined) => {
    setSelected(day);
  };
  return (
    <div className="flex flex-col items-center justify-center">
    <DayPicker 
      mode="single"
      locale={fr}
      selected={selected}
      onDayClick={handleDayClick}
      disabled={[
        { before: today },
      ]}
      startMonth={startYear}
      classNames={{
        selected: `text-white`,
        root: `${getDefaultClassNames().root} shadow-lg p-5`,
        day: `group  w-10 h-10 rounded-sm ${getDefaultClassNames().day}`,
        caption_label: `text-base`,
      }}
      components={{
        /* Custom Button */
        DayButton: (props) => {
          const { day, ...buttonProps } = props;
          return (
            <button
              {...buttonProps}
              className="bg-zinc-100 w-12 h-12 m-1 group-aria-selected:bg-orange-700 rounded-sm"
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
              return (
                <Circle className={`${className} w-4 h-4`} />
              );
          }
        },
      }}
    />
  </div>
  );
}
