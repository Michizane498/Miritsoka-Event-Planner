import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { EventDialog } from "@/form/dialog";
import { MyScrollArea } from "@/components/ScrollArea/ScrollArea";
import { CustomCalendar } from "@/components/Calendar/ColoredCalendar";
import { ModeToggle } from "@/components/Themetoggle/Themetogglebutton";

export default function page() {
  return (
    <div className="min-h-screen w-full overflow-auto">
      <div className="container mx-auto grid min-h-screen w-full grid-cols-1 gap-4 px-4 py-8 lg:grid-cols-3 lg:px-8 lg:py-12">
        {/* Main Calendar Section */}
        <div className="lg:col-span-2">
          <Card className="h-full w-full shadow-none">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 items-center gap-4">
                <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:max-w-[17ch] md:text-5xl lg:text-[2.75rem] xl:text-5xl">
                  Miritsoka Event Planner
                </h1>
                <div className="flex justify-end">
                  <ModeToggle />
                </div>
              </div>
              <div className="py-4 md:py-6">
                <CustomCalendar />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Sidebar */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:py-8">
          <div className="grid h-full gap-4">
            <EventDialog />
            <MyScrollArea />
          </div>
        </div>
      </div>
    </div>
  );
}