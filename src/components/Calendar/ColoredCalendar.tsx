"use client";

import { fr } from "date-fns/locale";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Edit,
  Ellipsis,
  Trash2,
} from "lucide-react";
import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { isSameDay } from "date-fns";
import { deleteSpecificEvents, getSpecificEvents } from "@/actions/eventActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function CustomCalendar() {
  const [selected, setSelected] = useState<Date>(new Date());
  const [islistDialogOpen, setIslistDialogOpen] = useState(false);
  const [isdetailDialogOpen, setIsdetailDialogOpen] = useState(false);
  const [allbrownCells, setBrownCells] = useState<Date[]>([]);
  const [allgreenCells, setGreenCells] = useState<Date[]>([]);
  const [allredCells, setRedCells] = useState<Date[]>([]);
  const [data, setData] = useState<Date[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Selected[]>([]);
  const [selectedEventForDetails, setSelectedEventForDetails] =
    useState<Selected | null>(null);

  const today = new Date();
  const twentyDaysFromNow = new Date();
  twentyDaysFromNow.setDate(today.getDate() + 20);
  const startYear = new Date();

  type Selected = {
    id: number;
    client: string;
    place: string;
    date: string;
    travel: number | null;
    materials: string;
    observation: string | null;
    focal: string;
    confirmation: string;
  };

  interface CalendarEvent {
    date: string;
    color: string;
  }

  const handledayclick = async (date: Date) => {
    const found = data.find((d) => isSameDay(d, date));
    setSelected(date);
    if (found) {
      const details = await getSpecificEvents(found);
      setIslistDialogOpen(true);
      const normalizedDetails = Array.isArray(details) ? details : [details];
      setSelectedEvent(normalizedDetails);
    }
  };
  
  function handledetails(event: Selected) {
    setSelectedEventForDetails(event);
    setIslistDialogOpen(false);
    setIsdetailDialogOpen(true);
  }
  async function handledelete(event: number) {
    await deleteSpecificEvents(event)
  }
  
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
                className="lg:w-15 w-11 h-11 lg:h-15 px-3 py-3 sm:gap-0 text-accent-foreground group-aria-selected:bg-accent rounded-sm"
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

      <Dialog open={islistDialogOpen} onOpenChange={setIslistDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Event{selectedEvent.length !== 1 ? "s" : ""} prevu le{" "}
              {selected?.toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription/>
          <div className="space-y-4">
            {selectedEvent.map((event, index) => (
              <div
                key={`${event.id}-${index}`}
                className="border-b pb-4 last:border-b-0"
              >
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p>{event.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p>{event.confirmation}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="place-self-end pb-1">
                        <Ellipsis className="size-5 lg:size-4 stroke-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => handledetails(event)}>
                          <Edit />
                          <span>Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handledelete(event.id)
                        }>
                          <Trash2 className="stroke-red-600"/>
                          <span className="text-red-600">Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isdetailDialogOpen} onOpenChange={setIsdetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Details</DialogTitle>
          </DialogHeader>
          <DialogDescription/>
          {selectedEventForDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p>{selectedEventForDetails.client}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Place</p>
                  <p>{selectedEventForDetails.place}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>
                    {new Date(
                      selectedEventForDetails.date
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p>{selectedEventForDetails.confirmation}</p>
                </div>
                {selectedEventForDetails.travel && (
                  <div>
                    <p className="text-sm text-muted-foreground">Travel</p>
                    <p>{selectedEventForDetails.travel}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Focal</p>
                  <p>{selectedEventForDetails.focal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Materials</p>
                  <p>{selectedEventForDetails.materials}</p>
                </div>
              </div>
              {selectedEventForDetails.observation && (
                <div>
                  <p className="text-sm text-muted-foreground">Observation</p>
                  <p>{selectedEventForDetails.observation}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
