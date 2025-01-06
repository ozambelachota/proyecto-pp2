import supabase from "@/api/service-supabase";
import { IFormEquipo } from "../equipo/types/equipo";

export const equipoService = {
  getAllEquipos: async () => {
    const { data, error } = await supabase.from("equipos").select("*");
    if (error) throw new Error(error.message);
    return data;
  },
  insertEquipo: async (equipo: IFormEquipo) => {
    const response = await supabase.from("equipos").insert(equipo);
    if (response.error) throw new Error(response.error.message);

    return response.data;
  },
};