import supabase from "@/api/service-supabase";
import { IEquipo, IEquipoFilter, IFormEquipo } from "../equipo/types/equipo";

export const equipoService = {
  getEquiposFilter: async (_filter: IEquipoFilter): Promise<IEquipo[]> => {
    const query = supabase.from("equipos").select("*, tipo_equipo(*)");
    if (_filter.nombre) query.ilike("nombre", `${_filter.nombre}`);
    if (_filter.marca) query.ilike("marca", `${_filter.marca}`);
    if (_filter.modelo) query.ilike("modelo", `${_filter.modelo}`);
    if (_filter.numero_serie)
      query.ilike("numero_serie", `${_filter.numero_serie}`);
    if (_filter.disponible) query.eq("disponible", `${_filter.disponible}`);
    if (_filter.tipo_equipo_id)
      query.eq("tipo_equipo_id", _filter.tipo_equipo_id);
    const response = await query;
    console.log(response);

    if (response.error) throw new Error(response.error.message);
    return response.data;
  },
  insertEquipo: async (equipo: IFormEquipo) => {
    const response = await supabase.from("equipos").insert(equipo);
    if (response.error) throw new Error(response.error.message);

    return response.data;
  },
};
