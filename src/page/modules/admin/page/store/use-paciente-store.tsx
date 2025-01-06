import { create } from "zustand";
import { IPaciente } from "../types/paciente.interface";

interface PacienteState {
  editForm: IPaciente;
  setEditForm: (paciente: IPaciente) => void;
}

export const usePacienteStore = create<PacienteState>()((set) => ({
  editForm: {} as IPaciente,
  setEditForm: (paciente) => set({ editForm: paciente }),
}));
