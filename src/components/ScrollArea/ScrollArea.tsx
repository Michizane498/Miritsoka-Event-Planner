import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getEvents } from "@/actions/eventActions";
import { Badge } from "../ui/badge";

export async function MyScrollArea() {
  const data = await getEvents();
  return (
    <ScrollArea className="h-50 lg:h-[770px] rounded-xl border">
      <div className="p-4">
        <h2 className="mb-4 text-sm font-semibold leading-none">Evenements a venir</h2>
        {data.map((tag) => (
          <div key={tag.id}>
            <div className="grid grid-cols-3">
              <div className="text-sm col-span-1">{tag.client}</div>
              <div className="text-sm col-end-4 text-right">{tag.date}</div>
            </div>
            <div className="mt-1.5 grid grid-cols-3">
              <div className="text-sm col-span-2">{tag.place}</div>
              <div className="text-sm col-end-4 text-right">
                <Badge
                  className={`rounded-full border-none text-white ${
                    tag.confirmation === "Miritsoka"
                      ? "bg-gradient-to-r from-rose-950 to-orange-900"
                      : tag.confirmation === "Confirmé"
                      ? "bg-gradient-to-r from-lime-300 to-green-600"
                      : "bg-gradient-to-r from-pink-700 to-red-600"
                  }`}
                >
                  {tag.confirmation}
                </Badge>
              </div>
            </div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
