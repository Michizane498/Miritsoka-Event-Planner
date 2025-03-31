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
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState } from "react";

export type FormValues = {
  client: string;
  place: string;
  date: string;
  travel: number;
  materials: string;
  observation?: string;
  focal: string;
  confirmation: string;
};

export function EventDialog() {
  const [open, setOpen] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      confirmation: "Miritsoka",
    },
  });

  const onSubmit = async (data: FormValues) => {
    await addEvents(data);
    setOpen(false);
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
          <DialogTitle className="text-lg sm:text-xl">Nouvel Événement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            </div>

            {/* Date and Travel Row */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-xs sm:text-sm">
                  Date
                </Label>
                <Input
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

            {/* Materials */}
            <div className="space-y-2">
              <Label htmlFor="materials" className="text-xs sm:text-sm">
                Matériels
              </Label>
              <Input
                id="materials"
                className="w-full text-xs sm:text-sm"
                {...register("materials", {
                  required: "Le champ matériels est requis",
                })}
              />
              {errors.materials && (
                <span className="text-xs text-red-500">
                  {errors.materials.message}
                </span>
              )}
            </div>

            {/* Observation */}
            <div className="space-y-2">
              <Label htmlFor="observation" className="text-xs sm:text-sm">
                Observation
              </Label>
              <Textarea
                id="observation"
                className="min-h-[100px] sm:min-h-[120px] w-full text-xs sm:text-sm"
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
                    <div className="bg-gray-200 justify-between sm:justify-center w-full sm:w-[280px] h-9 p-1 rounded-2xl flex">
                      {["Miritsoka", "Confirmé", "Non confirmé"].map((option) => (
                        <RadioGroup.Item
                          key={option}
                          value={option}
                          className={`font-semibold text-xs sm:text-[13px] data-[state=checked]:ring-[1px] w-[30%] sm:w-[90px] ring-border rounded-2xl flex items-center justify-center px-1 ${
                            option === "Miritsoka"
                              ? "data-[state=checked]:bg-amber-700 data-[state=checked]:ring-orange-600"
                              : option === "Confirmé"
                              ? "data-[state=checked]:bg-green-400 data-[state=checked]:ring-green-500"
                              : "data-[state=checked]:bg-red-600 data-[state=checked]:ring-red-700"
                          } data-[state=checked]:text-primary-foreground`}
                        >
                          {option}
                        </RadioGroup.Item>
                      ))}
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