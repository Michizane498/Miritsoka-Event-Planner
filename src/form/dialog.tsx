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
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, PlusIcon } from "lucide-react";

export type FormValues = {
  client: string;
  place: string;
  date: string;
  travel: number;
  materials: string;
  observation?: string;
  focal: string;
};

export function EventDialog() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    await addEvents(data);
  };
  // export function MyDialog() {
  //   return (
  //     <Dialog>
  //       <DialogTrigger asChild>
  //         <Button className="relative" variant="default">
  //           <PlusIcon />
  //           Nouvel Evenement
  //         </Button>
  //       </DialogTrigger>
  //       <DialogDescription></DialogDescription>
  //       <DialogContent className="sm:max-w-[700px]">
  //         <DialogHeader>
  //           <DialogTitle>Nouvel Evenement</DialogTitle>
  //         </DialogHeader>
  //         <div className="grid gap-4 py-4">
  //           <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
  //             <div className="grid grid-cols-4 gap-4">
  //               <Label htmlFor="Client" className="text-right">
  //                 Client
  //               </Label>
  //               <Input className="col-span-3" />
  //             </div>
  //             <div className="grid grid-cols-4 gap-4">
  //               <Label htmlFor="Lieux" className="text-right">
  //                 Lieux
  //               </Label>
  //               <Input className="col-span-3" />
  //             </div>
  //           </div>
  //           <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
  //             <div className="grid grid-cols-4 gap-4">
  //               <Label htmlFor="Date" className="text-right">
  //                 Date
  //               </Label>
  //               <Input type="Date" className="col-span-3 text-muted-foreground" />
  //             </div>
  //             <div className="grid grid-cols-4 gap-4">
  //               <Label htmlFor="Route" className="text-right">
  //                 Route
  //               </Label>
  //               <Input type="number" placeholder="Jours" className="col-span-3" />
  //             </div>
  //           </div>
  //           <div className="grid grid-cols-4 gap-4">
  //             <Label htmlFor="Materiels" className="text-right">
  //               Materiels
  //             </Label>
  //             <Input className="col-span-3" />
  //           </div>
  //           <div className="grid col-span-full grid-cols-1 gap-4">
  //             <Label
  //               htmlFor="Observation"
  //               className="block text-righ text-sm/6 font-medium text-gray-900"
  //             >
  //               Observation
  //             </Label>
  //             <div className="mt-2">
  //               <textarea
  //                 name="about"
  //                 className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-30 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
  //         focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
  //         aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
  //               ></textarea>
  //             </div>
  //           </div>
  //           <div className="grid grid-cols-4 gap-4">
  //             <Label htmlFor="Point Focal" className="text-right">
  //               Point Focal
  //             </Label>
  //             <Input className="col-span-3" />
  //           </div>
  //         </div>
  //         <DialogFooter>
  //           <Button onClick={getEvents} type="submit">Ajouter</Button>
  //         </DialogFooter>
  //       </DialogContent>
  //     </Dialog>
  //   );
  // }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"}>
          <Plus />
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
                  {...register("client", { required: "Le champ client est requis" })}
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
                  {...register("place", { required: "Le champ lieux est requis" })}
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
                  min= {new Date().toISOString().split('T')[0]}
                  {...register("date", { required: "Le champ date est requis" })}
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
                {...register("focal", { required: "Le champ focal est requis" })}
              />
              {errors.focal && (
                <span className="col-span-4 text-sm text-red-500">
                  {errors.focal.message}
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
