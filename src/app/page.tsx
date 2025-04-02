import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { EventDialog } from "@/form/dialog";
import { MyScrollArea } from "@/components/ScrollArea/ScrollArea";
import { CustomCalendar } from "@/components/Calendar/ColoredCalendar";
import { ModeToggle } from "@/components/Themetoggle/Themetogglebutton";
export default function page() {
  return (
    <div className="max-h-screen flex items-center justify-center overflow-hidden">
      <div className=" min-h-screen max-w-screen-xl w-full mx-auto grid lg:grid-cols-3 lg:mt-10 gap-8 px-6 py-12 lg:py-0">
        <div className="w-full lg:col-span-2 lg:aspect-auto lg:w-[850px] lg:h-[calc(100vh-4rem)] bg-accent rounded-xl">
          <Card className="relative h-full max-w-[1400px] w-full items-center wx-auto shadow-none">
            <CardContent>
              <div className="lg:mx-4 grid grid-cols-2">
                <h1 className="mt-6 max-w-[17ch] text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2] tracking-tight">
                  Miritsoka Event Planner
                </h1>
                <span className="place-self-end">
                  <ModeToggle />
                </span>
              </div>
              <div className="flex-1/2 py-4 items-center ">
                <CustomCalendar />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="my-3 sm:py-10">
          <div className="grid px-3 mx-3 gap-3">
            {/* Event list */}
            <EventDialog />
            <MyScrollArea />
          </div>
        </div>
      </div>
    </div>
  );
}
