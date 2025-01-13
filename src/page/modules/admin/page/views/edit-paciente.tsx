import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import * as z from "zod";
import { pacienteService } from "../services/paciente-service.";
import { usePacienteStore } from "../store/use-paciente-store";
const formSchema = z.object({
  id: z.number(),
  dni: z.string().min(8, "El DNI debe tener al menos 8 caracteres"),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  sexo: z.enum(["Masculino", "Femenino"]),
  fechaNacimiento: z.date({
    required_error: "Por favor seleccione una fecha de nacimiento",
  }),
  telefono: z.string().min(9, "El teléfono debe tener al menos 9 caracteres"),
  direccion: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

interface EditarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditarModal({ isOpen, onClose }: EditarModalProps) {
  const pacienteStore = usePacienteStore();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    form.reset(pacienteStore.editForm);
  }, [pacienteStore.editForm]);
  const updatePaciente = useMutation({
    mutationKey: ["paciente", pacienteStore.editForm],
    mutationFn: async (data: FormData) => {
      console.log(data);
      return await pacienteService.updatePaciente(
        {
          dni: data.dni,
          nombre: data.nombre.toUpperCase(),
          apellido: data.apellido.toUpperCase(),
          genero: data.sexo,
          direccion: data.direccion,
          fecha_nacimiento: new Date(data.fechaNacimiento),
          telefono: data.telefono,
        },
        pacienteStore.editForm.id!
      );
    },
    onSuccess: () => {
      onClose();
      pacienteStore.setEditForm({
        id: 0,
        dni: "",
        nombre: "",
        apellido: "",
        genero: "Masculino",
        direccion: "",
        fecha_nacimiento: new Date(),
        telefono: "",
      });
      toast.success("Paciente actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
    },
  });
  const handleSubmit: SubmitHandler<FormData> = (formData: FormData) => {
    console.log(formData);
    updatePaciente.mutate(formData);
  };

  return (
    <>
      <Dialog
        modal
        open={isOpen}
        onOpenChange={() => {
          onClose();
          form.reset();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Registro</DialogTitle>
            <DialogDescription>Editar los datos del paciente</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="dni"
                  defaultValue={pacienteStore.editForm.dni}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DNI</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nombre"
                  defaultValue={pacienteStore.editForm.nombre}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apellido"
                  defaultValue={pacienteStore.editForm.apellido}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sexo"
                  defaultValue={pacienteStore.editForm.genero}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione sexo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Femenino">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fechaNacimiento"
                  defaultValue={pacienteStore.editForm.fecha_nacimiento}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatDate(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Seleccione fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={updatePaciente.isPending}>
                  {updatePaciente.isPending ? "Cargando..." : "Guardar cambios"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{ duration: 3000 }}
      />
    </>
  );
}
