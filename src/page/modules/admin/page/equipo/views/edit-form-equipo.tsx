import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { equipoService } from "../../services/equipo-service";
import { tipoEquipoService } from "../../services/tipo-equipo-service";
import { useEquipoStore } from "../store/useEquipoStore";
import { formSchemaEquipo } from "../types/equipo";
import { ITipoEquipo } from "../types/tipo-equipo";

interface IProps {
  setOpen: () => void;
  open: boolean;
}
const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  marca: z.string().min(1, "La marca es obligatoria"),
  modelo: z.string().min(1, "El modelo es obligatorio"),
  numero_serie: z.string().min(1, "El numero de serie es obligatorio"),
  disponible: z.boolean(),
  tipo_equipo_id: z.string(),
});

export default function FormEditEqiopo(props: IProps) {
  const queryClient = useQueryClient();
  const { setOpen, open } = props;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const tipoEquipoQuery = useQuery({
    queryKey: ["tipoEquipo"],
    queryFn: async () => {
      return (await tipoEquipoService.getTipoEquipo()) as ITipoEquipo[];
    },
  });
  const { equipo } = useEquipoStore();
  useEffect(() => {
    console.log(equipo);
    form.reset({
      disponible: equipo.disponible,
      marca: equipo.marca,
      modelo: equipo.modelo,
      nombre: equipo.nombre,
      numero_serie: equipo.numero_serie,
      tipo_equipo_id: `${equipo.tipo_equipo_id}`,
    });
  }, [equipo]);

  const mutation = useMutation({
    mutationKey: ["equipo", form.getValues()],
    mutationFn: async (data: z.infer<typeof formSchemaEquipo>) => {
      console.log(equipo.id);
      return await equipoService.updateEquipo({
        id: equipo.id,
        disponible: data.disponible,
        marca: data.marca,
        modelo: data.modelo,
        nombre: data.nombre,
        numero_serie: data.numero_serie,
        tipo_equipo_id: Number(data.tipo_equipo_id),
      });
    },
    onSuccess: () => {
      setOpen();
      toast.success("Equipo actualizado");
      queryClient.invalidateQueries({ queryKey: ["equipo"] });
    },
    onError: () => {
      toast.error("Error al actualizar el equipo");
    },
  });
  const handleSubmit: SubmitHandler<z.infer<typeof formSchemaEquipo>> = (
    data
  ) => {
    mutation.mutate(data);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Equipo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del equipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese nombre del equipo" {...field} />
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
                  <FormLabel>Numero de serie</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese numero de serie" {...field} />
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
                      {tipoEquipoQuery.data?.map((item) => (
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
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                Guardar Cambios
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setOpen();
                }}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
