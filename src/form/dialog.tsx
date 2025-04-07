"use client";
import { addEvents } from "@/actions/eventActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PlusIcon,
} from "lucide-react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronProps,
  DateRange,
  DayButtonProps,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { fr } from "date-fns/locale";

export type FormValues = {
  client: string;
  eventname: string;
  boncommande?: string;
  bonsortie?: string;
  place: string;
  date: string;
  travel: number;
  materials: string;
  focal: string;
  confirmation: string;
};

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
  "Groupe 100 KVA Fotsy",
  "Groupe 40 KVA Mavo",
  "Groupe 25 KVA Mavo",
  "Groupe 25 KVA Mainty",
  "Groupe 10 KVA Fotsy",
  "Groupe Location",
];

export function EventDialog() {
  const [open, setOpen] = useState(false);
  const [selectedMatos, setSelectedMatos] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const today = useMemo(() => new Date(), []);

  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedMatos([...selectedMatos, tag]);
    } else {
      setSelectedMatos(selectedMatos.filter((t) => t !== tag));
    }
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      confirmation: "Miritsoka",
      travel: 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formattedDate = dateRange?.from
      ? dateRange.to
        ? `${format(dateRange.from, "yyyy-MM-dd")} to ${format(
            dateRange.to,
            "yyyy-MM-dd"
          )}`
        : format(dateRange.from, "yyyy-MM-dd")
      : "";

    const formData = {
      ...data,
      materials: selectedMatos.join(", "),
      date: formattedDate,
    };

    try {
      await addEvents(formData);
      setOpen(false);
      reset();
      setSelectedMatos([]);
      setDateRange(undefined);
      toast.success("L'événement a été ajouté avec succès", {
        description:
          "Rafraîchir la page pour voir les dernières actualisations",
      });
    } catch {
      toast.error("Erreur lors de l'ajout de l'événement", {
        className: "font-bold",
        description: "Veuillez réessayer",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="text-xs sm:text-sm">
          <PlusIcon className="w-4 h-4 mr-1" />
          Ajouter un événement
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:w-full sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Nouvel Événement
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
            {/* Client and Event Name Row */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client" className="text-xs sm:text-sm">
                  Client
                </Label>
                <Input
                  id="client"
                  className="w-full text-xs sm:text-sm"
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
                <Label htmlFor="eventname" className="text-xs sm:text-sm">
                  Nom de l&apos;événement
                </Label>
                <Input
                  id="eventname"
                  className="w-full text-xs sm:text-sm"
                  {...register("eventname", {
                    required: "Le champ nom de l'événement est requis",
                  })}
                />
                {errors.eventname && (
                  <span className="text-xs text-red-500">
                    {errors.eventname.message}
                  </span>
                )}
              </div>
            </div>

            {/* Bon de commande and Bon de sortie Row */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="boncommande" className="text-xs sm:text-sm">
                  Bon de commande
                </Label>
                <Input
                  id="boncommande"
                  className="w-full text-xs sm:text-sm"
                  {...register("boncommande")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bonsortie" className="text-xs sm:text-sm">
                  Bon de sortie
                </Label>
                <Input
                  id="bonsortie"
                  className="w-full text-xs sm:text-sm"
                  {...register("bonsortie")}
                />
              </div>
            </div>

            {/* Place and Materials Row */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="place" className="text-xs sm:text-sm">
                  Lieux
                </Label>
                <Input
                  id="place"
                  className="w-full text-xs sm:text-sm"
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

              <div className="space-y-2">
                <Label htmlFor="materials" className="text-xs sm:text-sm">
                  Matériels
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="text-xs" variant="outline">
                      Matériels
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    id="materials"
                    className="w-100 grid grid-cols-2 max-h-[300px] overflow-y-auto"
                  >
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
                  </DropdownMenuContent>
                </DropdownMenu>
                {selectedMatos.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Sélectionné: {selectedMatos.join(", ")}
                  </div>
                )}
              </div>
            </div>

            {/* Date and Travel Row */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-xs sm:text-sm">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs sm:text-sm",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                            {format(dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        <span>Choisissez une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DayPicker
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      disabled={[{ before: today }]}
                      locale={fr}
                      id="date"
                      classNames={{
                        month: "capitalize font-semibold text-sm sm:text-base",
                        selected: "text-white",
                        root: `${
                          getDefaultClassNames().root
                        } shadow-none border rounded-sm p-2 sm:p-4 md:p-5 w-full`,
                        day: "group rounded-sm text-xs sm:text-sm",
                        caption_label: "text-sm sm:text-base",
                      }}
                      numberOfMonths={1}
                      components={{
                        DayButton: (props: DayButtonProps) => (
                          <Button
                            {...props}
                            variant="ghost"
                            className="w-8 h-8 px-3 py-3 sm:gap-0 text-accent-foreground group-aria-selected:bg-accent rounded-[3px]"
                          />
                        ),
                        Chevron: ({
                          className,
                          orientation,
                          ...props
                        }: ChevronProps) => {
                          const Icon =
                            orientation === "left"
                              ? ChevronLeft
                              : orientation === "right"
                              ? ChevronRight
                              : ChevronDown;
                          return (
                            <Icon
                              className={`${className} w-6 h-6`}
                              {...props}
                            />
                          );
                        },
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {!dateRange?.from && (
                  <span className="text-xs text-red-500">
                    Veuillez sélectionner une date
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
                    min: {
                      value: 0,
                      message: "Le nombre de jours ne peut pas être négatif",
                    },
                  })}
                />
                {errors.travel && (
                  <span className="text-xs text-red-500">
                    {errors.travel.message}
                  </span>
                )}
              </div>
            </div>

            {/* Focal Point */}
            <div className="space-y-2">
              <Label htmlFor="focal" className="text-xs sm:text-sm">
                Point Focal
              </Label>
              <Input
                id="focal"
                className="w-full text-xs sm:text-sm"
                {...register("focal", {
                  required: "Le champ point focal est requis",
                })}
              />
              {errors.focal && (
                <span className="text-xs text-red-500">
                  {errors.focal.message}
                </span>
              )}
            </div>

            {/* Confirmation Radio Group */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Confirmation</Label>
              <Controller
                name="confirmation"
                control={control}
                rules={{ required: "Événement confirmé ?" }}
                render={({ field }) => (
                  <RadioGroup.Root
                    onValueChange={field.onChange}
                    value={field.value}
                    className="w-full"
                  >
                    <div className="bg-primary-foreground justify-between sm:justify-center w-full sm:w-[280px] h-9 p-1 rounded-2xl flex">
                      {["Miritsoka", "Confirmé", "Non confirmé"].map(
                        (option) => (
                          <RadioGroup.Item
                            key={option}
                            value={option}
                            className={`font-semibold text-xs sm:text-[13px] data-[state=checked]:ring-[1px] w-[30%] sm:w-[90px] ring-border rounded-2xl flex items-center justify-center px-1 ${
                              option === "Miritsoka"
                                ? "data-[state=checked]:bg-green-700 data-[state=checked]:ring-green-600"
                                : option === "Confirmé"
                                ? "data-[state=checked]:bg-blue-400 data-[state=checked]:ring-blue-500"
                                : "data-[state=checked]:bg-red-600 data-[state=checked]:ring-red-700"
                            } data-[state=checked]:text-primary-foreground`}
                          >
                            {option}
                          </RadioGroup.Item>
                        )
                      )}
                    </div>
                  </RadioGroup.Root>
                )}
              />
              {errors.confirmation && (
                <span className="text-xs text-red-500">
                  {errors.confirmation.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" className="w-full sm:w-auto">
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
