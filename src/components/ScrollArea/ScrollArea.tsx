import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getEvents } from "@/actions/eventActions"

export async function MyScrollArea() {
  const data = await getEvents()
  return (
    <ScrollArea className="h-50 lg:h-[770px] rounded-xl border">
      <div className="p-4">
        <h2 className="mb-4 text-sm font-semibold leading-none">Evenements</h2>
        {data.map((tag) => (
          <>
          <div className="grid grid-cols-3">
            <div className="text-sm col-span-1">
              {tag.place}
            </div>
            <div className="text-sm col-end-4 text-right">
              {tag.date}
            </div>
          </div>
            <div className="text-sm">
              Materiels: {tag.materials}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}
