import { z } from "zod";

const formSchemaEquipo = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  marca: z.string().min(2, "La marca debe tener al menos 2 caracteres"),
  modelo: z.string().min(2, "El modelo debe tener al menos 2 caracteres"),
  numero_serie: z
    .string()
    .min(2, "El numero de serie debe tener al menos 2 caracteres"),
  disponible: z.boolean().default(true),
  tipo_equipo_id: z.string().min(1, "Por favor seleccione un tipo de equipo"),
});
export interface IEquipoFilter{
  nombre?: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  disponible?: string;
  tipo_equipo_id?: string;
}

export { formSchemaEquipo };

export interface IFormEquipo {
  nombre: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  disponible: boolean;
  tipo_equipo_id: number;
}

export interface IEquipo {
  id: number;
  nombre: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  disponible: boolean;
  tipo_equipo_id: number;
  tipo_equipo: {
    id: number;
    nombre: string;
  };
}