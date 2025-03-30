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
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { Button } from "../ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isSameDay } from "date-fns";
import {
  deleteSpecificEvents,
  getSpecificEvents,
  updateEvents,
} from "@/actions/eventActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import { InsertEvent } from "@/db/schema";
import { DialogClose } from "@radix-ui/react-dialog";
import * as RadioGroup from "@radix-ui/react-radio-group";

// ==================== Types ====================
type CalendarEvent = {
  date: string;
  color: string;
};

type EventDetails = InsertEvent & {
  id: number;
};

// ==================== Components ====================
const DayPickerComponents = {
  DayButton: (props: any) => (
    <Button
      {...props}
      variant="ghost"
      className="lg:w-15 w-11 h-11 lg:h-15 px-3 py-3 sm:gap-0 text-accent-foreground group-aria-selected:bg-accent rounded-sm"
    />
  ),
  Chevron: ({ className, orientation, ...props }: any) => {
    const Icon =
      orientation === "left"
        ? ChevronLeft
        : orientation === "right"
        ? ChevronRight
        : ChevronDown;
    return <Icon className={`${className} w-6 h-6`} {...props} />;
  },
};

const ConfirmationRadioGroup = ({
  control,
  errors,
}: {
  control: any;
  errors: any;
}) => (
  <Controller
    name="confirmation"
    control={control}
    rules={{ required: "Événement confirmé ?" }}
    render={({ field }) => (
      <RadioGroup.Root
        onValueChange={field.onChange}
        value={field.value}
        className="col-span-3 my-2"
      >
        <div className="bg-gray-200 justify-center w-[280px] mt-6 h-9 p-1 rounded-2xl flex">
          {["Miritsoka", "Confirmé", "Non confirmé"].map((option) => (
            <RadioGroup.Item
              key={option}
              value={option}
              className={`font-semibold data-[state=checked]:ring-[1px] w-[90px] ring-border rounded-2xl pb-1 items-center px-1 ${
                option === "Miritsoka"
                  ? "data-[state=checked]:bg-amber-700 data-[state=checked]:ring-orange-600"
                  : option === "Confirmé"
                  ? "data-[state=checked]:bg-green-400 data-[state=checked]:ring-green-500"
                  : "data-[state=checked]:bg-red-600 data-[state=checked]:ring-red-700"
              } data-[state=checked]:text-primary-foreground`}
            >
              <span className="text-[13px]">{option}</span>
            </RadioGroup.Item>
          ))}
        </div>
      </RadioGroup.Root>
    )}
  />
);

// ==================== Main Component ====================
export function CustomCalendar() {
  // State management
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [events, setEvents] = useState<Date[]>([]);
  const [brownCells, setBrownCells] = useState<Date[]>([]);
  const [greenCells, setGreenCells] = useState<Date[]>([]);
  const [redCells, setRedCells] = useState<Date[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<EventDetails[]>([]);
  const [currentEvent, setCurrentEvent] = useState<EventDetails | null>(null);

  // Dialog states
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Form handling
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventDetails>();

  // Date utilities
  const today = useMemo(() => new Date(), []);
  const startYear = useMemo(() => new Date(), []);

  // Data fetching
  const fetchCalendarData = useCallback(async () => {
    try {
      const response = await fetch("/api/calendar");
      const data: CalendarEvent[] = await response.json();

      const dates = data.map((item) => new Date(item.date));
      setEvents(dates);

      setBrownCells(
        data
          .filter((item) => item.color === "Miritsoka")
          .map((item) => new Date(item.date))
      );
      setGreenCells(
        data
          .filter((item) => item.color === "Confirmé")
          .map((item) => new Date(item.date))
      );
      setRedCells(
        data
          .filter((item) => item.color === "Non confirmé")
          .map((item) => new Date(item.date))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // Event handlers
  const handleDayClick = useCallback(
    async (date: Date) => {
      const found = events.find((d) => isSameDay(d, date));
      setSelectedDate(date);

      if (found) {
        const details = await getSpecificEvents(found);
        setSelectedEvents(Array.isArray(details) ? details : [details]);
        setIsListDialogOpen(true);
      }
    },
    [events]
  );

  const handleEventDetails = useCallback((event: EventDetails) => {
    setCurrentEvent(event);
    reset(event);
    setIsListDialogOpen(false);
    setIsDetailDialogOpen(true);
  }, [reset]);

  const handleDeleteEvent = useCallback(
    async (id: number) => {
      await deleteSpecificEvents(id);
      setIsListDialogOpen(false);
      fetchCalendarData();
    },
    [fetchCalendarData]
  );

  const handleFormSubmit = useCallback(
    async (data: EventDetails) => {
      await updateEvents(data);
      setIsDetailDialogOpen(false);
      fetchCalendarData();
    },
    [fetchCalendarData]
  );

  // Initial data load
  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  return (
    <div className="flex flex-col">
      {/* Calendar View */}
      <DayPicker
        mode="single"
        locale={fr}
        selected={selectedDate}
        onDayClick={handleDayClick}
        modifiers={{ brownCells, greenCells, redCells }}
        modifiersClassNames={{
          brownCells: "brown-marker",
          greenCells: "green-marker",
          redCells: "red-marker",
        }}
        disabled={[{ before: today }]}
        startMonth={startYear}
        classNames={{
          month: "capitalize font-semibold",
          selected: "text-white",
          root: `${
            getDefaultClassNames().root
          } shadow-none border rounded-sm p-5`,
          day: "group rounded-sm",
          caption_label: "text-base",
        }}
        components={DayPickerComponents}
      />

      {/* Events List Dialog */}
      <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Event{selectedEvents.length !== 1 ? "s" : ""} prevu le{" "}
              {selectedDate?.toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedEvents.map((event) => (
              <div key={event.id} className="border-b pb-4 last:border-b-0">
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
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => handleEventDetails(event)}
                        >
                          <Edit className="mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="mr-2 stroke-red-600" />
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

      {/* Event Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Details</DialogTitle>
          </DialogHeader>
          {currentEvent && (
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="gap-x-6 gap-y-4 sm:grid-cols-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p>{currentEvent.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lieux</p>
                    <p>{currentEvent.place}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input
                      defaultValue={currentEvent.date}
                      type="date"
                      className="col-span-3 text-muted-foreground"
                      id="date"
                      min={today.toISOString().split("T")[0]}
                      {...register("date", {
                        required: "Le champ date est requis",
                      })}
                    />
                    {errors.date && (
                      <span className="col-span-4 text-sm text-red-500">
                        {errors.date.message}
                      </span>
                    )}
                  </div>
                </div>

                <ConfirmationRadioGroup control={control} errors={errors} />
              </div>

              <DialogFooter className="gap-5 mt-4 justify-end flex flex-row">
                <DialogClose asChild>
                  <Button variant="secondary">Annuler</Button>
                </DialogClose>
                <Button type="submit">Sauvegarder</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
