"use client";

import { fr } from "date-fns/locale";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Ellipsis,
  Info,
  Trash2,
} from "lucide-react";
import {
  DayPicker,
  getDefaultClassNames,
  DayButtonProps,
  ChevronProps,
} from "react-day-picker";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Controller, useForm, Control, FieldErrors } from "react-hook-form";
import { InsertEvent } from "@/db/schema";
import { DialogClose } from "@radix-ui/react-dialog";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

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
  DayButton: (props: DayButtonProps) => (
    <Button
      {...props}
      variant="ghost"
      className="lg:w-20 w-8 h-8 lg:h-20 px-3 py-3 sm:gap-0 text-accent-foreground group-aria-selected:bg-accent rounded-[3px]"
    />
  ),
  Chevron: ({ className, orientation, ...props }: ChevronProps) => {
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
}: {
  control: Control<EventDetails>;
  errors: FieldErrors<EventDetails>;
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
        <div className="bg-primary-foreground justify-center w-[280px] mt-6 h-9 p-1 rounded-2xl flex">
          {["Miritsoka", "Confirmé", "Non confirmé"].map((option) => (
            <RadioGroup.Item
              key={option}
              value={option}
              className={`font-semibold data-[state=checked]:ring-[1px] w-[90px] ring-border rounded-2xl pb-1 items-center px-1 ${
                option === "Miritsoka"
                  ? "data-[state=checked]:bg-green-600 data-[state=checked]:ring-green-500"
                  : option === "Confirmé"
                  ? "data-[state=checked]:bg-blue-400 data-[state=checked]:ring-blue-500"
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
  const [blueCells, setBlueCells] = useState<Date[]>([]);
  const [greenCells, setGreenCells] = useState<Date[]>([]);
  const [redCells, setRedCells] = useState<Date[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<EventDetails[]>([]);
  const [currentEvent, setCurrentEvent] = useState<EventDetails | null>(null);
  const [selectedMatos, setSelectedMatos] = useState<string[]>([]);

  // Dialog states
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [deleteconfirmation, setDeleteconfirmation] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Form handling
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventDetails>({
    defaultValues: {
      id: 0,
      client: "",
      place: "",
      date: "",
      materials: "",
      focal: "",
      confirmation: "Miritsoka",
      travel: null,
      observation: null,
    },
  });

  const matos = [
    "Sonorisation",
    "Lumiere",
    "Estrade",
    "Ecran",
    "Regie",
    "Chapiteau",
    "Pagode",
    "Structure",
    "Table",
    "Chaise",
  ];

  // Date utilities
  const today = useMemo(() => new Date(), []);
  const startYear = useMemo(() => new Date(), []);

  // Data fetching
  const fetchCalendarData = useCallback(async () => {
    try {
      const response = await fetch("/api/calendar");
      const data: CalendarEvent[] = (await response.json()) as CalendarEvent[];

      const dates = data.map((item) => new Date(item.date));
      setEvents(dates);

      setGreenCells(
        data
          .filter((item) => item.color === "Miritsoka")
          .map((item) => new Date(item.date))
      );
      setBlueCells(
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

  const handleEventModifications = useCallback(
    (event: EventDetails) => {
      setCurrentEvent(event);
      reset(event);
      setIsListDialogOpen(false);
      setIsDetailDialogOpen(true);
    },
    [reset]
  );

  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedMatos([...selectedMatos, tag]);
    } else {
      setSelectedMatos(selectedMatos.filter((t) => t !== tag));
    }
  };

  const handleDeleteEvent = useCallback(
    async (id: number) => {
      await deleteSpecificEvents(id);
      setIsListDialogOpen(false);
      toast("L'evenement a été supprimé", {
        className: "font-bold",
      });
      fetchCalendarData();
    },
    [fetchCalendarData]
  );

  const handleFormSubmit = useCallback(
    async (data: EventDetails) => {
      await updateEvents(data);
      setIsDetailDialogOpen(false);
      toast("L'evenement a été modifié avec succes", {
        className: "font-bold",
      });
      fetchCalendarData();
    },
    [fetchCalendarData]
  );

  // Initial data load
  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* Calendar View */}
      <DayPicker
        mode="single"
        locale={fr}
        selected={selectedDate}
        onDayClick={handleDayClick}
        modifiers={{ blueCells, greenCells, redCells }}
        modifiersClassNames={{
          blueCells: "blue-marker",
          greenCells: "green-marker",
          redCells: "red-marker",
        }}
        disabled={[{ before: today }]}
        startMonth={startYear}
        classNames={{
          month: "capitalize font-semibold text-sm sm:text-base",
          selected: "text-white",
          root: `${
            getDefaultClassNames().root
          } shadow-none border rounded-sm p-2 sm:p-4 md:p-5 w-full`,
          day: "group rounded-sm text-xs sm:text-sm",
          caption_label: "text-sm sm:text-base",
        }}
        components={DayPickerComponents}
      />

      {/* Events List Dialog */}
      <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Event{selectedEvents.length !== 1 ? "s" : ""} prevu le{" "}
              {selectedDate?.toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto">
            {selectedEvents.map((event) => (
              <div
                key={event.id}
                className="border-b pb-3 sm:pb-4 last:border-b-0"
              >
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="truncate">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Client
                    </p>
                    <p className="truncate">{event.client}</p>
                  </div>
                  <div className="truncate">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Status
                    </p>
                    <p className="truncate">{event.confirmation}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="place-self-end">
                        <Ellipsis className="size-4 sm:size-5 stroke-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          // onClick={() => handleEventDetails(event)}
                        >
                          <Info className="mr-2 size-4" />
                          <span className="text-sm">Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEventModifications(event)}
                        >
                          <Edit className="mr-2 size-4" />
                          <span className="text-sm">Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteconfirmation(true)}
                        >
                          <Trash2 className="mr-2 size-4 stroke-red-600" />
                          <span className="text-sm text-red-600">
                            Supprimer
                          </span>
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
        <DialogContent className="w-[95vw] max-w-[95vw] sm:w-full sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Details</DialogTitle>
          </DialogHeader>
          {currentEvent && (
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
                {/* Client and Place Row */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="client" className="text-xs sm:text-sm">
                      Client
                    </Label>
                    <Input
                      id="client"
                      className="w-full text-xs sm:text-sm"
                      defaultValue={currentEvent.client}
                      {...register("client", {
                        required: "Le champ client est requis",
                      })}
                    />
                    {errors.client && (
                      <span className="text-xs text-red-500">
                        {errors.client.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bon" className="text-xs sm:text-sm">
                      Bon de commande
                    </Label>
                    <Input
                      id="bon"
                      className="w-full text-xs sm:text-sm"
                      defaultValue={currentEvent.bon ? currentEvent.bon : ""}
                      {...register("bon")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="place" className="text-xs sm:text-sm">
                      Lieux
                    </Label>
                    <Input
                      id="place"
                      className="w-full text-xs sm:text-sm"
                      defaultValue={currentEvent.place}
                      {...register("place", {
                        required: "Le champ lieux est requis",
                      })}
                    />
                    {errors.place && (
                      <span className="text-xs text-red-500">
                        {errors.place.message}
                      </span>
                    )}
                  </div>

                  {/* Materials */}
                  <div className="space-y-2">
                    <Label htmlFor="materials" className="text-xs sm:text-sm">
                      Matériels
                    </Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="text-xs" variant="outline">
                          Materiels
                          <ChevronDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent id="materials" className="w-44">
                        {matos.map((tag) => (
                          <DropdownMenuCheckboxItem
                            checked={selectedMatos.includes(tag)}
                            key={tag}
                            onCheckedChange={(checked) =>
                              handleTagChange(tag, checked)
                            }
                            onSelect={(e) => e.preventDefault()}
                          >
                            {tag}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>*
                    </DropdownMenu>
                    {errors.materials && (
                      <span className="text-xs text-red-500">
                        {errors.materials.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Date and Travel Row */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-xs sm:text-sm">
                      Date
                    </Label>
                    <Input
                      defaultValue={currentEvent.date}
                      type="date"
                      className="w-full text-xs sm:text-sm"
                      id="date"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("date", {
                        required: "Le champ date est requis",
                      })}
                    />
                    {errors.date && (
                      <span className="text-xs text-red-500">
                        {errors.date.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travel" className="text-xs sm:text-sm">
                      Route (jours)
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Nombre de jours"
                      className="w-full text-xs sm:text-sm"
                      id="travel"
                      {...register("travel", {
                        required: "Le champ route est requis",
                        valueAsNumber: true,
                      })}
                    />
                    {errors.travel && (
                      <span className="text-xs text-red-500">
                        {errors.travel.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Observation */}
                <div className="space-y-2">
                  <Label htmlFor="observation" className="text-xs sm:text-sm">
                    Observation
                  </Label>
                  <Textarea
                    id="observation"
                    className="min-h-[100px] sm:min-h-[120px] w-full text-xs sm:text-sm"
                    defaultValue={
                      currentEvent.observation ? currentEvent.observation : ""
                    }
                    {...register("observation")}
                  />
                </div>

                {/* Focal Point */}
                <div className="space-y-2">
                  <Label htmlFor="focal" className="text-xs sm:text-sm">
                    Point Focal
                  </Label>
                  <Input
                    id="focal"
                    className="w-full text-xs sm:text-sm"
                    defaultValue={currentEvent.focal}
                    {...register("focal", {
                      required: "Le champ focal est requis",
                    })}
                  />
                  {errors.focal && (
                    <span className="text-xs text-red-500">
                      {errors.focal.message}
                    </span>
                  )}
                </div>

                {/* Confirmation Radio Group */}
                <ConfirmationRadioGroup control={control} errors={errors} />
              </div>

              <DialogFooter className="gap-3 sm:gap-4 mt-4 justify-end flex flex-row">
                <DialogClose asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    Annuler
                  </Button>
                </DialogClose>
                <Button type="submit" size="sm" className="text-xs sm:text-sm">
                  Sauvegarder
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <AlertDialog
        open={deleteconfirmation}
        onOpenChange={setDeleteconfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Etes vous sur?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera l&apos;element choisi de facon permanente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {selectedEvents.map((event) => (
              <span key={event.id} className="space-x-2">
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>
                  Confirmer
                </AlertDialogAction>
              </span>
            ))}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
