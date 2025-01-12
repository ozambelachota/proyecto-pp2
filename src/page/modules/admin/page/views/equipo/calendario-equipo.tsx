import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { equipoService } from "../../services/equipo-service";
import { pacienteService } from "../../services/paciente-service.";
import { asignacionEquipoService } from "./services/asignacion-equipo.service";

const formSchemaAsignacion = z.object({
  paciente_id: z.string().min(1, "Seleccionar un paciente es obligatorio"),
  equipo_id: z.string().min(1, "Seleccionar un equipo es obligatorio"),
  direccion: z.string().min(1, "La dirección es obligatoria"),
  fecha_asignacion: z.string().min(1, "La fecha de asignación es obligatoria"),
});

export default function CalendarioConFormulario() {
  const formAsignacion = useForm<z.infer<typeof formSchemaAsignacion>>({
    resolver: zodResolver(formSchemaAsignacion),
    defaultValues: {
      paciente_id: "",
      equipo_id: "",
      direccion: "",
      fecha_asignacion: "",
    },
  });

  // Consultas para obtener opciones de equipos y pacientes
  const { data: equipos } = useQuery({
    queryKey: ["equipos"],
    queryFn: async () => await equipoService.getEquiposFilter({}),
  });

  const { data: pacientes } = useQuery({
    queryKey: ["pacientes"],
    queryFn: async () => await pacienteService.getPacientes({}),
  });

  // Obtener datos de asignaciones para el calendario
  const { data: asignaciones, isLoading: loadingAsignaciones } = useQuery({
    queryKey: ["asignacionEquipo"],
    queryFn: async () => {
      console.log(asignacionEquipoService.getAsignacionEquipo());
      return await asignacionEquipoService.getAsignacionEquipo();
    },
  });

  // Mutación para insertar nueva asignación
  const mutatation = useMutation({
    mutationKey: ["asignacionEquipo"],
    mutationFn: async (data: z.infer<typeof formSchemaAsignacion>) => {
      return await asignacionEquipoService.insertAsignacionEquipo({
        equipo_id: Number(data.equipo_id),
        paciente_id: Number(data.paciente_id),
        direccion: data.direccion,
        fecha_asignacion: new Date(data.fecha_asignacion),
      });
    },
    onSuccess: () => {
      toast.success("Asignación creada correctamente");
      formAsignacion.reset();
    },
    onError: () => {
      toast.error("Error al crear la asignación");
    },
  });

  const onSubmit = (data: z.infer<typeof formSchemaAsignacion>) => {
    mutatation.mutate(data);
  };

  return (
    <div className="flex">
      {/* Formulario */}
      <div className="w-1/3 p-4 border-r">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Asignación de Equipo Médico
          </h2>
          <Form {...formAsignacion}>
            <form
              onSubmit={formAsignacion.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={formAsignacion.control}
                name="paciente_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paciente</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar paciente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pacientes?.map((paciente) => (
                          <SelectItem
                            key={paciente.id}
                            value={`${paciente.id}`}
                          >
                            {paciente.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formAsignacion.control}
                name="equipo_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipo</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar equipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {equipos?.map((equipo) => (
                          <SelectItem key={equipo.id} value={`${equipo.id}`}>
                            {equipo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formAsignacion.control}
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
                control={formAsignacion.control}
                name="fecha_asignacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Asignación</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={mutatation.isPending}
                className="w-full"
              >
                {mutatation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Calendario */}
      <div className="w-2/3 p-4">
        {loadingAsignaciones ? (
          <p>Cargando asignaciones...</p>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin]}
            locale="es"
            initialView="dayGridMonth"
            events={asignaciones?.map((asignacion) => ({
              title: `${
                asignacion.equipos?.nombre ?? "desconocido"
              } - Paciente ${asignacion.paciente_id}`,
              date: asignacion.fecha_asignacion,
            }))}
          />
        )}
      </div>

      <Toaster position="top-right" theme="dark" duration={3000} />
    </div>
  );
}
