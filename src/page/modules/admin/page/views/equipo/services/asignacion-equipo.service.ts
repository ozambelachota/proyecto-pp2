import supabase from "@/api/service-supabase";
import {
  IAsignacionEquipo,
  IAsignacionEquipoWithEquipo,
} from "../types/asignacion-equipo";

export const asignacionEquipoService = {
  getAsignacionEquipo: async (): Promise<IAsignacionEquipoWithEquipo[]> => {
    const response = await supabase
      .from("asignacion_equipos")
      .select("*, equipos(*)");
      console.log(response.data);
    if (response.error) throw new Error(response.error.message);
    return response.data;
  },
  insertAsignacionEquipo: async (AsignacionEquipo: IAsignacionEquipo) => {
    const response = await supabase
      .from("asignacion_equipos")
      .insert(AsignacionEquipo);
    if (response.error) throw new Error(response.error.message);
    return response.data;
  },
  updateAsignacionEquipo: async () => {},
  deleteAsignacionEquipo: async () => {},
};
