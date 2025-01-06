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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { z } from "zod";
import { equipoService } from "../../services/equipo-service";
import { tipoEquipoService } from "../../services/tipo-equipo-service";
import { formSchemaEquipo } from "../types/equipo";
import { ITipoEquipo } from "../types/tipo-equipo";

export default function FormEquipo() {
  const formEquipo = useForm<z.infer<typeof formSchemaEquipo>>({
    resolver: zodResolver(formSchemaEquipo),
  });
  const mutate = useMutation({
    mutationKey: ["equipo", formEquipo.getValues()],
    mutationFn: async (data: z.infer<typeof formSchemaEquipo>) => {
      return await equipoService.insertEquipo(data);
    },
  });
  const tipoQuery = useQuery({
    queryKey: ["tipoEquipo"],
    queryFn: async () => {
      return (await tipoEquipoService.getTipoEquipo()) as ITipoEquipo[];
    },
  });
  const onSaveEquipo: SubmitHandler<z.infer<typeof formSchemaEquipo>> = async (
    data: z.infer<typeof formSchemaEquipo>
  ) => {
    console.log("onSaveEquipo", data);
  };
  return (
    <>
      <div>
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Datos Personales
          </h2>
          <Form {...formEquipo}>
            <form
              onSubmit={formEquipo.handleSubmit(onSaveEquipo)}
              className="space-y-4"
            >
              <FormField
                control={formEquipo.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>NOMBRE DEL EQUIPO</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese nombre del equipo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formEquipo.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MARECA</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese marca" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formEquipo.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MODELO</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese modelo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formEquipo.control}
                name="numero_serie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NUMERO DE SERIE</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese numero de serie" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formEquipo.control}
                name="tipo_equipo_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TIPO DE EQUIPO MEDICO</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
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
