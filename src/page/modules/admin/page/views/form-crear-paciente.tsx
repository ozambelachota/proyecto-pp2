import { apiNetDniService, PersonaDni } from "@/api/service-api-peru";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { pacienteService } from "../services/paciente-service.";

const formSchema = z.object({
  dni: z.string().min(8, "El DNI debe tener al menos 8 caracteres"),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  sexo: z.enum(["Masculino", "Femenino"], {
    required_error: "Por favor seleccione un sexo",
  }),
  direccion: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  fechaNacimiento: z.date({
    required_error: "Por favor seleccione una fecha de nacimiento",
  }),
  telefono: z.string().min(9, "El teléfono debe tener al menos 9 caracteres"),
});

export default function FormCrearPaciente() {
  const [shouldFetch, setShouldFetch] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dni: "",
      nombre: "",
      apellido: "",
      sexo: undefined,
      direccion: "",
      fechaNacimiento: undefined,
      telefono: "",
    },
  });
  const query = useQuery({
    queryKey: ["paciente", form.watch("dni")],
    queryFn: async () => {
      const data = await apiNetDniService(form.watch("dni"));
      return data as PersonaDni;
    },
    enabled: shouldFetch,
  });
  const mutate = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await pacienteService.insertPaciente({
        dni: data.dni,
        nombre: data.nombre.toUpperCase(),
        apellido: data.apellido.toUpperCase(),
        genero: data.sexo,
        direccion: data.direccion,
        fecha_nacimiento: data.fechaNacimiento,
        telefono: data.telefono,
      });
    },
    onSuccess: () => {
      form.reset();
      toast.success("Paciente creado exitosamente");
      new QueryClient().invalidateQueries({ queryKey: ["paciente"] });
    },
    onError: () => {
      toast.error("Error al crear el paciente");
    },
  });

  const onSavePaciente: SubmitHandler<z.infer<typeof formSchema>> = async (
    data: z.infer<typeof formSchema>
  ) => {
    mutate.mutate(data);
  };
  function handleBuscarDni(): void {
    setShouldFetch(true);
    if (query.data) {
      form.setValue("nombre", query.data.nombres);
      form.setValue("apellido", query.data.apellidoPaterno);
      setShouldFetch(false);
    }
  }

  return (
    <>
      <div>
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Datos Personales
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSavePaciente)}
              className="space-y-4"
            >
              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="dni"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>DNI</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese DNI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={handleBuscarDni}
                  className="mt-8"
                  disabled={query.isLoading}
                >
                  {query.isLoading ? "Buscando..." : "Buscar"}
                </Button>
              </div>

              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese apellido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sexo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Masculino" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Masculino
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Femenino" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Femenino
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="direccion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese dirección" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaNacimiento"
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

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={mutate.isPending}
                type="submit"
                className="w-full"
              >
                {mutate.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Toaster position="top-right" theme="dark" duration={3000} />
    </>
  );
}
