import supabase from "@/api/service-supabase";
import { IPaciente } from "../types/paciente.interface";

export const pacienteService = {
  getPacientes: async (): Promise<IPaciente[]> => {
    const repsonse = await supabase.from("paciente").select("*");
    if (repsonse.error) throw new Error(repsonse.error.message);

    return repsonse.data as IPaciente[];
  },
  updatePaciente: async (paciente: IPaciente) => {
    const response = await supabase
      .from("paciente")
      .update(paciente)
      .eq("id", paciente.id);
    if (response.error) throw new Error(response.error.message);

    return response.data;
  },
  insertPaciente: async (paciente: IPaciente) => {
    const response = await supabase.from("paciente").insert(paciente);
    if (response.error) throw new Error(response.error.message);

    return response.data;
  },
};
