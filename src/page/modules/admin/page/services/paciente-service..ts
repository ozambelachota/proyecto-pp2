import supabase from "@/api/service-supabase";
import { IPaciente, pacienteFilter } from "../types/paciente.interface";

export const pacienteService = {
  getPacientes: async (_filter: pacienteFilter): Promise<IPaciente[]> => {
    let query = supabase.from("paciente").select("*");

    if (_filter.dni) query = query.eq("dni", _filter.dni);
    if (_filter.nombre)
      query = query.ilike("nombre", `${_filter.nombre}`);
    if (_filter.apellido)
      query = query.ilike("apellido", `${_filter.apellido}`);
    if (_filter.genero) query = query.eq("genero", _filter.genero);
    if (_filter.telefono) query = query.eq("telefono", _filter.telefono);
    if (_filter.direccion) query = query.eq("direccion", _filter.direccion);
    if (_filter.fecha_nacimiento)
      query = query.eq("fecha_nacimiento", _filter.fecha_nacimiento);

    const response = await query;
    if (response.error) throw new Error(response.error.message);
    return response.data as IPaciente[];
  },
  updatePaciente: async (paciente: IPaciente, id: number) => {
    console.log(paciente)
    const response = await supabase
      .from("paciente")
      .update(paciente)
      .eq("id", id);
    if (response.error) throw new Error(response.error.message);

    return response.data;
  },
  insertPaciente: async (paciente: IPaciente) => {
    const response = await supabase.from("paciente").insert(paciente);
    if (response.error) throw new Error(response.error.message);

    return response.data;
  },
};
