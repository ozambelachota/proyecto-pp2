import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { pacienteService } from "./services/paciente-service.";
import { usePacienteStore } from "./store/use-paciente-store";
import { IPaciente } from "./types/paciente.interface";
import { EditarModal } from "./views/edit-paciente";

const formSchema = z.object({
  dni: z.string().optional(),
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  sexo: z.enum(["Masculino", "Femenino"]).optional(),
  fechaNacimiento: z.date().optional(),
});
type Paciente = z.infer<typeof formSchema>;
type FormData = z.infer<typeof formSchema>;
function Paciente() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dni: "",
      nombre: "",
      apellido: "",
      fechaNacimiento: undefined,
    },
  });
  const { setEditForm } = usePacienteStore();
  const pacienteQuery = useQuery({
    queryKey: ["pacientes"],
    queryFn: async () => {
      const pacientes = await pacienteService.getPacientes({
        dni: form.watch("dni"),
        nombre: form.watch("nombre"),
        apellido: form.watch("apellido"),
        fecha_nacimiento: form.watch("fechaNacimiento"),
        genero: form.watch("sexo"),
      });
      return pacientes;
    },
  });
  const [open, setOpen] = useState(false);
  const handleEdit = (data: IPaciente) => {
    console.log(data);
    setEditForm(data);
    setOpen(true);
  };
  const onFilter: SubmitHandler<FormData> = () => {
    pacienteQuery.refetch();
  };
  if (pacienteQuery.isLoading) {
    return <div>Loading...</div>;
  }
  if (pacienteQuery.isError) {
    return <div>Error: {pacienteQuery.error.message}</div>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Pacientes</h1>
      <Accordion
        type="single"
        collapsible
        defaultValue="filtrado"
        className="mb-6 w-full"
      >
        <AccordionItem value="filtrado">
          <AccordionTrigger>Filtros de Búsqueda</AccordionTrigger>
          <AccordionContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onFilter)}
                className="space-y-4"
              >
                <div className="grid grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="dni"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DNI</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese DNI" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese nombre" {...field} />
                        </FormControl>
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
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sexo"
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
                                  formatDate(field.value, "PPP")
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
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end">
                    <Button type="submit" className="w-full">
                      Buscar
                    </Button>
                    <Button
                      type="reset"
                      variant={"secondary"}
                      className="w-full"
                      onClick={() => {
                        form.reset();
                        pacienteQuery.refetch();
                      }}
                    >
                      Limpiar
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion
        type="single"
        collapsible
        defaultValue="resultados"
        className="mb-6 w-full"
      >
        <AccordionItem value="resultados">
          <AccordionTrigger>Resultados de la Búsqueda</AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DNI</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Fecha de Nacimiento</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pacienteQuery.data &&
                  pacienteQuery.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.dni}</TableCell>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{item.apellido}</TableCell>
                      <TableCell>{item.genero}</TableCell>
                      <TableCell>
                        {formatDate(item.fecha_nacimiento, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleEdit(item)}>Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <EditarModal
        isOpen={open}
        onClose={() => {
          setEditForm({
            id: 0,
            dni: "",
            nombre: "",
            apellido: "",
            genero: "Femenino",
            fecha_nacimiento: new Date(),
            telefono: "",
            direccion: "",
          });
          setOpen(false);
        }}
      />
    </div>
  );
}

export default Paciente;
