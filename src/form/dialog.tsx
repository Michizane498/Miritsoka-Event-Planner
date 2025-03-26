"use client";

import { addEvents } from "@/actions/eventActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      confirmation: "miritsoka", // Default selection
    },
  });

  const onSubmit = async (data: FormValues) => {
    await addEvents(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"}>
          <PlusIcon />
          Ajouter un evenement
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:min-w-[700px]">
        <DialogHeader>
          <DialogTitle>Nouvel Evenement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="client" className="text-right">
                  Client
                </Label>
                <Input
                  className="col-span-3"
                  id="client"
                  {...register("client", {
                    required: "Le champ client est requis",
                  })}
                />
                {errors.client && (
                  <span className="col-span-4 text-sm text-red-500">
                    {errors.client.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="place" className="text-right">
                  Lieux
                </Label>
                <Input
                  className="col-span-3"
                  id="place"
                  {...register("place", {
                    required: "Le champ lieux est requis",
                  })}
                />
                {errors.place && (
                  <span className="col-span-4 text-sm text-red-500">
                    {errors.place.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  type="date"
                  className="col-span-3 text-muted-foreground"
                  id="date"
                  min={new Date().toISOString().split("T")[0]}
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

              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="travel" className="text-right">
                  Route
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="Jours"
                  className="col-span-3"
                  id="travel"
                  {...register("travel", {
                    required: "Le champ route est requis",
                    valueAsNumber: true,
                  })}
                />
                {errors.travel && (
                  <span className="col-span-4 text-sm text-red-500">
                    {errors.travel.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="materials" className="text-right">
                Materiels
              </Label>
              <Input
                className="col-span-3"
                id="materials"
                {...register("materials", {
                  required: "Le champ materiels est requis",
                })}
              />
              {errors.materials && (
                <span className="col-span-4 text-sm text-red-500">
                  {errors.materials.message}
                </span>
              )}
            </div>

            <div className="grid col-span-full grid-cols-1 gap-4">
              <Label
                htmlFor="observation"
                className="block text-left text-sm/6 font-medium text-gray-900"
              >
                Observation
              </Label>
              <div className="mt-2">
                <Textarea
                  id="observation"
                  className="min-h-[120px] w-full"
                  {...register("observation")}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="focal" className="text-right">
                Point Focal
              </Label>
              <Input
                className="col-span-3"
                id="focal"
                {...register("focal", {
                  required: "Le champ focal est requis",
                })}
              />
              {errors.focal && (
                <span className="col-span-4 text-sm text-red-500">
                  {errors.focal.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="confirmation" className="text-right">
                Confirmation
              </Label>
              <Controller
                name="confirmation"
                control={control}
                rules={{ required: "Événement confirmé ?" }}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="col-span-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="miritsoka" id="miritsoka" />
                      <Label htmlFor="miritsoka">Miritsoka</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="confirme" id="confirme" />
                      <Label htmlFor="confirme">Confirmé</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-confirme" id="non-confirme" />
                      <Label htmlFor="non-confirme">Non Confirmé</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.confirmation && (
                <span className="col-span-4 text-sm text-red-500">
                  {errors.confirmation.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}