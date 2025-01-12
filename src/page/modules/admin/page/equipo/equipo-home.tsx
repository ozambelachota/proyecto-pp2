import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { equipoService } from "../services/equipo-service";
import { tipoEquipoService } from "../services/tipo-equipo-service";
import { formSchemaEquipo } from "./types/equipo";

export default function EquipoHome() {
  const form = useForm<z.infer<typeof formSchemaEquipo>>({
    defaultValues: {
      disponible: true,
      marca: "",
      modelo: "",
      nombre: "",
      numero_serie: "",
      tipo_equipo_id: "",
    },
  });
  const equipoQuery = useQuery({
    queryKey: ["equipo"],
    queryFn: async () => {
      const reesponse = await equipoService.getEquiposFilter({
        marca: form.watch("marca"),
        modelo: form.watch("modelo"),
        nombre: form.watch("nombre"),
        numero_serie: form.watch("numero_serie"),
        tipo_equipo_id: form.watch("tipo_equipo_id"),
      });
      return reesponse;
    },
  });
  const tipoQuery = useQuery({
    queryKey: ["tipoEquipo"],
    queryFn: async () => {
      const reesponse = await tipoEquipoService.getTipoEquipo();
      return reesponse;
    },
  });
  const onFilter: SubmitHandler<z.infer<typeof formSchemaEquipo>> = (
   
  ) => {
    equipoQuery.refetch();
  };
  if (equipoQuery.isLoading) {
    return <div>Loading...</div>;
  }
  if (equipoQuery.isError) {
    return <div>Error: {equipoQuery.error.message}</div>;
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
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del equipo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese nombre del equipo"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="marca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese marca" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modelo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese modelo" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numero_serie"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de serie</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese número de serie"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tipo_equipo_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TIPO DE EQUIPO MEDICO</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tipoQuery.data?.map((item) => (
                              <SelectItem key={item.id} value={`${item.id}`}>
                                {item.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription></FormDescription>
                        <FormMessage />
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
                        equipoQuery.refetch();
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
                  <TableHead>NOMBRE DEL EQUIPO</TableHead>
                  <TableHead>MARCA</TableHead>
                  <TableHead>MODELO</TableHead>
                  <TableHead>NUMERO DE SERIE</TableHead>
                  <TableHead>TIPO DE EQUIPO</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipoQuery.data &&
                  equipoQuery.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{item.marca}</TableCell>
                      <TableCell>{item.modelo}</TableCell>
                      <TableCell>{item.numero_serie}</TableCell>
                      <TableCell>{item.tipo_equipo?.nombre}</TableCell>

                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
