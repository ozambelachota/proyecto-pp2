import supabase from "@/api/service-supabase";
import { ITipoEquipo } from "../equipo/types/tipo-equipo";

export const tipoEquipoService = {
  getTipoEquipo: async (): Promise<ITipoEquipo[]> => {
    const response = await supabase.from("tipo_equipo").select("*");
    if (response.error) throw new Error(response.error.message);
    return response.data;
  },
};
